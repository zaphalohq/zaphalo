import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRoleRemove1764137413460 implements MigrationInterface {
    name = 'UserRoleRemove1764137413460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "core"."user_role_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "core"."user_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "core"."user" ADD "role" "core"."user_role_enum" NOT NULL DEFAULT 'user'`);
    }

}
