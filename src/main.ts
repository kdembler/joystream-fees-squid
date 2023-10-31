import { TypeormDatabase, Store } from "@subsquid/typeorm-store";

import { processor, ProcessorContext } from "./processor";
import { FeesInfo } from "./model";
import { events } from "./types";

interface DepositEvent {
  who: string;
  amount: bigint;
}

interface WithdrawEvent {
  who: string;
  amount: bigint;
}

interface SlashedEvent {
  who: string;
  amount: bigint;
}

interface DustLostEvent {
  account: string;
  amount: bigint;
}

interface BalanceEvents {
  depositEvents: DepositEvent[];
  withdrawEvents: WithdrawEvent[];
  slashedEvents: SlashedEvent[];
  dustLostEvents: DustLostEvent[];
}

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const balanceEvents = getBalanceEvents(ctx);
  await updateFeesInfo(ctx, balanceEvents);
});

function getBalanceEvents(ctx: ProcessorContext<Store>): BalanceEvents {
  const depositEvents: DepositEvent[] = [];
  const withdrawEvents: WithdrawEvent[] = [];
  const slashedEvents: SlashedEvent[] = [];
  const dustLostEvents: DustLostEvent[] = [];

  for (let block of ctx.blocks) {
    for (let event of block.events) {
      if (event.name == events.balances.deposit.name) {
        if (events.balances.deposit.v1000.is(event)) {
          const { who, amount } = events.balances.deposit.v1000.decode(event);
          depositEvents.push({ who, amount });
        } else {
          throw new Error("Unsupported spec");
        }
      }
      if (event.name == events.balances.withdraw.name) {
        if (events.balances.withdraw.v1000.is(event)) {
          const { who, amount } = events.balances.withdraw.v1000.decode(event);
          withdrawEvents.push({ who, amount });
        } else {
          throw new Error("Unsupported spec");
        }
      }
      if (event.name == events.balances.slashed.name) {
        if (events.balances.slashed.v1000.is(event)) {
          const { who, amount } = events.balances.slashed.v1000.decode(event);
          slashedEvents.push({ who, amount });
        } else {
          throw new Error("Unsupported spec");
        }
      }
      if (event.name == events.balances.dustLost.name) {
        if (events.balances.dustLost.v1000.is(event)) {
          const { account, amount } =
            events.balances.dustLost.v1000.decode(event);
          dustLostEvents.push({ account, amount });
        } else {
          throw new Error("Unsupported spec");
        }
      }
    }
  }
  return { depositEvents, withdrawEvents, slashedEvents, dustLostEvents };
}

async function updateFeesInfo(
  ctx: ProcessorContext<Store>,
  balanceEvents: BalanceEvents
): Promise<void> {
  const DOC_ID = "feesInfo";

  const { depositEvents, withdrawEvents, slashedEvents, dustLostEvents } =
    balanceEvents;
  const summedDeposits = depositEvents.reduce(
    (acc, { amount }) => acc + amount,
    0n
  );
  const summedWithdraws = withdrawEvents.reduce(
    (acc, { amount }) => acc + amount,
    0n
  );
  const summedSlashed = slashedEvents.reduce(
    (acc, { amount }) => acc + amount,
    0n
  );
  const summedDustLost = dustLostEvents.reduce(
    (acc, { amount }) => acc + amount,
    0n
  );

  const currentFeesInfo = await ctx.store.findOne(FeesInfo, {
    where: { id: DOC_ID },
  });
  if (currentFeesInfo) {
    currentFeesInfo.balancesDepositSum += summedDeposits;
    currentFeesInfo.balancesWithdrawSum += summedWithdraws;
    currentFeesInfo.balancesSlashedSum += summedSlashed;
    currentFeesInfo.balancesDustLostSum += summedDustLost;
    await ctx.store.upsert(currentFeesInfo);
  } else {
    const newFeesInfo = new FeesInfo({
      id: DOC_ID,
      balancesDepositSum: summedDeposits,
      balancesWithdrawSum: summedWithdraws,
      balancesSlashedSum: summedSlashed,
      balancesDustLostSum: summedDustLost,
    });
    await ctx.store.insert(newFeesInfo);
  }
}
