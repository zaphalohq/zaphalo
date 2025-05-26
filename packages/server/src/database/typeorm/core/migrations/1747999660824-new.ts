import { MigrationInterface, QueryRunner } from "typeorm";

export class New1747999660824 implements MigrationInterface {
    name = 'New1747999660824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."MailingContacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactName" character varying NOT NULL, "contactNo" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "mailingListId" uuid, CONSTRAINT "PK_02ba24b71511900125e363bf6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."MailingList" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mailingListName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "workspaceId" uuid, CONSTRAINT "PK_299711d5186281126fbfe146921" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "core"."workspace_member_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD "role" "core"."workspace_member_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "core"."MailingContacts" ADD CONSTRAINT "FK_93c100dabc1e97c412b4632a441" FOREIGN KEY ("mailingListId") REFERENCES "core"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."MailingList" ADD CONSTRAINT "FK_fe8a95c141fd38ab1e4ffccc6a6" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."MailingList" DROP CONSTRAINT "FK_fe8a95c141fd38ab1e4ffccc6a6"`);
        await queryRunner.query(`ALTER TABLE "core"."MailingContacts" DROP CONSTRAINT "FK_93c100dabc1e97c412b4632a441"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "core"."workspace_member_role_enum"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD "role" character varying(50) NOT NULL DEFAULT 'member'`);
        await queryRunner.query(`DROP TABLE "core"."MailingList"`);
        await queryRunner.query(`DROP TABLE "core"."MailingContacts"`);
    }

}
