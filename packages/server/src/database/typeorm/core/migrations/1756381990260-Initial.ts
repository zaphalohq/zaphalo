import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1756381990260 implements MigrationInterface {
    name = 'Initial1756381990260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "core"."workspace_member_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "core"."workspace_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "workspaceId" uuid NOT NULL, "role" "core"."workspace_member_role_enum" NOT NULL DEFAULT 'user', "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3a35f64bf30517010551467c6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."appToken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "workspaceId" uuid, "type" text NOT NULL DEFAULT 'REFRESH_TOKEN', "value" text, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "deletedAt" TIMESTAMP WITH TIME ZONE, "revokedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "context" jsonb, CONSTRAINT "PK_143bfe36c6284c6d3a52c94741f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "core"."user_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "core"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "email" character varying NOT NULL, "password" character varying, "role" "core"."user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."workspace" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "inviteToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isWorkspaceSetup" boolean DEFAULT false, "profileImg" character varying, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."workspace_invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isUsed" boolean NOT NULL DEFAULT false, "workspaceId" uuid NOT NULL, "invitedById" uuid, CONSTRAINT "UQ_49e1b235ed0b102d72b8f299d6a" UNIQUE ("token"), CONSTRAINT "PK_8d58734b72dc04a88ff86fab9dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD CONSTRAINT "FK_03ce416ae83c188274dec61205c" FOREIGN KEY ("userId") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."appToken" ADD CONSTRAINT "FK_8cd4819144baf069777b5729136" FOREIGN KEY ("userId") REFERENCES "core"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."appToken" ADD CONSTRAINT "FK_d6ae19a7aa2bbd4919053257772" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD CONSTRAINT "FK_51f2194e4a415202512807d2f63" FOREIGN KEY ("ownerId") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_invitation" ADD CONSTRAINT "FK_c060076f1277c3c957151ec1321" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_invitation" ADD CONSTRAINT "FK_13157e3f27dbffeaf7048d8ef31" FOREIGN KEY ("invitedById") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace_invitation" DROP CONSTRAINT "FK_13157e3f27dbffeaf7048d8ef31"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_invitation" DROP CONSTRAINT "FK_c060076f1277c3c957151ec1321"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP CONSTRAINT "FK_51f2194e4a415202512807d2f63"`);
        await queryRunner.query(`ALTER TABLE "core"."appToken" DROP CONSTRAINT "FK_d6ae19a7aa2bbd4919053257772"`);
        await queryRunner.query(`ALTER TABLE "core"."appToken" DROP CONSTRAINT "FK_8cd4819144baf069777b5729136"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP CONSTRAINT "FK_03ce416ae83c188274dec61205c"`);
        await queryRunner.query(`DROP TABLE "core"."workspace_invitation"`);
        await queryRunner.query(`DROP TABLE "core"."workspace"`);
        await queryRunner.query(`DROP TABLE "core"."user"`);
        await queryRunner.query(`DROP TYPE "core"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "core"."appToken"`);
        await queryRunner.query(`DROP TABLE "core"."workspace_member"`);
        await queryRunner.query(`DROP TYPE "core"."workspace_member_role_enum"`);
    }

}
