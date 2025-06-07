import { MigrationInterface, QueryRunner } from "typeorm";

export class New1749101477019 implements MigrationInterface {
    name = 'New1749101477019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."MailingContacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactName" character varying NOT NULL, "contactNo" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "mailingListId" uuid, CONSTRAINT "PK_02ba24b71511900125e363bf6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."MailingList" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mailingListName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "workspaceId" uuid, CONSTRAINT "PK_299711d5186281126fbfe146921" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "core"."messages" DROP COLUMN "attachment"`);
        await queryRunner.query(`ALTER TABLE "core"."messages" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "core"."messages" ADD "textMessage" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core"."messages" ADD "attachmentUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD "account" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD "language" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD "headerType" character varying`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD "bodyText" character varying`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD "footerText" character varying`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD "header_handle" character varying`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD "fileUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD "button" json`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD "variables" json`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP CONSTRAINT "FK_51f2194e4a415202512807d2f63"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ALTER COLUMN "ownerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD CONSTRAINT "FK_51f2194e4a415202512807d2f63" FOREIGN KEY ("ownerId") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."MailingContacts" ADD CONSTRAINT "FK_93c100dabc1e97c412b4632a441" FOREIGN KEY ("mailingListId") REFERENCES "core"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."MailingList" ADD CONSTRAINT "FK_fe8a95c141fd38ab1e4ffccc6a6" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."MailingList" DROP CONSTRAINT "FK_fe8a95c141fd38ab1e4ffccc6a6"`);
        await queryRunner.query(`ALTER TABLE "core"."MailingContacts" DROP CONSTRAINT "FK_93c100dabc1e97c412b4632a441"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP CONSTRAINT "FK_51f2194e4a415202512807d2f63"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD CONSTRAINT "FK_51f2194e4a415202512807d2f63" FOREIGN KEY ("ownerId") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."template" DROP COLUMN "variables"`);
        await queryRunner.query(`ALTER TABLE "core"."template" DROP COLUMN "button"`);
        await queryRunner.query(`ALTER TABLE "core"."template" DROP COLUMN "fileUrl"`);
        await queryRunner.query(`ALTER TABLE "core"."template" DROP COLUMN "header_handle"`);
        await queryRunner.query(`ALTER TABLE "core"."template" DROP COLUMN "footerText"`);
        await queryRunner.query(`ALTER TABLE "core"."template" DROP COLUMN "bodyText"`);
        await queryRunner.query(`ALTER TABLE "core"."template" DROP COLUMN "headerType"`);
        await queryRunner.query(`ALTER TABLE "core"."template" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "core"."template" DROP COLUMN "account"`);
        await queryRunner.query(`ALTER TABLE "core"."messages" DROP COLUMN "attachmentUrl"`);
        await queryRunner.query(`ALTER TABLE "core"."messages" DROP COLUMN "textMessage"`);
        await queryRunner.query(`ALTER TABLE "core"."messages" ADD "message" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core"."messages" ADD "attachment" character varying`);
        await queryRunner.query(`DROP TABLE "core"."MailingList"`);
        await queryRunner.query(`DROP TABLE "core"."MailingContacts"`);
    }

}
