import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1689069299132 implements MigrationInterface {
    name = 'Migration1689069299132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "grant" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "resource" character varying NOT NULL DEFAULT '', "action" character varying NOT NULL DEFAULT '', "attributes" character varying NOT NULL DEFAULT '', "roleId" character varying, CONSTRAINT "PK_451b51b02b610d55f542c542aa2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_roles_role" ("usersId" character varying NOT NULL, "roleId" character varying NOT NULL, CONSTRAINT "PK_3fb5295f0482f3c5090b41a5427" PRIMARY KEY ("usersId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3ea8bcae76ff0b74bcc1340af8" ON "users_roles_role" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03c652226fd376f26b31503d40" ON "users_roles_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "grant" ADD CONSTRAINT "FK_8484415d531210f79fe28103489" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles_role" ADD CONSTRAINT "FK_3ea8bcae76ff0b74bcc1340af86" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles_role" ADD CONSTRAINT "FK_03c652226fd376f26b31503d40c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles_role" DROP CONSTRAINT "FK_03c652226fd376f26b31503d40c"`);
        await queryRunner.query(`ALTER TABLE "users_roles_role" DROP CONSTRAINT "FK_3ea8bcae76ff0b74bcc1340af86"`);
        await queryRunner.query(`ALTER TABLE "grant" DROP CONSTRAINT "FK_8484415d531210f79fe28103489"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03c652226fd376f26b31503d40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ea8bcae76ff0b74bcc1340af8"`);
        await queryRunner.query(`DROP TABLE "users_roles_role"`);
        await queryRunner.query(`DROP TABLE "grant"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
