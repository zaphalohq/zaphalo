import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FirebaseNotificationService } from './firebaseNotification.service';
import { SendNotificationResponse } from './dto/notificationResponse.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class FirebaseResolver {
    constructor(
        private readonly notificationService: FirebaseNotificationService,
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => SendNotificationResponse)
    async sendNotificationToUser(
        @Args('userId') userId: string,
        @Args('title') title: string,
        @Args('body') body: string,
        @Args('data', { type: () => String, nullable: true }) data?: string,
    ) {
        const parsedData = data ? JSON.parse(data) : undefined;

        const result = await this.notificationService.sendToUser(
            userId,
            title,
            body,
            parsedData,
        );

        return {
            successCount: result.successCount,
            failureCount: result.failureCount,
        };
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => SendNotificationResponse)
    async sendNotificationToAllUserInWorkspace(
        @Args('workspaceId') workspaceId: string,
        @Args('title') title: string,
        @Args('body') body: string,
        @Args('data', { type: () => String, nullable: true }) data?: string,
    ){
        const parsedData = data ? JSON.parse(data) : undefined;
    }
}
