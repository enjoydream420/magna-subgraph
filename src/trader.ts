import {
  Buy as BuyEvent,
  Sell as SellEvent,
  Reward as RewardEvent,
  WithdrawRewards as WithdrawRewardsEvent,
  Trader
} from "../generated/Trader/Trader"
import {Liquidity} from "../generated/Trader/Liquidity"
import {
  Buy,
  Sell,
  Reward,
  WithdrawRewards,
  UserInfo
} from "../generated/schema"
import { Address } from "@graphprotocol/graph-ts"
import { Subscribe } from "../generated/schema"
import { MLM } from "../generated/MLM/MLM"

const LIQUIDITY_ADDRESS = "0x38582554C16f8630c2FC041554209a99143E356a"
const TRADER_ADDRESS = "0x8F5a4C10d5Fe8C7573658C9b9685391803D2dB9F"
const MLM_ADDRESS = "0x06826Cf3F983315927eecE17829ec244c631ad03"

export function handleBuy(event: BuyEvent): void {
  let entity = new Buy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender_ = event.params.sender_
  entity.usdAmountIn_ = event.params.in_
  entity.magnaAmountOut_ = event.params.out_

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let userInfo = UserInfo.load(event.params.sender_)
  if (userInfo == null) return
  userInfo.totalUsdDeposit = userInfo.totalUsdDeposit.plus(entity.usdAmountIn_)
  userInfo.usdDeposit = userInfo.usdDeposit.plus(entity.usdAmountIn_)
  userInfo.magnaBalance = userInfo.magnaBalance.plus(entity.magnaAmountOut_)
  
  userInfo.save()
}

export function handleSell(
  event: SellEvent
): void {
  let entity = new Sell(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender_ = event.params.sender_
  entity.magnaAmountIn_ = event.params.in_
  entity.usdAmountOut_ = event.params.out_

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let userInfo = UserInfo.load(event.params.sender_)
  if (userInfo == null) return
  let usdDepositAmount = userInfo.usdDeposit.times(entity.magnaAmountIn_).div(userInfo.magnaBalance)
  // change usd and magna balance
  userInfo.usdDeposit = userInfo.usdDeposit.minus(usdDepositAmount)
  userInfo.totalUsdDeposit = userInfo.totalUsdDeposit.minus(usdDepositAmount)
  userInfo.magnaBalance = userInfo.magnaBalance.minus(event.params.out_)
  let reward = entity.usdAmountOut_.minus(usdDepositAmount)
  userInfo.profit = userInfo.profit.plus(reward)
  userInfo.totalProfit = userInfo.totalProfit.plus(reward)
  
  userInfo.save()
}

export function handleReward(event: RewardEvent): void {
  let entity = new Reward(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from_ = event.params.from_
  entity.to_ = event.params.to_
  entity.amount_ = event.params.amount_

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let mlm = MLM.bind(Address.fromString(MLM_ADDRESS))

  let downline = event.params.from_
  for (let i = 0; i < 10; i++) {
    let userInfo = mlm.userInfo(downline)
    let referral = userInfo.referral
    if (referral == event.params.to_) {
      let referralInfo = UserInfo.load(referral)
      if (referralInfo == null) break
      referralInfo.downlineProfits[i] = referralInfo.downlineProfits[i].plus(entity.amount_)
      referralInfo.totalProfit = referralInfo.totalProfit.plus(entity.amount_)
      referralInfo.save()
      break
    }
  }
}

export function handleWithdrawRewards(event: WithdrawRewardsEvent): void {
  let entity = new WithdrawRewards(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feeTo_ = event.params.feeTo_
  entity.amount_ = event.params.amount_

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
