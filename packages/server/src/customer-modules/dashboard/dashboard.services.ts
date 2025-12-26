import { Injectable } from "@nestjs/common";
import { WaMessageService } from "../whatsapp/services/whatsapp-message.service";
import ms from "ms";
import { DashboardStatsDto } from "./Dto/DashboardStats.dto";
import { ContactsService } from "../contacts/contacts.service";
import { BroadcastService } from "../broadcast/services/broadcast.service";


@Injectable()
export class DashboardService {
    constructor(
        private readonly waMessageService: WaMessageService,
        private readonly contactsService: ContactsService,
        private readonly broadcastService: BroadcastService
    ) { }

    async getDashboardStats(): Promise<DashboardStatsDto> {

        const messagesCoutn = await this.waMessageService.TotalMsgCount();
        const allContacts = await this.contactsService.findAllContacts();
        const allBroadcast = await this.broadcastService.getAllBroadCast();

        return {
            sentCount: messagesCoutn.sentCount,
            deliveredCount: messagesCoutn.deliveredCount,
            failedCount: messagesCoutn.failedCount,
            openRate : messagesCoutn.openRate,
            contacts: allContacts,
            broadcasts: allBroadcast
        };
    }

    async calculateEngagementGraphData(startDate: Date, endDate: Date) {
        const allMessages = await this.waMessageService.getMessageBetweenDateInterval(startDate, endDate);
        const graphData: { date: string; sentCount: number; deliveredCount: number }[] = [];
        const dateMap: Map<string, { sentCount: number; deliveredCount: number }> = new Map();

        for (const message of allMessages) {
            const dateKey = message.createdAt.toISOString().split('T')[0];

            if (!dateMap.has(dateKey)) {
                dateMap.set(dateKey, { sentCount: 0, deliveredCount: 0 });
            }

            const counts = dateMap.get(dateKey)!;

            if (message.state === 'Sent' || message.state === 'Delivered' || message.state === 'Read') {
                counts.sentCount += 1;
            }
            if (message.state === 'Delivered' || message.state === 'Read') {
                counts.deliveredCount += 1;
            }

        }

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateKey = currentDate.toISOString().split('T')[0];
            const counts = dateMap.get(dateKey) || { sentCount: 0, deliveredCount: 0 };

            const formattedDate = currentDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
            });

            graphData.push({
                date: formattedDate,
                sentCount: counts.sentCount,
                deliveredCount: counts.deliveredCount,
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        graphData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        return graphData;

    }
}