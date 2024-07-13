import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { Connection } from "../generated/ConnectionManager/ConnectionManager"

export function createConnectionEvent(
  connector: Address,
  recipent: Address
): Connection {
  let connectionEvent = changetype<Connection>(newMockEvent())

  connectionEvent.parameters = new Array()

  connectionEvent.parameters.push(
    new ethereum.EventParam("connector", ethereum.Value.fromAddress(connector))
  )
  connectionEvent.parameters.push(
    new ethereum.EventParam("recipent", ethereum.Value.fromAddress(recipent))
  )

  return connectionEvent
}
