module.exports = class Data1698766551826 {
    name = 'Data1698766551826'

    async up(db) {
        await db.query(`CREATE TABLE "fees_info" ("id" character varying NOT NULL, "balances_withdraw_sum" numeric NOT NULL, "balances_deposit_sum" numeric NOT NULL, "balances_slashed_sum" numeric NOT NULL, "balances_dust_lost_sum" numeric NOT NULL, CONSTRAINT "PK_4356efed40205b53aa157d1fe58" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "fees_info"`)
    }
}
