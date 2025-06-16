import { MigrationInterface, QueryRunner } from "typeorm";

export class New1749800482160 implements MigrationInterface {
    name = 'New1749800482160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "core"."user" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "core"."user" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "core"."user" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "core"."user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ALTER COLUMN "workspaceId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core"."user" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "core"."user" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "core"."user" ADD "fullName" character varying`);
        await queryRunner.query(`ALTER TABLE "core"."user" ADD "username" character varying NOT NULL`);
    }

}
