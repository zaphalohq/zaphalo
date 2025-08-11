import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class NullableAttachment1754471227109 implements MigrationInterface {
    name = 'NullableAttachment1754471227109'

    public async up(queryRunner: QueryRunner): Promise<void> {
                const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" ADD "attachmentId" uuid`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" ADD CONSTRAINT "UQ_a736df8790a3a7e283e0d4153ea" UNIQUE ("attachmentId")`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" ADD CONSTRAINT "FK_a736df8790a3a7e283e0d4153ea" FOREIGN KEY ("attachmentId") REFERENCES "${schema}"."attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
                const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" DROP CONSTRAINT "FK_a736df8790a3a7e283e0d4153ea"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" DROP CONSTRAINT "UQ_a736df8790a3a7e283e0d4153ea"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" DROP COLUMN "attachmentId"`);
    }

}
