import { MigrationInterface, QueryRunner } from "typeorm";

export class New1744796524058 implements MigrationInterface {
    name = 'New1744796524058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."workspace_member_workspace" ("workspaceMemberId" uuid NOT NULL, "workspaceId" uuid NOT NULL, CONSTRAINT "PK_7f0d9989b1dfc117e6aa3e2579d" PRIMARY KEY ("workspaceMemberId", "workspaceId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e3a7e4ea1d013b576b791689e2" ON "core"."workspace_member_workspace" ("workspaceMemberId") `);
        await queryRunner.query(`CREATE INDEX "IDX_42b2adb5a213f2b5c9d98c4b62" ON "core"."workspace_member_workspace" ("workspaceId") `);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member_workspace" ADD CONSTRAINT "FK_e3a7e4ea1d013b576b791689e2a" FOREIGN KEY ("workspaceMemberId") REFERENCES "core"."workspace_member"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member_workspace" ADD CONSTRAINT "FK_42b2adb5a213f2b5c9d98c4b625" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace_member_workspace" DROP CONSTRAINT "FK_42b2adb5a213f2b5c9d98c4b625"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member_workspace" DROP CONSTRAINT "FK_e3a7e4ea1d013b576b791689e2a"`);
        await queryRunner.query(`DROP INDEX "core"."IDX_42b2adb5a213f2b5c9d98c4b62"`);
        await queryRunner.query(`DROP INDEX "core"."IDX_e3a7e4ea1d013b576b791689e2"`);
        await queryRunner.query(`DROP TABLE "core"."workspace_member_workspace"`);
    }

}
