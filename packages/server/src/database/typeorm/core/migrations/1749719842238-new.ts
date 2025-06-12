import { MigrationInterface, QueryRunner } from "typeorm";

export class New1749719842238 implements MigrationInterface {
    name = 'New1749719842238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."user" ADD "fullName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."user" DROP COLUMN "fullName"`);
    }

}
