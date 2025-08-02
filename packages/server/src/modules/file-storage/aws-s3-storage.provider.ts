import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3StorageProvider {
  constructor(private readonly configService: ConfigService) {}

  getMulterStorage() {
    const s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });

    return multerS3({
      s3,
      bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      metadata: (req, file, callback) => {
        callback(null, { fieldName: file.fieldname });
      },
      key: (req, file, callback) => {
        const uniqueSuffix = `${uuidv4()}${file.originalname}`;
        callback(null, uniqueSuffix);
      },
    });
  }
}