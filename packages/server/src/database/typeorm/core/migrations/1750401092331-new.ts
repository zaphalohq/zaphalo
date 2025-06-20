import { MigrationInterface, QueryRunner } from "typeorm";

export class New1750401092331 implements MigrationInterface {
    name = 'New1750401092331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD "isWorkspaceSetup" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD "profileImg" character varying`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP COLUMN "profileImg"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP COLUMN "isWorkspaceSetup"`);
    }

}
