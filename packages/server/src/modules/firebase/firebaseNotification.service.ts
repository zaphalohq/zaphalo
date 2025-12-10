import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as admin from 'firebase-admin';
import { Repository } from "typeorm";
import { FcmToken } from "../fcm-token/entity/fcm-token.entity";

@Injectable()
export class FirebaseNotificationService {
    constructor(
        @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
        @InjectRepository(FcmToken, 'core')
        private readonly fcmTokenRepository: Repository<FcmToken>,
    ) { }

    private async sendNotification(
        tokens: FcmToken[],
        title: string,
        body: string,
        data?: Record<string, string>,
    ) {
        if (!tokens.length) {
            return { successCount: 0, failureCount: 0 };
        }

        const message = {
            notification: { title, body },
            tokens: tokens.map((t) => t.token),
            data,
        };

        const response = await this.firebaseAdmin
            .messaging()
            .sendEachForMulticast(message);

        response.responses.forEach((res)=>{
            console.log(res.error)
        })

        // Remove invalid tokens
        response.responses.forEach((res, idx) => {
            if (!res.success) {
                const errorCode = res.error?.code;

                if (
                    errorCode === 'messaging/invalid-registration-token' ||
                    errorCode === 'messaging/registration-token-not-registered'
                ) {
                    this.fcmTokenRepository.delete(tokens[idx].id);
                }
            }
        });

        return {
            successCount: response.successCount,
            failureCount: response.failureCount,
        };
    }

    async sendToUser(
        userId: string,
        title: string,
        body: string,
        data?: Record<string, string>,
    ) {
        const tokens = await this.fcmTokenRepository.find({ where: { userId } });
        return this.sendNotification(tokens, title, body, data);
    }

    async sendNotificationToUsersInWorkspace(
        workspaceId: string,
        title: string,
        body: string,
        data?: Record<string, string>,
    ) {
        const tokens = await this.fcmTokenRepository.find({ where: { workspaceId } });
        return this.sendNotification(tokens, title, body, data);
    }
}
