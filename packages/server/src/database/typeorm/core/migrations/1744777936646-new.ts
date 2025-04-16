import { MigrationInterface, QueryRunner } from "typeorm";

export class New1744777936646 implements MigrationInterface {
    name = 'New1744777936646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."contacts" DROP COLUMN "createdUserId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."contacts" ADD "createdUserId" character varying`);
    }

}
