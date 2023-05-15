import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  ChangeSubscription as ChangeSubscriptionEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Subscribe as SubscribeEvent
} from "../generated/MLM/MLM"
import {
  ChangeSubscription,
  OwnershipTransferred,
  Subscribe,
  UserInfo
} from "../generated/schema"

const ROOT_REFERRAL = "0x6f0f1B0fa7A150f17490b2369852c5d0f5D2C9d4"

export function handleChangeSubscription(event: ChangeSubscriptionEvent): void {
  let entity = new ChangeSubscription(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.index_ = event.params.index_
  entity.subscription__openLimit = event.params.subscription_.openLimit
  entity.subscription__depositMax = event.params.subscription_.depositMax
  entity.subscription__livePeriod = event.params.subscription_.livePeriod
  entity.subscription__price = event.params.subscription_.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscribe(event: SubscribeEvent): void {
  let entity = new Subscribe(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user_ = event.params.user_
  entity.registeredAt_ = event.params.registeredAt_
  entity.subscriptionLevel_ = event.params.subscriptionLevel_
  entity.referral_ = event.params.referral_

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let userInfo = UserInfo.load(event.params.user_)
  if (userInfo == null) {
    userInfo = new UserInfo(event.params.user_)
    userInfo.address = event.params.user_
    userInfo.usdDeposit = BigInt.zero()
    userInfo.totalUsdDeposit = BigInt.zero()
    userInfo.profit = BigInt.zero()
    userInfo.totalProfit = BigInt.zero()
    userInfo.downlineProfits = [BigInt.zero(), BigInt.zero(), BigInt.zero(), BigInt.zero(), BigInt.zero()]
    userInfo.magnaBalance = BigInt.zero()
    userInfo.downline1 = []
    userInfo.downline2 = []
    userInfo.downline3 = []
    userInfo.downline4 = []
    userInfo.downline5 = []
  } else {
    let subscribe = Subscribe.load(userInfo.subscribe)
    if (subscribe != null) {
      let referralInfo = UserInfo.load(subscribe.referral_)
      if (referralInfo != null) {
        let user = event.params.user_
        for (let i = 0; i < referralInfo.downline1.length; i++) {
          if (user == referralInfo.downline1[i]) {
            referralInfo.downline1.splice(i, 1)
            break
          }
        }
        for (let i = 0; i < userInfo.downline1.length; i++) {
          let downline = userInfo.downline1[i]
          for (let j = 0; j < referralInfo.downline2.length; j++) {
            if (downline == referralInfo.downline2[j]) {
              referralInfo.downline2.splice(j, 1)
              break
            }
          }
        }
        for (let i = 0; i < userInfo.downline2.length; i++) {
          let downline = userInfo.downline2[i]
          for (let j = 0; j < referralInfo.downline3.length; j++) {
            if (downline == referralInfo.downline3[j]) {
              referralInfo.downline3.splice(j, 1)
              break
            }
          }
        }
        for (let i = 0; i < userInfo.downline3.length; i++) {
          let downline = userInfo.downline3[i]
          for (let j = 0; j < referralInfo.downline4.length; j++) {
            if (downline == referralInfo.downline4[j]) {
              referralInfo.downline4.splice(j, 1)
              break
            }
          }
        }
        for (let i = 0; i < userInfo.downline4.length; i++) {
          let downline = userInfo.downline4[i]
          for (let j = 0; j < referralInfo.downline5.length; j++) {
            if (downline == referralInfo.downline5[j]) {
              referralInfo.downline5.splice(j, 1)
              break
            }
          }
        }
        referralInfo.save()
        subscribe = Subscribe.load(referralInfo.subscribe)
        if (subscribe != null) {
          referralInfo = UserInfo.load(subscribe.referral_)
          if (referralInfo != null) {
            for (let i = 0; i < referralInfo.downline2.length; i++) {
              if (user == referralInfo.downline2[i]) {
                referralInfo.downline2.splice(i, 1)
                break
              }
            }
            for (let i = 0; i < userInfo.downline1.length; i++) {
              let downline = userInfo.downline1[i]
              for (let j = 0; j < referralInfo.downline3.length; j++) {
                if (downline == referralInfo.downline3[j]) {
                  referralInfo.downline3.splice(j, 1)
                  break
                }
              }
            }
            for (let i = 0; i < userInfo.downline2.length; i++) {
              let downline = userInfo.downline2[i]
              for (let j = 0; j < referralInfo.downline4.length; j++) {
                if (downline == referralInfo.downline4[j]) {
                  referralInfo.downline4.splice(j, 1)
                  break
                }
              }
            }
            for (let i = 0; i < userInfo.downline3.length; i++) {
              let downline = userInfo.downline3[i]
              for (let j = 0; j < referralInfo.downline5.length; j++) {
                if (downline == referralInfo.downline5[j]) {
                  referralInfo.downline5.splice(j, 1)
                  break
                }
              }
            }
            referralInfo.save()
            subscribe = Subscribe.load(referralInfo.subscribe)
            if (subscribe != null) {
              referralInfo = UserInfo.load(subscribe.referral_)
              if (referralInfo != null) {
                for (let i = 0; i < referralInfo.downline3.length; i++) {
                  if (user == referralInfo.downline3[i]) {
                    referralInfo.downline3.splice(i, 1)
                    break
                  }
                }
                for (let i = 0; i < userInfo.downline1.length; i++) {
                  let downline = userInfo.downline1[i]
                  for (let j = 0; j < referralInfo.downline4.length; j++) {
                    if (downline == referralInfo.downline4[j]) {
                      referralInfo.downline4.splice(j, 1)
                      break
                    }
                  }
                }
                for (let i = 0; i < userInfo.downline2.length; i++) {
                  let downline = userInfo.downline2[i]
                  for (let j = 0; j < referralInfo.downline5.length; j++) {
                    if (downline == referralInfo.downline5[j]) {
                      referralInfo.downline5.splice(j, 1)
                      break
                    }
                  }
                }
                referralInfo.save()
                subscribe = Subscribe.load(referralInfo.subscribe)
                if (subscribe != null) {
                  referralInfo = UserInfo.load(subscribe.referral_)
                  if (referralInfo != null) {
                    for (let i = 0; i < referralInfo.downline4.length; i++) {
                      if (user == referralInfo.downline4[i]) {
                        referralInfo.downline4.splice(i, 1)
                        break
                      }
                    }
                    for (let i = 0; i < userInfo.downline1.length; i++) {
                      let downline = userInfo.downline1[i]
                      for (let j = 0; j < referralInfo.downline5.length; j++) {
                        if (downline == referralInfo.downline5[j]) {
                          referralInfo.downline5.splice(j, 1)
                          break
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  let referral = event.params.referral_
  let referralInfo = UserInfo.load(referral)
  if (referralInfo != null) {
    let user = entity.user_
    referralInfo.downline1 = referralInfo.downline1.concat([user])
    referralInfo.downline2 = referralInfo.downline2.concat(userInfo.downline1)
    referralInfo.downline3 = referralInfo.downline3.concat(userInfo.downline2)
    referralInfo.downline4 = referralInfo.downline4.concat(userInfo.downline3)
    referralInfo.downline5 = referralInfo.downline5.concat(userInfo.downline4)
    referralInfo.save()
    let referralSubscribe = Subscribe.load(referralInfo.subscribe)
    if (referralSubscribe != null) {
      referralInfo = UserInfo.load(referralSubscribe.referral_)
      if (referralInfo != null) {
        referralInfo.downline2 = referralInfo.downline2.concat([user])
        referralInfo.downline3 = referralInfo.downline3.concat(userInfo.downline1)
        referralInfo.downline4 = referralInfo.downline4.concat(userInfo.downline2)
        referralInfo.downline5 = referralInfo.downline5.concat(userInfo.downline3)
        referralInfo.save()
        referralSubscribe = Subscribe.load(referralInfo.subscribe)
        if (referralSubscribe != null) {
          referralInfo = UserInfo.load(referralInfo.subscribe)
          if (referralInfo != null) {
            referralInfo.downline3 = referralInfo.downline3.concat([user])
            referralInfo.downline4 = referralInfo.downline4.concat(userInfo.downline1)
            referralInfo.downline5 = referralInfo.downline5.concat(userInfo.downline2)
            referralInfo.save()
            referralSubscribe = Subscribe.load(referralInfo.subscribe)
            if (referralSubscribe != null) {
              referralInfo = UserInfo.load(referralInfo.subscribe)
              if (referralInfo != null) {
                referralInfo.downline4 = referralInfo.downline4.concat([user])
                referralInfo.downline5 = referralInfo.downline5.concat(userInfo.downline1)
                referralInfo.save()
                referralSubscribe = Subscribe.load(referralInfo.subscribe)
                if (referralSubscribe != null) {
                  referralInfo = UserInfo.load(referralInfo.subscribe)
                  if (referralInfo != null) {
                    referralInfo.downline5.push(user)
                    referralInfo.save()
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  userInfo.subscribe = entity.id

  userInfo.save()
}
