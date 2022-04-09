import {MigrationInterface, QueryRunner} from "typeorm";

export class v21649519206922 implements MigrationInterface {
    name = 'v21649519206922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tblInvitation" DROP COLUMN "Name"`);
        await queryRunner.query(`ALTER TABLE "tblInvitation" DROP COLUMN "Remarks"`);
        await queryRunner.query(`ALTER TABLE "tblInvitation" DROP COLUMN "ZipCode"`);
        await queryRunner.query(`ALTER TABLE "tblInvitation" DROP COLUMN "Address"`);
        await queryRunner.query(`ALTER TABLE "tblInvitation" DROP COLUMN "PhoneNumber"`);
        await queryRunner.query(`ALTER TABLE "tblInvitation" DROP COLUMN "Image"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tblInvitation" ADD "Image" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "tblInvitation" ADD "PhoneNumber" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "tblInvitation" ADD "Address" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "tblInvitation" ADD "ZipCode" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "tblInvitation" ADD "Remarks" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "tblInvitation" ADD "Name" character varying(300)`);
    }

}
