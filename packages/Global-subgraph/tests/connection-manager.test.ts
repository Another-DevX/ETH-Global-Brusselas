import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { Connection } from "../generated/schema"
import { Connection as ConnectionEvent } from "../generated/ConnectionManager/ConnectionManager"
import { handleConnection } from "../src/connection-manager"
import { createConnectionEvent } from "./connection-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let connector = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let recipent = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newConnectionEvent = createConnectionEvent(connector, recipent)
    handleConnection(newConnectionEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Connection created and stored", () => {
    assert.entityCount("Connection", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Connection",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "connector",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Connection",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "recipent",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
