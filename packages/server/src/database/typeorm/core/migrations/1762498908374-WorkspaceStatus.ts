import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkspaceStatus1762498908374 implements MigrationInterface {
    name = 'WorkspaceStatus1762498908374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "core"."workspace_activationStatus_enum" AS ENUM('ONGOING_CREATION', 'PENDING_CREATION', 'ACTIVE', 'INACTIVE', 'SUSPENDED')`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD "activationStatus" "core"."workspace_activationStatus_enum" NOT NULL DEFAULT 'INACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP COLUMN "activationStatus"`);
        await queryRunner.query(`DROP TYPE "core"."workspace_activationStatus_enum"`);
    }

}
