import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


export class WaTemplatesAndBroadcastLimit1762772242166 implements MigrationInterface {
    name = 'WaTemplatesAndBroadcastLimit1762772242166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`CREATE TABLE "${schema}"."whatsappTemplateButton" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "text" character varying NOT NULL, "url" character varying, "phone_number" character varying, "templateId" uuid, CONSTRAINT "PK_4535640ae18de212f9a546c19b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "${schema}"."whatsappTemplateVariable_type_enum" AS ENUM('STATIC', 'DYNAMIC')`);
        await queryRunner.query(`CREATE TABLE "${schema}"."whatsappTemplateVariable" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "${schema}"."whatsappTemplateVariable_type_enum" NOT NULL DEFAULT 'STATIC', "value" character varying, "dynamicField" character varying, "sampleValue" character varying, "templateId" uuid, CONSTRAINT "PK_f5f6983414d22d4360b5f426eaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "button"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "variables"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "limit" integer`);
        await queryRunner.query(`CREATE TYPE "${schema}"."broadcast_intervaltype_enum" AS ENUM('MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH')`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "intervalType" "${schema}"."broadcast_intervaltype_enum"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsappTemplateButton" ADD CONSTRAINT "FK_da157720b79f3f2410e6b530d81" FOREIGN KEY ("templateId") REFERENCES "${schema}"."whatsAppTemplate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsappTemplateVariable" ADD CONSTRAINT "FK_cc23aa3abfd0a2e629a2066fd09" FOREIGN KEY ("templateId") REFERENCES "${schema}"."whatsAppTemplate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."whatsappTemplateVariable" DROP CONSTRAINT "FK_cc23aa3abfd0a2e629a2066fd09"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsappTemplateButton" DROP CONSTRAINT "FK_da157720b79f3f2410e6b530d81"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "intervalType"`);
        await queryRunner.query(`DROP TYPE "${schema}"."broadcast_intervaltype_enum"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "limit"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "variables" json`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "button" json`);
        await queryRunner.query(`DROP TABLE "${schema}"."whatsappTemplateVariable"`);
        await queryRunner.query(`DROP TYPE "${schema}"."whatsappTemplateVariable_type_enum"`);
        await queryRunner.query(`DROP TABLE "${schema}"."whatsappTemplateButton"`);
    }

}
