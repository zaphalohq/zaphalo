import { MigrationInterface, QueryRunner } from "typeorm";

export class New1750487770390 implements MigrationInterface {
    name = 'New1750487770390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactName" character varying NOT NULL, "phoneNo" bigint NOT NULL, "profileImg" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "defaultContact" boolean DEFAULT false, "workspaceId" uuid, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "textMessage" character varying NOT NULL, "attachmentUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "unseen" boolean NOT NULL DEFAULT false, "channelId" uuid, "senderId" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channelName" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "writeDate" TIMESTAMP NOT NULL DEFAULT now(), "membersidsss" character varying, "writeUserId" uuid NOT NULL, "createUserId" uuid, "workspaceId" uuid, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."workspace" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "inviteToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isWorkspaceSetup" boolean DEFAULT false, "profileImg" character varying, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "core"."user_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "core"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "email" character varying NOT NULL, "password" character varying, "role" "core"."user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "core"."workspace_member_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "core"."workspace_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "workspaceId" uuid NOT NULL, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "role" "core"."workspace_member_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "PK_a3a35f64bf30517010551467c6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."workspace_invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isUsed" boolean NOT NULL DEFAULT false, "workspaceId" uuid NOT NULL, "invitedById" uuid, CONSTRAINT "UQ_49e1b235ed0b102d72b8f299d6a" UNIQUE ("token"), CONSTRAINT "PK_8d58734b72dc04a88ff86fab9dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account" character varying NOT NULL, "templateName" character varying NOT NULL, "status" character varying NOT NULL, "templateId" character varying NOT NULL, "category" character varying NOT NULL, "language" character varying NOT NULL, "headerType" character varying, "bodyText" character varying, "footerText" character varying, "header_handle" character varying, "fileUrl" character varying, "button" json, "variables" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "workspaceId" uuid, CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."MailingContacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactName" character varying NOT NULL, "contactNo" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "mailingListId" uuid, CONSTRAINT "PK_02ba24b71511900125e363bf6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."MailingList" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mailingListName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "workspaceId" uuid, CONSTRAINT "PK_299711d5186281126fbfe146921" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."instants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "appId" character varying NOT NULL, "phoneNumberId" character varying NOT NULL, "businessAccountId" character varying NOT NULL, "accessToken" character varying NOT NULL, "appSecret" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "defaultSelected" boolean, "workspaceId" uuid, CONSTRAINT "PK_a71121edaef68446bb281ec042e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."broadcast" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "broadcastName" character varying NOT NULL, "variables" text array, "URL" character varying NOT NULL, "isBroadcastDone" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "templateId" uuid, "mailingListId" uuid, "workspaceId" uuid, CONSTRAINT "REL_5381c67c66d71724d2cd789a0f" UNIQUE ("templateId"), CONSTRAINT "REL_633dff016a72f293c5f37abd51" UNIQUE ("mailingListId"), CONSTRAINT "PK_0ded4e27b42c4b2589e70095aa9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."broadcastContacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactNo" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "broadcastId" uuid, CONSTRAINT "PK_3614c6ab3817a2667acb7a1a8e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."channel_contacts" ("channelId" uuid NOT NULL, "contactId" uuid NOT NULL, CONSTRAINT "PK_e53b85e563057ac9a8670699de8" PRIMARY KEY ("channelId", "contactId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db5db103ef3b7cf844e31a1feb" ON "core"."channel_contacts" ("channelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3cce565fa2470731342d5dd07" ON "core"."channel_contacts" ("contactId") `);
        await queryRunner.query(`ALTER TABLE "core"."contacts" ADD CONSTRAINT "FK_60c505f7ac4b3dae62c6fbc486f" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."messages" ADD CONSTRAINT "FK_fad0fd6def6fa89f66dcf5aaca5" FOREIGN KEY ("channelId") REFERENCES "core"."channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "core"."contacts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."channel" ADD CONSTRAINT "FK_bc89fbb35dc73d479b1d3455733" FOREIGN KEY ("writeUserId") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."channel" ADD CONSTRAINT "FK_27622c8ed8e1371873074254bb8" FOREIGN KEY ("createUserId") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."channel" ADD CONSTRAINT "FK_885f1a3a3369b4cfa36bfd2e83f" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD CONSTRAINT "FK_51f2194e4a415202512807d2f63" FOREIGN KEY ("ownerId") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD CONSTRAINT "FK_03ce416ae83c188274dec61205c" FOREIGN KEY ("userId") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_invitation" ADD CONSTRAINT "FK_c060076f1277c3c957151ec1321" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_invitation" ADD CONSTRAINT "FK_13157e3f27dbffeaf7048d8ef31" FOREIGN KEY ("invitedById") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD CONSTRAINT "FK_1ed8fa4dc1ce613fef91c767931" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."MailingContacts" ADD CONSTRAINT "FK_93c100dabc1e97c412b4632a441" FOREIGN KEY ("mailingListId") REFERENCES "core"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."MailingList" ADD CONSTRAINT "FK_fe8a95c141fd38ab1e4ffccc6a6" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."instants" ADD CONSTRAINT "FK_6c288de3c87c712084b788dd915" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" ADD CONSTRAINT "FK_5381c67c66d71724d2cd789a0f5" FOREIGN KEY ("templateId") REFERENCES "core"."template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" ADD CONSTRAINT "FK_633dff016a72f293c5f37abd51f" FOREIGN KEY ("mailingListId") REFERENCES "core"."MailingList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" ADD CONSTRAINT "FK_bf9b7ac3cd047bb09ef856a2fcd" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" ADD CONSTRAINT "FK_7092489055547081967aea08915" FOREIGN KEY ("broadcastId") REFERENCES "core"."broadcast"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."channel_contacts" ADD CONSTRAINT "FK_db5db103ef3b7cf844e31a1feb6" FOREIGN KEY ("channelId") REFERENCES "core"."channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "core"."channel_contacts" ADD CONSTRAINT "FK_e3cce565fa2470731342d5dd07a" FOREIGN KEY ("contactId") REFERENCES "core"."contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."channel_contacts" DROP CONSTRAINT "FK_e3cce565fa2470731342d5dd07a"`);
        await queryRunner.query(`ALTER TABLE "core"."channel_contacts" DROP CONSTRAINT "FK_db5db103ef3b7cf844e31a1feb6"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" DROP CONSTRAINT "FK_7092489055547081967aea08915"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" DROP CONSTRAINT "FK_bf9b7ac3cd047bb09ef856a2fcd"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" DROP CONSTRAINT "FK_633dff016a72f293c5f37abd51f"`);
        await queryRunner.query(`ALTER TABLE "core"."broadcast" DROP CONSTRAINT "FK_5381c67c66d71724d2cd789a0f5"`);
        await queryRunner.query(`ALTER TABLE "core"."instants" DROP CONSTRAINT "FK_6c288de3c87c712084b788dd915"`);
        await queryRunner.query(`ALTER TABLE "core"."MailingList" DROP CONSTRAINT "FK_fe8a95c141fd38ab1e4ffccc6a6"`);
        await queryRunner.query(`ALTER TABLE "core"."MailingContacts" DROP CONSTRAINT "FK_93c100dabc1e97c412b4632a441"`);
        await queryRunner.query(`ALTER TABLE "core"."template" DROP CONSTRAINT "FK_1ed8fa4dc1ce613fef91c767931"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_invitation" DROP CONSTRAINT "FK_13157e3f27dbffeaf7048d8ef31"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_invitation" DROP CONSTRAINT "FK_c060076f1277c3c957151ec1321"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP CONSTRAINT "FK_03ce416ae83c188274dec61205c"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP CONSTRAINT "FK_51f2194e4a415202512807d2f63"`);
        await queryRunner.query(`ALTER TABLE "core"."channel" DROP CONSTRAINT "FK_885f1a3a3369b4cfa36bfd2e83f"`);
        await queryRunner.query(`ALTER TABLE "core"."channel" DROP CONSTRAINT "FK_27622c8ed8e1371873074254bb8"`);
        await queryRunner.query(`ALTER TABLE "core"."channel" DROP CONSTRAINT "FK_bc89fbb35dc73d479b1d3455733"`);
        await queryRunner.query(`ALTER TABLE "core"."messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "core"."messages" DROP CONSTRAINT "FK_fad0fd6def6fa89f66dcf5aaca5"`);
        await queryRunner.query(`ALTER TABLE "core"."contacts" DROP CONSTRAINT "FK_60c505f7ac4b3dae62c6fbc486f"`);
        await queryRunner.query(`DROP INDEX "core"."IDX_e3cce565fa2470731342d5dd07"`);
        await queryRunner.query(`DROP INDEX "core"."IDX_db5db103ef3b7cf844e31a1feb"`);
        await queryRunner.query(`DROP TABLE "core"."channel_contacts"`);
        await queryRunner.query(`DROP TABLE "core"."broadcastContacts"`);
        await queryRunner.query(`DROP TABLE "core"."broadcast"`);
        await queryRunner.query(`DROP TABLE "core"."instants"`);
        await queryRunner.query(`DROP TABLE "core"."MailingList"`);
        await queryRunner.query(`DROP TABLE "core"."MailingContacts"`);
        await queryRunner.query(`DROP TABLE "core"."template"`);
        await queryRunner.query(`DROP TABLE "core"."workspace_invitation"`);
        await queryRunner.query(`DROP TABLE "core"."workspace_member"`);
        await queryRunner.query(`DROP TYPE "core"."workspace_member_role_enum"`);
        await queryRunner.query(`DROP TABLE "core"."user"`);
        await queryRunner.query(`DROP TYPE "core"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "core"."workspace"`);
        await queryRunner.query(`DROP TABLE "core"."channel"`);
        await queryRunner.query(`DROP TABLE "core"."messages"`);
        await queryRunner.query(`DROP TABLE "core"."contacts"`);
    }

}
