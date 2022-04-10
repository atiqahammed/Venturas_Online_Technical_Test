import {MigrationInterface, QueryRunner} from "typeorm";

export class v11649579138451 implements MigrationInterface {
    name = 'v11649579138451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tblCompany" ("Id" SERIAL NOT NULL, "CreateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "CreatedBy" character varying(300), "ModifiedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "LastChangedBy" character varying(300), "Name" character varying(300), "Email" character varying(300) NOT NULL, "Remarks" character varying(300), "ZipCode" character varying(300), "Address" character varying(300), "PhoneNumber" character varying(300), "Image" character varying(300), "CopanyNameKana" character varying(300), "URLOfHP" character varying(300), "DateOfEstablishment" character varying(300), "OwnerId" integer NOT NULL, CONSTRAINT "PK_d2d6e9f5cbbe6465203000fdddb" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "tblInvitation" ("UserType" character varying(300), "CompanyId" integer, "InvitedBy" integer, "Status" character varying(300), "TemporaryPassword" character varying(300), "UUID" character varying(300), "Id" SERIAL NOT NULL, "CreateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "CreatedBy" character varying(300), "ModifiedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "LastChangedBy" character varying(300), "Email" character varying(300) NOT NULL, CONSTRAINT "PK_ecd20aa2e122be3248cf3fb3eea" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "tblUserInfo" ("Id" SERIAL NOT NULL, "CreateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "CreatedBy" character varying(300), "ModifiedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "LastChangedBy" character varying(300), "Name" character varying(300), "Email" character varying(300) NOT NULL, "Remarks" character varying(300), "ZipCode" character varying(300), "Address" character varying(300), "PhoneNumber" character varying(300), "Image" character varying(300), "Department" character varying(300), "DateOfBirth" character varying(300), "CompanyId" integer, "Password" character varying(1024) NOT NULL, "UserType" character varying(300), CONSTRAINT "PK_6f0365f0d07dbeeb1ccf4a4f8f5" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tblUserInfo"`);
        await queryRunner.query(`DROP TABLE "tblInvitation"`);
        await queryRunner.query(`DROP TABLE "tblCompany"`);
    }

}
