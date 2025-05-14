import { MigrationInterface, QueryRunner } from "typeorm";

export class New1746435195273 implements MigrationInterface {
    name = 'New1746435195273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."template" ADD "category" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."template" DROP COLUMN "category"`);
    }

}
