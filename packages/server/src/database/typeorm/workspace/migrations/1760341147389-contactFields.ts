import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class ContactFields1760341147389 implements MigrationInterface {
    name = 'ContactFields1760341147389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" DROP CONSTRAINT "FK_93c100dabc1e97c412b4632a441"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "defaultContact"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "street" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "zipcode" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "phoneNo"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "phoneNo" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" ADD CONSTRAINT "FK_93c100dabc1e97c412b4632a441" FOREIGN KEY ("mailingListId") REFERENCES "${schema}"."MailingList"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" DROP CONSTRAINT "FK_93c100dabc1e97c412b4632a441"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "phoneNo"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "phoneNo" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "zipcode"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "street"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "defaultContact" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" ADD CONSTRAINT "FK_93c100dabc1e97c412b4632a441" FOREIGN KEY ("mailingListId") REFERENCES "${schema}"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
