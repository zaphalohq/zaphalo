import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProfile1763638155676 implements MigrationInterface {
    name = 'UserProfile1763638155676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."user" ADD "profileImg" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."user" DROP COLUMN "profileImg"`);
    }

}
