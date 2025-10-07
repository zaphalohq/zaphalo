import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


export class New1759747194152 implements MigrationInterface {
    name = 'New1759747194152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" DROP CONSTRAINT "FK_93c100dabc1e97c412b4632a441"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "addressStreet" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "addressLandmark" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "addressCity" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "addressState" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "addressCountry" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "addressPincode" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" ADD CONSTRAINT "FK_93c100dabc1e97c412b4632a441" FOREIGN KEY ("mailingListId") REFERENCES "${schema}"."MailingList"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" DROP CONSTRAINT "FK_93c100dabc1e97c412b4632a441"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "addressPincode"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "addressCountry"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "addressState"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "addressCity"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "addressLandmark"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "addressStreet"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" ADD CONSTRAINT "FK_93c100dabc1e97c412b4632a441" FOREIGN KEY ("mailingListId") REFERENCES "MailingList"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
