import { Module } from '@nestjs/common';
import { FcmTokenService } from './fcm-token.service';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { FcmToken } from 'src/modules/fcm-token/entities/fcm-token.entity';

@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [
                NestjsQueryTypeOrmModule.forFeature([FcmToken], 'core'),
            ],
            services: [FcmTokenService], 
        }),
    ],
    providers: [FcmTokenService],
    exports: [FcmTokenService]
})
export class FcmTokenModule { }
