import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1000 from '../v1000'

export const dustLost =  {
    name: 'Balances.DustLost',
    /**
     * An account was removed whose balance was non-zero but below ExistentialDeposit,
     * resulting in an outright loss.
     */
    v1000: new EventType(
        'Balances.DustLost',
        sts.struct({
            account: v1000.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const deposit =  {
    name: 'Balances.Deposit',
    /**
     * Some amount was deposited (e.g. for transaction fees).
     */
    v1000: new EventType(
        'Balances.Deposit',
        sts.struct({
            who: v1000.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const withdraw =  {
    name: 'Balances.Withdraw',
    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees).
     */
    v1000: new EventType(
        'Balances.Withdraw',
        sts.struct({
            who: v1000.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const slashed =  {
    name: 'Balances.Slashed',
    /**
     * Some amount was removed from the account (e.g. for misbehavior).
     */
    v1000: new EventType(
        'Balances.Slashed',
        sts.struct({
            who: v1000.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
