import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class BroadcastTrace1760246842309 implements MigrationInterface {
    name = 'BroadcastTrace1760246842309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`CREATE TABLE "${schema}"."broadcastTrace" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mobile" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "broadcastId" uuid, "whatsAppMesssageId" uuid, CONSTRAINT "PK_fba4d21e0832aeb0dc32917db65" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcastTrace" ADD CONSTRAINT "FK_3ef61eda606081a318703bbe33e" FOREIGN KEY ("broadcastId") REFERENCES "${schema}"."broadcast"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcastTrace" ADD CONSTRAINT "FK_88bc8fd3a48b643655c3eda2435" FOREIGN KEY ("whatsAppMesssageId") REFERENCES "${schema}"."whatsAppMessage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcastTrace" DROP CONSTRAINT "FK_88bc8fd3a48b643655c3eda2435"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcastTrace" DROP CONSTRAINT "FK_3ef61eda606081a318703bbe33e"`);
        await queryRunner.query(`DROP TABLE "${schema}"."broadcastTrace"`);
    }

}
