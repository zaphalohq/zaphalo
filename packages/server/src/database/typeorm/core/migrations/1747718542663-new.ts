import { MigrationInterface, QueryRunner } from "typeorm";

export class New1747718542663 implements MigrationInterface {
    name = 'New1747718542663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account" character varying NOT NULL, "templateName" character varying NOT NULL, "status" character varying NOT NULL, "templateId" character varying NOT NULL, "category" character varying NOT NULL, "language" character varying NOT NULL, "headerType" character varying, "bodyText" character varying, "footerText" character varying, "header_handle" character varying, "button" json, "variables" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "workspaceId" uuid, CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD CONSTRAINT "FK_1ed8fa4dc1ce613fef91c767931" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."template" DROP CONSTRAINT "FK_1ed8fa4dc1ce613fef91c767931"`);
        await queryRunner.query(`DROP TABLE "core"."template"`);
    }

}
