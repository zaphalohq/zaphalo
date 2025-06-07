import { MigrationInterface, QueryRunner } from "typeorm";

export class New1749213717068 implements MigrationInterface {
    name = 'New1749213717068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."broadcast" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "broadcastName" character varying NOT NULL, "isBroadcastDone" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "templateId" uuid, "mailingListId" uuid, "workspaceId" uuid, CONSTRAINT "REL_5381c67c66d71724d2cd789a0f" UNIQUE ("templateId"), CONSTRAINT "REL_633dff016a72f293c5f37abd51" UNIQUE ("mailingListId"), CONSTRAINT "PK_0ded4e27b42c4b2589e70095aa9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."broadcastContacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "broadcastId" uuid, "mailingContactsId" uuid, CONSTRAINT "PK_3614c6ab3817a2667acb7a1a8e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" ADD CONSTRAINT "FK_5381c67c66d71724d2cd789a0f5" FOREIGN KEY ("templateId") REFERENCES "core"."template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" ADD CONSTRAINT "FK_633dff016a72f293c5f37abd51f" FOREIGN KEY ("mailingListId") REFERENCES "core"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" ADD CONSTRAINT "FK_bf9b7ac3cd047bb09ef856a2fcd" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" ADD CONSTRAINT "FK_7092489055547081967aea08915" FOREIGN KEY ("broadcastId") REFERENCES "core"."broadcast"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" ADD CONSTRAINT "FK_6283464be8473d0f49d855b9a79" FOREIGN KEY ("mailingContactsId") REFERENCES "core"."MailingContacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" DROP CONSTRAINT "FK_6283464be8473d0f49d855b9a79"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" DROP CONSTRAINT "FK_7092489055547081967aea08915"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" DROP CONSTRAINT "FK_bf9b7ac3cd047bb09ef856a2fcd"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" DROP CONSTRAINT "FK_633dff016a72f293c5f37abd51f"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" DROP CONSTRAINT "FK_5381c67c66d71724d2cd789a0f5"`);
        await queryRunner.query(`DROP TABLE "core"."broadcastContacts"`);
        await queryRunner.query(`DROP TABLE "core"."broadcast"`);
    }

}
