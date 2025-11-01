import { Inject, Injectable } from "@nestjs/common";
import { CONNECTION } from "src/modules/workspace-manager/workspace.manager.symbols";
import { Connection } from "typeorm";
import { ChannelService } from "../services/channel.service";
import { OnEvent } from "@nestjs/event-emitter";
import { ContactsService } from "src/customer-modules/contacts/contacts.service";


@Injectable()
export class ContactUpdatedListener {
    constructor(
        private readonly channelService: ChannelService
    ) { }

    @OnEvent('contact.updated')
    async handleContactUpdatedEvent(payload: {workspaceId: string, phoneNo: string, contactName: string }) {
        console.log("event trigger")
        const channel = await this.channelService.findExistingChannelByPhoneNo([payload.phoneNo]);

        if (!channel) {
            console.log('No existing channel found for this phone.');
        } else {
            await this.channelService.updateChannelNameById(channel.id, payload.contactName);
            console.log(`Channel name updated to ${payload.contactName} for phone number ${payload.phoneNo}`);
        }
    }
}