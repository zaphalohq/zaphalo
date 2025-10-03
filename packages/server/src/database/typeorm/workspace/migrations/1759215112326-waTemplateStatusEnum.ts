import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class WATemplateStatusEnum1759215112326 implements MigrationInterface {
    name = 'WATemplateStatusEnum1759215112326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "quality"`);
        await queryRunner.query(`CREATE TYPE "${schema}"."whatsAppTemplate_quality_enum" AS ENUM('None', 'Red', 'Yellow', 'Green')`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "quality" "${schema}"."whatsAppTemplate_quality_enum" DEFAULT 'None'`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "${schema}"."whatsAppTemplate_status_enum" AS ENUM('New', 'Pending', 'In Appeal', 'Approved', 'Paused', 'Disabled', 'Rejected', 'Pending Deletion', 'Deleted', 'Limit Exceeded')`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "status" "${schema}"."whatsAppTemplate_status_enum" DEFAULT 'New'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "${schema}"."whatsAppTemplate_status_enum"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "quality"`);
        await queryRunner.query(`DROP TYPE "${schema}"."whatsAppTemplate_quality_enum"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "quality" character varying NOT NULL DEFAULT 'none'`);
    }

}
