import { MigrationInterface, QueryRunner } from "typeorm";

export class New1745214951985 implements MigrationInterface {
    name = 'New1745214951985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."contacts" ADD "workspaceId" uuid`);
        await queryRunner.query(`ALTER TABLE "core"."instants" ADD "workspaceId" uuid`);
        await queryRunner.query(`ALTER TABLE "core"."contacts" ADD CONSTRAINT "FK_60c505f7ac4b3dae62c6fbc486f" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."instants" ADD CONSTRAINT "FK_6c288de3c87c712084b788dd915" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."instants" DROP CONSTRAINT "FK_6c288de3c87c712084b788dd915"`);
        await queryRunner.query(`ALTER TABLE "core"."contacts" DROP CONSTRAINT "FK_60c505f7ac4b3dae62c6fbc486f"`);
        await queryRunner.query(`ALTER TABLE "core"."instants" DROP COLUMN "workspaceId"`);
        await queryRunner.query(`ALTER TABLE "core"."contacts" DROP COLUMN "workspaceId"`);
    }

}
