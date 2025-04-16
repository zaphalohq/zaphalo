import { MigrationInterface, QueryRunner } from "typeorm";

export class New1744792047210 implements MigrationInterface {
    name = 'New1744792047210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."workspace_members_workspace_member" ("workspaceId" uuid NOT NULL, "workspaceMemberId" uuid NOT NULL, CONSTRAINT "PK_50afac1d3b8da1ca8803c9af501" PRIMARY KEY ("workspaceId", "workspaceMemberId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_98c200dd18c2f43fc03cd6391c" ON "core"."workspace_members_workspace_member" ("workspaceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d883e9ee9bc978707b42bd1301" ON "core"."workspace_members_workspace_member" ("workspaceMemberId") `);
        await queryRunner.query(`ALTER TABLE "core"."workspace_members_workspace_member" ADD CONSTRAINT "FK_98c200dd18c2f43fc03cd6391cf" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_members_workspace_member" ADD CONSTRAINT "FK_d883e9ee9bc978707b42bd1301c" FOREIGN KEY ("workspaceMemberId") REFERENCES "core"."workspace_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace_members_workspace_member" DROP CONSTRAINT "FK_d883e9ee9bc978707b42bd1301c"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_members_workspace_member" DROP CONSTRAINT "FK_98c200dd18c2f43fc03cd6391cf"`);
        await queryRunner.query(`DROP INDEX "core"."IDX_d883e9ee9bc978707b42bd1301"`);
        await queryRunner.query(`DROP INDEX "core"."IDX_98c200dd18c2f43fc03cd6391c"`);
        await queryRunner.query(`DROP TABLE "core"."workspace_members_workspace_member"`);
    }

}
