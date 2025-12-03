import { MigrationInterface, QueryRunner } from "typeorm";

export class FcmToken1764676588008 implements MigrationInterface {
    name = 'FcmToken1764676588008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."fcm_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0802a779d616597e9330bb9a7cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "core"."fcm_tokens" ADD CONSTRAINT "FK_642d4f7ba5c6e019c2d8f5332a5" FOREIGN KEY ("userId") REFERENCES "core"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."fcm_tokens" DROP CONSTRAINT "FK_642d4f7ba5c6e019c2d8f5332a5"`);
        await queryRunner.query(`DROP TABLE "core"."fcm_tokens"`);
    }

}
