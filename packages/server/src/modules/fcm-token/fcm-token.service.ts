import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmToken } from 'src/modules/fcm-token/entities/fcm-token.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class FcmTokenService {
    constructor(
        @InjectRepository(FcmToken, 'core')
        private fcmTokenRepo: Repository<FcmToken>,
    ) { }

    async createFcmToken(token: string, user: User, workspaceId: string) {
        let existing = await this.fcmTokenRepo.findOne({ where: { token: token } });

        if (existing) {
            existing.token = token;
            return await this.fcmTokenRepo.save(existing);
        }

        return await this.fcmTokenRepo.save(
            this.fcmTokenRepo.create({ token, user, userId: user.id, workspaceId })
        );
    }
}
