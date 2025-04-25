import { MigrationInterface, QueryRunner } from "typeorm";

export class New1745566192196 implements MigrationInterface {
    name = 'New1745566192196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."instants" RENAME COLUMN "select" TO "defaultSelected"`);
        await queryRunner.query(`ALTER TABLE "core"."contacts" ADD "defaultContact" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."contacts" DROP COLUMN "defaultContact"`);
        await queryRunner.query(`ALTER TABLE "core"."instants" RENAME COLUMN "defaultSelected" TO "select"`);
    }

}
