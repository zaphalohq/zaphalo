import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilePathGuard } from 'src/modules/file/guards/file-path-guard';
import { JwtModule } from 'src/modules/jwt/jwt.module';
// import { Workspace } from 'src/modules/workspace/workspace.entity';

import { FileController } from './controllers/file.controller';
import { UploadController } from './controllers/file-upload.controller';
import { FileService } from './services/file.service';
import { FileUploadService } from './services/file-upload.service';
import { FileUploadResolver } from './resolvers/file-upload.resolver';


@Module({
  imports: [
    JwtModule,
    // TypeOrmModule.forFeature([FileEntity, Workspace], 'core'),
    HttpModule,
  ],
  providers: [
    FileService,
    FileUploadService,
    FilePathGuard,
    FileUploadResolver,
  ],
  exports: [
    FileService,
    FileUploadService,
  ],
  controllers: [FileController, UploadController],
})
export class FileModule {}