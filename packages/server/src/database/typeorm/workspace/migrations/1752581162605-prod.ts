import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


export class Prod1752756143338 implements MigrationInterface {
    name = 'Prod1752756143338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`CREATE TABLE "${schema}"."MailingContacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactName" character varying NOT NULL, "contactNo" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "mailingListId" uuid, CONSTRAINT "PK_02ba24b71511900125e363bf6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."MailingList" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mailingListName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_299711d5186281126fbfe146921" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channelName" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "writeDate" TIMESTAMP NOT NULL DEFAULT now(), "membersidsss" character varying, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "textMessage" character varying NOT NULL, "attachmentUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "unseen" boolean NOT NULL DEFAULT false, "channelId" uuid, "senderId" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactName" character varying NOT NULL, "phoneNo" bigint NOT NULL, "profileImg" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "defaultContact" boolean DEFAULT false, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "originalname" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "size" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."whatsAppAccount" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "appId" character varying NOT NULL, "phoneNumberId" character varying NOT NULL, "businessAccountId" character varying NOT NULL, "accessToken" character varying NOT NULL, "appSecret" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "defaultSelected" boolean, CONSTRAINT "PK_f418795372d917603b88c0c9681" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "${schema}"."whatsAppTemplate_language_enum" AS ENUM('af', 'sq', 'ar', 'az', 'bn', 'bg', 'ca', 'zh_CN', 'zh_HK', 'zh_TW', 'hr', 'cs', 'da', 'nl', 'en', 'en_GB', 'en_US', 'et', 'fil', 'fi', 'fr', 'ka', 'de', 'el', 'gu', 'ha', 'he', 'hi', 'hu', 'id', 'ga', 'it', 'ja', 'kn', 'kk', 'rw_RW', 'ko', 'ky_KG', 'lo', 'lv', 'lt', 'mk', 'ms', 'ml', 'mr', 'nb', 'fa', 'pl', 'pt_BR', 'pt_PT', 'pa', 'ro', 'ru', 'sr', 'sk', 'sl', 'es', 'es_AR', 'es_ES', 'es_MX', 'sw', 'sv', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'zu')`);
        await queryRunner.query(`CREATE TYPE "${schema}"."whatsAppTemplate_category_enum" AS ENUM('MARKETING', 'AUTHENTICATION', 'UTILITY')`);
        await queryRunner.query(`CREATE TYPE "${schema}"."whatsAppTemplate_headertype_enum" AS ENUM('NONE', 'TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT')`);
        await queryRunner.query(`CREATE TABLE "${schema}"."whatsAppTemplate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "templateName" character varying NOT NULL, "status" character varying NOT NULL, "waTemplateId" character varying, "language" "${schema}"."whatsAppTemplate_language_enum" NOT NULL, "category" "${schema}"."whatsAppTemplate_category_enum" NOT NULL, "headerType" "${schema}"."whatsAppTemplate_headertype_enum", "headerText" character varying, "bodyText" character varying, "footerText" character varying, "button" json, "variables" json, "templateImg" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" uuid, "attachmentId" uuid, CONSTRAINT "PK_446bdd7de9665979408947ee682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."broadcast" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "broadcastName" character varying NOT NULL, "variables" text array, "URL" character varying NOT NULL, "isBroadcastDone" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "templateId" uuid, "mailingListId" uuid, CONSTRAINT "REL_5381c67c66d71724d2cd789a0f" UNIQUE ("templateId"), CONSTRAINT "REL_633dff016a72f293c5f37abd51" UNIQUE ("mailingListId"), CONSTRAINT "PK_0ded4e27b42c4b2589e70095aa9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."broadcastContacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactNo" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "broadcastId" uuid, CONSTRAINT "PK_3614c6ab3817a2667acb7a1a8e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "${schema}"."whatsAppMessage_messagetype_enum" AS ENUM('Outbound', 'Inbound')`);
        await queryRunner.query(`CREATE TYPE "${schema}"."whatsAppMessage_state_enum" AS ENUM('In Queue', 'Sent', 'Delivered', 'Read', 'Replied', 'Received', 'Failed', 'Bounced', 'Cancelled')`);
        await queryRunner.query(`CREATE TYPE "${schema}"."whatsAppMessage_messagefailuretype_enum" AS ENUM('Account Error', 'Blacklisted Phone Number', 'Network Error', 'The channel is no longer active', 'Wrong Number Format', 'Template Quality Rating Too Low', 'Unknown Error', 'Identified Error', 'Other Technical Error')`);
        await queryRunner.query(`CREATE TABLE "${schema}"."whatsAppMessage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mobileNumber" character varying NOT NULL, "messageType" "${schema}"."whatsAppMessage_messagetype_enum" NOT NULL DEFAULT 'Outbound', "state" "${schema}"."whatsAppMessage_state_enum" NOT NULL DEFAULT 'In Queue', "messageFailureType" "${schema}"."whatsAppMessage_messagefailuretype_enum" NOT NULL, "failureReason" character varying NOT NULL, "freeTextJson" character varying NOT NULL, "msgUid" character varying NOT NULL, "htmlBody" character varying NOT NULL, "waTemplateIdId" uuid, "waAccountIdId" uuid, "parentIdId" uuid, CONSTRAINT "PK_a47d591ef27241c1eb03cec51a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."channel_contacts" ("channelId" uuid NOT NULL, "contactId" uuid NOT NULL, CONSTRAINT "PK_e53b85e563057ac9a8670699de8" PRIMARY KEY ("channelId", "contactId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db5db103ef3b7cf844e31a1feb" ON "${schema}"."channel_contacts" ("channelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3cce565fa2470731342d5dd07" ON "${schema}"."channel_contacts" ("contactId") `);
        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" ADD CONSTRAINT "FK_93c100dabc1e97c412b4632a441" FOREIGN KEY ("mailingListId") REFERENCES "${schema}"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" ADD CONSTRAINT "FK_fad0fd6def6fa89f66dcf5aaca5" FOREIGN KEY ("channelId") REFERENCES "${schema}"."channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "${schema}"."contacts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD CONSTRAINT "FK_d423f92050a2d1af9a6caa307df" FOREIGN KEY ("accountId") REFERENCES "${schema}"."whatsAppAccount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD CONSTRAINT "FK_e358a08ad392acb3068dc97d94a" FOREIGN KEY ("attachmentId") REFERENCES "${schema}"."attachment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD CONSTRAINT "FK_5381c67c66d71724d2cd789a0f5" FOREIGN KEY ("templateId") REFERENCES "${schema}"."whatsAppTemplate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD CONSTRAINT "FK_633dff016a72f293c5f37abd51f" FOREIGN KEY ("mailingListId") REFERENCES "${schema}"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcastContacts" ADD CONSTRAINT "FK_7092489055547081967aea08915" FOREIGN KEY ("broadcastId") REFERENCES "${schema}"."broadcast"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ADD CONSTRAINT "FK_9d2eff7be96fbb9c59a544aceb5" FOREIGN KEY ("waTemplateIdId") REFERENCES "${schema}"."whatsAppTemplate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ADD CONSTRAINT "FK_41ecdfd7fbcdf6958b0d781c9d4" FOREIGN KEY ("waAccountIdId") REFERENCES "${schema}"."whatsAppAccount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ADD CONSTRAINT "FK_9f4e5fcd379511df435c1cf45eb" FOREIGN KEY ("parentIdId") REFERENCES "${schema}"."whatsAppMessage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channel_contacts" ADD CONSTRAINT "FK_db5db103ef3b7cf844e31a1feb6" FOREIGN KEY ("channelId") REFERENCES "${schema}"."channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channel_contacts" ADD CONSTRAINT "FK_e3cce565fa2470731342d5dd07a" FOREIGN KEY ("contactId") REFERENCES "${schema}"."contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."channel_contacts" DROP CONSTRAINT "FK_e3cce565fa2470731342d5dd07a"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channel_contacts" DROP CONSTRAINT "FK_db5db103ef3b7cf844e31a1feb6"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" DROP CONSTRAINT "FK_9f4e5fcd379511df435c1cf45eb"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" DROP CONSTRAINT "FK_41ecdfd7fbcdf6958b0d781c9d4"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" DROP CONSTRAINT "FK_9d2eff7be96fbb9c59a544aceb5"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcastContacts" DROP CONSTRAINT "FK_7092489055547081967aea08915"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP CONSTRAINT "FK_633dff016a72f293c5f37abd51f"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP CONSTRAINT "FK_5381c67c66d71724d2cd789a0f5"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP CONSTRAINT "FK_e358a08ad392acb3068dc97d94a"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP CONSTRAINT "FK_d423f92050a2d1af9a6caa307df"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" DROP CONSTRAINT "FK_fad0fd6def6fa89f66dcf5aaca5"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."MailingContacts" DROP CONSTRAINT "FK_93c100dabc1e97c412b4632a441"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_e3cce565fa2470731342d5dd07"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_db5db103ef3b7cf844e31a1feb"`);
        await queryRunner.query(`DROP TABLE "${schema}"."channel_contacts"`);
        await queryRunner.query(`DROP TABLE "${schema}"."whatsAppMessage"`);
        await queryRunner.query(`DROP TYPE "${schema}"."whatsAppMessage_messagefailuretype_enum"`);
        await queryRunner.query(`DROP TYPE "${schema}"."whatsAppMessage_state_enum"`);
        await queryRunner.query(`DROP TYPE "${schema}"."whatsAppMessage_messagetype_enum"`);
        await queryRunner.query(`DROP TABLE "${schema}"."broadcastContacts"`);
        await queryRunner.query(`DROP TABLE "${schema}"."broadcast"`);
        await queryRunner.query(`DROP TABLE "${schema}"."whatsAppTemplate"`);
        await queryRunner.query(`DROP TYPE "${schema}"."whatsAppTemplate_headertype_enum"`);
        await queryRunner.query(`DROP TYPE "${schema}"."whatsAppTemplate_category_enum"`);
        await queryRunner.query(`DROP TYPE "${schema}"."whatsAppTemplate_language_enum"`);
        await queryRunner.query(`DROP TABLE "${schema}"."whatsAppAccount"`);
        await queryRunner.query(`DROP TABLE "${schema}"."attachment"`);
        await queryRunner.query(`DROP TABLE "${schema}"."contacts"`);
        await queryRunner.query(`DROP TABLE "${schema}"."messages"`);
        await queryRunner.query(`DROP TABLE "${schema}"."channel"`);
        await queryRunner.query(`DROP TABLE "${schema}"."MailingList"`);
        await queryRunner.query(`DROP TABLE "${schema}"."MailingContacts"`);
    }
}
