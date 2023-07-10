import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1688655247851 implements MigrationInterface {
    name = 'Migration1688655247851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "towns" DROP CONSTRAINT "FK_9622a3805504447b728dd24844d"`);
        await queryRunner.query(`ALTER TABLE "towns" DROP COLUMN "department_id"`);
        await queryRunner.query(`ALTER TABLE "towns" ADD "departmentId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "towns" ADD "departementId" character varying`);
        await queryRunner.query(`ALTER TABLE "towns" ADD CONSTRAINT "FK_1b9cd6ba0f3e3ac531ac85122a0" FOREIGN KEY ("departementId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "towns" DROP CONSTRAINT "FK_1b9cd6ba0f3e3ac531ac85122a0"`);
        await queryRunner.query(`ALTER TABLE "towns" DROP COLUMN "departementId"`);
        await queryRunner.query(`ALTER TABLE "towns" DROP COLUMN "departmentId"`);
        await queryRunner.query(`ALTER TABLE "towns" ADD "department_id" character varying`);
        await queryRunner.query(`ALTER TABLE "towns" ADD CONSTRAINT "FK_9622a3805504447b728dd24844d" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
