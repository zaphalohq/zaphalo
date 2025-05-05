import { MigrationInterface, QueryRunner } from "typeorm";

export class New1746429219085 implements MigrationInterface {
    name = 'New1746429219085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "templateName" character varying NOT NULL, "status" character varying NOT NULL, "templateId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "workspaceId" uuid, CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "core"."template" ADD CONSTRAINT "FK_1ed8fa4dc1ce613fef91c767931" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."template" DROP CONSTRAINT "FK_1ed8fa4dc1ce613fef91c767931"`);
        await queryRunner.query(`DROP TABLE "core"."template"`);
    }

}
