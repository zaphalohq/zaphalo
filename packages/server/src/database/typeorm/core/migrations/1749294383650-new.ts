import { MigrationInterface, QueryRunner } from "typeorm";

export class New1749294383650 implements MigrationInterface {
    name = 'New1749294383650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" DROP CONSTRAINT "FK_6283464be8473d0f49d855b9a79"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" DROP COLUMN "mailingContactsId"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" ADD "variables" text array`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" ADD "URL" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."broadcast" DROP COLUMN "URL"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" DROP COLUMN "variables"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" ADD "mailingContactsId" uuid`);
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" ADD CONSTRAINT "FK_6283464be8473d0f49d855b9a79" FOREIGN KEY ("mailingContactsId") REFERENCES "core"."MailingContacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
