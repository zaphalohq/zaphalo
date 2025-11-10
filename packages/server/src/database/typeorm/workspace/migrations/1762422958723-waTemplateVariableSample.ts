import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


export class WaTemplateVariableSample1762422958723 implements MigrationInterface {
    name = 'WaTemplateVariableSample1762422958723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."whatsappTemplateVariable" ADD "sampleValue" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."whatsappTemplateVariable" DROP COLUMN "sampleValue"`);
    }

}
