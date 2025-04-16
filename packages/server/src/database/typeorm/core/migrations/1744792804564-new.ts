import { MigrationInterface, QueryRunner } from "typeorm";

export class New1744792804564 implements MigrationInterface {
    name = 'New1744792804564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."workspace_members" ("workspaceId" uuid NOT NULL, "membersWorkspaceId" uuid NOT NULL, CONSTRAINT "PK_c59ee76c234206c9562ceb2bc71" PRIMARY KEY ("workspaceId", "membersWorkspaceId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0dd45cb52108d0664df4e7e33e" ON "core"."workspace_members" ("workspaceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d2f78cd7ff0e34c6733805f417" ON "core"."workspace_members" ("membersWorkspaceId") `);
        await queryRunner.query(`ALTER TABLE "core"."workspace_members" ADD CONSTRAINT "FK_0dd45cb52108d0664df4e7e33e6" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_members" ADD CONSTRAINT "FK_d2f78cd7ff0e34c6733805f417f" FOREIGN KEY ("membersWorkspaceId") REFERENCES "core"."workspace_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace_members" DROP CONSTRAINT "FK_d2f78cd7ff0e34c6733805f417f"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_members" DROP CONSTRAINT "FK_0dd45cb52108d0664df4e7e33e6"`);
        await queryRunner.query(`DROP INDEX "core"."IDX_d2f78cd7ff0e34c6733805f417"`);
        await queryRunner.query(`DROP INDEX "core"."IDX_0dd45cb52108d0664df4e7e33e"`);
        await queryRunner.query(`DROP TABLE "core"."workspace_members"`);
    }

}
