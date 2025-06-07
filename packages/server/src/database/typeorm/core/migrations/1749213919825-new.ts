import { MigrationInterface, QueryRunner } from "typeorm";

export class New1749213919825 implements MigrationInterface {
    name = 'New1749213919825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" ADD "contactNo" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."broadcastContacts" DROP COLUMN "contactNo"`);
    }

}
