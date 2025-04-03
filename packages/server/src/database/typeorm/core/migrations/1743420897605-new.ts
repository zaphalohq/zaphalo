import { MigrationInterface, QueryRunner } from "typeorm";

export class New1743420897605 implements MigrationInterface {
    name = 'New1743420897605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channelName" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "writeDate" TIMESTAMP NOT NULL DEFAULT now(), "membersidsss" character varying, "writeUserId" uuid NOT NULL, "createUserId" uuid, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "attachment" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "unseen" boolean NOT NULL DEFAULT false, "channelId" uuid, "senderId" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactName" character varying NOT NULL, "phoneNo" bigint NOT NULL, "profileImg" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."channel_contacts" ("channelId" uuid NOT NULL, "contactId" uuid NOT NULL, CONSTRAINT "PK_e53b85e563057ac9a8670699de8" PRIMARY KEY ("channelId", "contactId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db5db103ef3b7cf844e31a1feb" ON "core"."channel_contacts" ("channelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3cce565fa2470731342d5dd07" ON "core"."channel_contacts" ("contactId") `);
        await queryRunner.query(`ALTER TABLE "core"."channel" ADD CONSTRAINT "FK_bc89fbb35dc73d479b1d3455733" FOREIGN KEY ("writeUserId") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."channel" ADD CONSTRAINT "FK_27622c8ed8e1371873074254bb8" FOREIGN KEY ("createUserId") REFERENCES "core"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."messages" ADD CONSTRAINT "FK_fad0fd6def6fa89f66dcf5aaca5" FOREIGN KEY ("channelId") REFERENCES "core"."channel"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "core"."contacts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."channel_contacts" ADD CONSTRAINT "FK_db5db103ef3b7cf844e31a1feb6" FOREIGN KEY ("channelId") REFERENCES "core"."channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "core"."channel_contacts" ADD CONSTRAINT "FK_e3cce565fa2470731342d5dd07a" FOREIGN KEY ("contactId") REFERENCES "core"."contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."channel_contacts" DROP CONSTRAINT "FK_e3cce565fa2470731342d5dd07a"`);
        await queryRunner.query(`ALTER TABLE "core"."channel_contacts" DROP CONSTRAINT "FK_db5db103ef3b7cf844e31a1feb6"`);
        await queryRunner.query(`ALTER TABLE "core"."messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "core"."messages" DROP CONSTRAINT "FK_fad0fd6def6fa89f66dcf5aaca5"`);
        await queryRunner.query(`ALTER TABLE "core"."channel" DROP CONSTRAINT "FK_27622c8ed8e1371873074254bb8"`);
        await queryRunner.query(`ALTER TABLE "core"."channel" DROP CONSTRAINT "FK_bc89fbb35dc73d479b1d3455733"`);
        await queryRunner.query(`DROP INDEX "core"."IDX_e3cce565fa2470731342d5dd07"`);
        await queryRunner.query(`DROP INDEX "core"."IDX_db5db103ef3b7cf844e31a1feb"`);
        await queryRunner.query(`DROP TABLE "core"."channel_contacts"`);
        await queryRunner.query(`DROP TABLE "core"."contacts"`);
        await queryRunner.query(`DROP TABLE "core"."messages"`);
        await queryRunner.query(`DROP TABLE "core"."channel"`);
    }

}
