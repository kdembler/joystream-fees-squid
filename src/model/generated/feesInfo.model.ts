import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class FeesInfo {
    constructor(props?: Partial<FeesInfo>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balancesWithdrawSum!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balancesDepositSum!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balancesSlashedSum!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balancesDustLostSum!: bigint
}
