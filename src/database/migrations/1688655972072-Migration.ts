import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1688655972072 implements MigrationInterface {
    name = 'Migration1688655972072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "towns" ADD "department_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "towns" ADD CONSTRAINT "FK_9622a3805504447b728dd24844d" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "towns" DROP CONSTRAINT "FK_9622a3805504447b728dd24844d"`);
        await queryRunner.query(`ALTER TABLE "towns" DROP COLUMN "department_id"`);
    }

}
