import { Connection as ConnectionEvent } from "../generated/ConnectionManager/ConnectionManager"
import { Connection } from "../generated/schema"

export function handleConnection(event: ConnectionEvent): void {
  let entity = new Connection(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.connector = event.params.connector
  entity.recipent = event.params.recipent

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
