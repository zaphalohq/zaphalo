import { MigrationInterface, QueryRunner } from "typeorm";

export class New1749106370037 implements MigrationInterface {
    name = 'New1749106370037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD "inviteToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP COLUMN "inviteToken"`);
    }

}
