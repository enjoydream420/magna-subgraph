import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ChangeSubscription,
  OwnershipTransferred,
  Subscribe
} from "../generated/mlm/mlm"

export function createChangeSubscriptionEvent(
  index_: BigInt,
  subscription_: ethereum.Tuple
): ChangeSubscription {
  let changeSubscriptionEvent = changetype<ChangeSubscription>(newMockEvent())

  changeSubscriptionEvent.parameters = new Array()

  changeSubscriptionEvent.parameters.push(
    new ethereum.EventParam("index_", ethereum.Value.fromUnsignedBigInt(index_))
  )
  changeSubscriptionEvent.parameters.push(
    new ethereum.EventParam(
      "subscription_",
      ethereum.Value.fromTuple(subscription_)
    )
  )

  return changeSubscriptionEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSubscribeEvent(
  user_: Address,
  registeredAt_: BigInt,
  subscriptionLevel_: BigInt,
  referral_: Address
): Subscribe {
  let subscribeEvent = changetype<Subscribe>(newMockEvent())

  subscribeEvent.parameters = new Array()

  subscribeEvent.parameters.push(
    new ethereum.EventParam("user_", ethereum.Value.fromAddress(user_))
  )
  subscribeEvent.parameters.push(
    new ethereum.EventParam(
      "registeredAt_",
      ethereum.Value.fromUnsignedBigInt(registeredAt_)
    )
  )
  subscribeEvent.parameters.push(
    new ethereum.EventParam(
      "subscriptionLevel_",
      ethereum.Value.fromUnsignedBigInt(subscriptionLevel_)
    )
  )
  subscribeEvent.parameters.push(
    new ethereum.EventParam("referral_", ethereum.Value.fromAddress(referral_))
  )

  return subscribeEvent
}
