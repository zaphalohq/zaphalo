import { Module } from "@nestjs/common";
import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
import { FileUploadController } from "./fileUpload.controller";
import { FileUploadService } from "./fileUpload.service";

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      services: [FileUploadService],
    })
  ],
  controllers: [FileUploadController],
  providers: [FileUploadController],
  exports: [FileUploadController],
})

export class FileUploadModule { }