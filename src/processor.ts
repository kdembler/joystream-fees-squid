import { assertNotNull } from "@subsquid/util-internal";
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from "@subsquid/substrate-processor";

import { events } from "./types";

export const processor = new SubstrateBatchProcessor()
  .setDataSource({
    // Lookup archive by the network name in Subsquid registry
    // See https://docs.subsquid.io/substrate-indexing/supported-networks/
    // archive: lookupArchive('kusama', {release: 'ArrowSquid'}),
    // Chain RPC endpoint is required on Substrate for metadata and real-time updates
    chain: {
      // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
      // https://docs.subsquid.io/deploy-squid/env-variables/
      url: assertNotNull("wss://rpc.joystream.org"),
      // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
      // rateLimit: 10
    },
  })
  .addEvent({
    name: [events.balances.deposit.name],
  })
  .addEvent({
    name: [events.balances.withdraw.name],
  })
  .addEvent({
    name: [events.balances.slashed.name],
  })
  .addEvent({
    name: [events.balances.dustLost.name],
  })
  .setFields({
    event: {
      args: true,
    },
  });

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;