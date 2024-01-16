import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705418105400 implements MigrationInterface {
    name = 'Migration1705418105400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "neighborhoods" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "district_id" character varying, CONSTRAINT "PK_249f3b7c3601adff79e56fa36f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "districts" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "town_id" character varying, CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "towns" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "department_id" character varying NOT NULL, CONSTRAINT "UQ_2d2b2a755254e0c050ac4596bfb" UNIQUE ("name"), CONSTRAINT "PK_8f5c3dbce1d3ea5de7dcc48c230" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "departments" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "UQ_8681da666ad9699d568b3e91064" UNIQUE ("name"), CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_8e4ea639c304b85781120f1eb67" UNIQUE ("email"), CONSTRAINT "PK_46c438e5a956fb9c3e86e73e321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "neighborhoods" ADD CONSTRAINT "FK_438854cb291da89c31b6dacc256" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_ec950ca3c95a11dbd1f4b05cf53" FOREIGN KEY ("town_id") REFERENCES "towns"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "towns" ADD CONSTRAINT "FK_9622a3805504447b728dd24844d" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "towns" DROP CONSTRAINT "FK_9622a3805504447b728dd24844d"`);
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_ec950ca3c95a11dbd1f4b05cf53"`);
        await queryRunner.query(`ALTER TABLE "neighborhoods" DROP CONSTRAINT "FK_438854cb291da89c31b6dacc256"`);
        await queryRunner.query(`DROP TABLE "users_"`);
        await queryRunner.query(`DROP TABLE "departments"`);
        await queryRunner.query(`DROP TABLE "towns"`);
        await queryRunner.query(`DROP TABLE "districts"`);
        await queryRunner.query(`DROP TABLE "neighborhoods"`);
    }

}
