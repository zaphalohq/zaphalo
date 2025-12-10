import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmToken } from '../fcm-token/entity/fcm-token.entity';
import { FirebaseNotificationService } from './firebaseNotification.service';
import { FirebaseResolver } from './firebase.resolver';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([FcmToken], 'core')],
    providers: [
        {
            provide: 'FIREBASE_ADMIN',
            useFactory: () => {
                return admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY ?
                            process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') :
                            undefined,
                    }),
                });
            },
        },
        FirebaseNotificationService,
        FirebaseResolver,
    ],
    exports: ['FIREBASE_ADMIN',FirebaseNotificationService],
})
export class FirebaseModule { }
