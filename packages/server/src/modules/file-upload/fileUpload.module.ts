import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
// import { TypeORMModule } from "src/database/typeorm/typeorm.module";

import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { User } from "../user/user.entity";
import { FileUploadController } from "./fileUpload.controller";
import { FileUploadService } from "./fileUpload.service";

@Module({
  imports : [
    NestjsQueryGraphQLModule.forFeature({
      services: [FileUploadService],
    })
  ],
  controllers : [FileUploadController],
  providers : [FileUploadController],
  exports: [FileUploadController ],
})

export class FileUploadModule {}