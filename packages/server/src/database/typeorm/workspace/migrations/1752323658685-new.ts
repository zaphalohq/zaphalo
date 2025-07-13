import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class New1752323658685 implements MigrationInterface {
    name = 'New1752323658685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`CREATE TABLE "${schema}"."MailingContacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactName" character varying NOT NULL, "contactNo" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "mailingListId" uuid, CONSTRAINT "PK_02ba24b71511900125e363bf6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."MailingList" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mailingListName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_299711d5186281126fbfe146921" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."instants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "appId" character varying NOT NULL, "phoneNumberId" character varying NOT NULL, "businessAccountId" character varying NOT NULL, "accessToken" character varying NOT NULL, "appSecret" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "defaultSelected" boolean, CONSTRAINT "PK_a71121edaef68446bb281ec042e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactName" character varying NOT NULL, "phoneNo" bigint NOT NULL, "profileImg" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "defaultContact" boolean DEFAULT false, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channelName" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "writeDate" TIMESTAMP NOT NULL DEFAULT now(), "membersidsss" character varying, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "textMessage" character varying NOT NULL, "attachmentUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "unseen" boolean NOT NULL DEFAULT false, "channelId" uuid, "senderId" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."whatsAppTemplate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account" character varying, "templateName" character varying, "status" character varying, "templateId" character varying, "category" character varying, "language" character varying, "rawComponents" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_446bdd7de9665979408947ee682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."broadcast" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "broadcastName" character varying NOT NULL, "variables" text array, "URL" character varying NOT NULL, "isBroadcastDone" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "templateId" uuid, "mailingListId" uuid, CONSTRAINT "REL_5381c67c66d71724d2cd789a0f" UNIQUE ("templateId"), CONSTRAINT "REL_633dff016a72f293c5f37abd51" UNIQUE ("mailingListId"), CONSTRAINT "PK_0ded4e27b42c4b2589e70095aa9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."broadcastContacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactNo" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "broadcastId" uuid, CONSTRAINT "PK_3614c6ab3817a2667acb7a1a8e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "originalname" character varying NOT NULL, "fullPath" character varying NOT NULL, "type" character varying NOT NULL, "size" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "waTemplateIdId" uuid, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."whatsAppAccount" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "appUid" character varying NOT NULL, "phoneNumberId" character varying NOT NULL, "businessAccountId" character varying NOT NULL, "accessToken" character varying NOT NULL, "appSecret" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "defaultSelected" boolean, CONSTRAINT "PK_f418795372d917603b88c0c9681" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."channel_contacts" ("channelId" uuid NOT NULL, "contactId" uuid NOT NULL, CONSTRAINT "PK_e53b85e563057ac9a8670699de8" PRIMARY KEY ("channelId", "contactId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db5db103ef3b7cf844e31a1feb" ON "${schema}"."channel_contacts" ("channelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3cce565fa2470731342d5dd07" ON "${schema}"."channel_contacts" ("contactId") `);
        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" ADD CONSTRAINT "FK_93c100dabc1e97c412b4632a441" FOREIGN KEY ("mailingListId") REFERENCES "${schema}"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" ADD CONSTRAINT "FK_fad0fd6def6fa89f66dcf5aaca5" FOREIGN KEY ("channelId") REFERENCES "${schema}"."channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "${schema}"."contacts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD CONSTRAINT "FK_5381c67c66d71724d2cd789a0f5" FOREIGN KEY ("templateId") REFERENCES "${schema}"."whatsAppTemplate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD CONSTRAINT "FK_633dff016a72f293c5f37abd51f" FOREIGN KEY ("mailingListId") REFERENCES "${schema}"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcastContacts" ADD CONSTRAINT "FK_7092489055547081967aea08915" FOREIGN KEY ("broadcastId") REFERENCES "${schema}"."broadcast"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."attachment" ADD CONSTRAINT "FK_97d9ced65a2417c74f1430921a9" FOREIGN KEY ("waTemplateIdId") REFERENCES "${schema}"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channel_contacts" ADD CONSTRAINT "FK_db5db103ef3b7cf844e31a1feb6" FOREIGN KEY ("channelId") REFERENCES "${schema}"."channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channel_contacts" ADD CONSTRAINT "FK_e3cce565fa2470731342d5dd07a" FOREIGN KEY ("contactId") REFERENCES "${schema}"."contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        
        await queryRunner.query(`ALTER TABLE "${schema}"."channel_contacts" DROP CONSTRAINT "FK_e3cce565fa2470731342d5dd07a"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channel_contacts" DROP CONSTRAINT "FK_db5db103ef3b7cf844e31a1feb6"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."attachment" DROP CONSTRAINT "FK_97d9ced65a2417c74f1430921a9"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcastContacts" DROP CONSTRAINT "FK_7092489055547081967aea08915"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP CONSTRAINT "FK_633dff016a72f293c5f37abd51f"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP CONSTRAINT "FK_5381c67c66d71724d2cd789a0f5"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" DROP CONSTRAINT "FK_fad0fd6def6fa89f66dcf5aaca5"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" DROP CONSTRAINT "FK_93c100dabc1e97c412b4632a441"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_e3cce565fa2470731342d5dd07"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_db5db103ef3b7cf844e31a1feb"`);
        await queryRunner.query(`DROP TABLE "${schema}"."channel_contacts"`);
        await queryRunner.query(`DROP TABLE "${schema}"."whatsAppAccount"`);
        await queryRunner.query(`DROP TABLE "${schema}"."attachment"`);
        await queryRunner.query(`DROP TABLE "${schema}"."broadcastContacts"`);
        await queryRunner.query(`DROP TABLE "${schema}"."broadcast"`);
        await queryRunner.query(`DROP TABLE "${schema}"."whatsAppTemplate"`);
        await queryRunner.query(`DROP TABLE "${schema}"."messages"`);
        await queryRunner.query(`DROP TABLE "${schema}"."channel"`);
        await queryRunner.query(`DROP TABLE "${schema}"."contacts"`);
        await queryRunner.query(`DROP TABLE "${schema}"."instants"`);
        await queryRunner.query(`DROP TABLE "${schema}"."MailingList"`);
        await queryRunner.query(`DROP TABLE "${schema}"."MailingContacts"`);
    }

}
