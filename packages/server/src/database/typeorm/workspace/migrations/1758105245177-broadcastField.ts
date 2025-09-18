import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


export class BroadcastField1758105245177 implements MigrationInterface {
    name = 'BroadcastField1758105245177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP CONSTRAINT "FK_633dff016a72f293c5f37abd51f"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP CONSTRAINT "FK_9a6cc62d623a695c8d7348ccd8d"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "broadcastName"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "totalBroadcast"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "totalBroadcastSend"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "isBroadcastDone"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "accountId"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "mailingListId"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "scheduledAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "startedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "completedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "totalContacts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "sentCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "failedCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE TYPE "${schema}"."broadcast_status_enum" AS ENUM('New', 'Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Failed')`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "status" "${schema}"."broadcast_status_enum" NOT NULL DEFAULT 'New'`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "whatsappAccountId" uuid`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "contactListId" uuid`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD CONSTRAINT "FK_0f51743fb975861930c7c3b4b25" FOREIGN KEY ("whatsappAccountId") REFERENCES "${schema}"."whatsAppAccount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD CONSTRAINT "FK_76d56ed3557eb9d4f11334f49b9" FOREIGN KEY ("contactListId") REFERENCES "${schema}"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP CONSTRAINT "FK_76d56ed3557eb9d4f11334f49b9"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP CONSTRAINT "FK_0f51743fb975861930c7c3b4b25"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "contactListId"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "whatsappAccountId"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "${schema}"."broadcast_status_enum"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "failedCount"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "sentCount"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "totalContacts"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "completedAt"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "startedAt"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "scheduledAt"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "mailingListId" uuid`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "accountId" uuid`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "isBroadcastDone" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "totalBroadcastSend" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "totalBroadcast" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "broadcastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD CONSTRAINT "FK_9a6cc62d623a695c8d7348ccd8d" FOREIGN KEY ("accountId") REFERENCES "${schema}"."whatsAppAccount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD CONSTRAINT "FK_633dff016a72f293c5f37abd51f" FOREIGN KEY ("mailingListId") REFERENCES "${schema}"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
