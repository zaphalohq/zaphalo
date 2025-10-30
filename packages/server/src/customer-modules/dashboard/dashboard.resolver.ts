import { Resolver, Query, Args } from "@nestjs/graphql";
import { DashboardService } from "./dashboard.services";
import { DashboardStatsDto } from "./Dto/DashboardStats.dto";
import { EngagementGraphDataDto } from "./Dto/EngagementGraphData.dto";

@Resolver()
export class DashboardResolver {
    constructor(
        private readonly dashboardService: DashboardService,
    ) { }

    @Query(() => DashboardStatsDto)
    async getDashboardStats(
    ) {
        return this.dashboardService.getDashboardStats();
    }

    @Query(() => [EngagementGraphDataDto])
    async getEngagementGraphData(
        @Args('startDate') startDate: string,
        @Args('endDate') endDate: string,
    ) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.dashboardService.calculateEngagementGraphData(start, end);
    }
}
