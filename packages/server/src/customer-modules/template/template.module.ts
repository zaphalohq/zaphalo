// import { Module } from "@nestjs/common";
// import { NestjsQueryGraphQLModule } from "@ptc-org/nestjs-query-graphql";
// import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm";
// import { Template } from "./template.entity";
// import { TemplateService } from "./template.service";
// import { TemplateResolver } from "./template.resolver";
// import { TemplateFileUpload } from "./templateFileUpload.controller";
// import { TypeORMModule } from "src/database/typeorm/typeorm.module";
// import { WorkspaceModule } from "src/modules/workspace/workspace.module";
// import { instantsModule } from "src/customer-modules/instants/instants.module";
// import { MailingListModule } from "src/customer-modules/mailingList/mailingList.module";


// @Module({
//     imports : [ NestjsQueryGraphQLModule.forFeature({
//           imports: [
//             NestjsQueryTypeOrmModule.forFeature([Template]),
//             TypeORMModule,
//             WorkspaceModule,
//             instantsModule,
//             MailingListModule,
//           ],
//           services: [TemplateService,],
//         }),],
//     controllers : [TemplateFileUpload],
//     providers : [TemplateService, TemplateResolver],
//     exports: [TemplateService ],
// })

// export class TemplateModule {}