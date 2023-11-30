const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Initialize1701352292712 {
    name = 'Initialize1701352292712'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }
}
