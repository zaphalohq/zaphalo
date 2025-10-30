import React, { use, useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Send, Users, MessageCircle, ChartBar, Calendar } from "lucide-react";

import { useQuery } from '@apollo/client';
import { findCountForDash, GetDashboardStats, GetEngegmentGraphData } from '@src/generated/graphql';
import { useRecoilState } from 'recoil';


import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
import Engagement from "@src/modules/dashboard/components/Engagement";
import RecentCampaigns from "@src/modules/dashboard/components/RecentCampaigns";
import DashboardContacts from "@src/modules/dashboard/components/DashboardContacts";
import Performance from "@src/modules/dashboard/components/Performance";
import BroadcastForm from "@src/modules/broadcast/components/BroadcastForm";


export default function Dashboard() {

  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isNewBroadcast, setIsNewBroadcast] = useState(false)

  const { data, refetch, loading } = useQuery(GetDashboardStats, {})
  const dashboardStatsData = useMemo(() => {
    return data?.getDashboardStats || null;
  }, [data?.getDashboardStats]);

  

  const contacts = useMemo(() => {
    return dashboardStatsData?.contacts || [];
  }, [dashboardStatsData?.contacts]);

  const campaigns = useMemo(() => {
    return dashboardStatsData?.broadcasts || [];
  }, [dashboardStatsData?.broadcasts]);

  
  //Engegement Graph Data
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // includes today
    return {
      startDate: sevenDaysAgo.toISOString(),
      endDate: today.toISOString(),
    };
  }, []);

  const { data: engagementData } = useQuery(GetEngegmentGraphData, {
    variables: {
      startDate,
      endDate,
    },
  });

  const engagementGraphData = useMemo(() => {
    return engagementData?.getEngagementGraphData || [];
  }, [engagementData?.getEngagementGraphData]);


  return (
    isNewBroadcast ?
      (<BroadcastForm onBack={() => setIsNewBroadcast(false)} broadcastId={false} />)
      :
      (<div className="p-6 bg-gray-50 min-h-screen">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">WhatsApp Marketing Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of campaigns, contacts, and broadcasts</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border rounded-md flex items-center gap-2 hover:shadow">
              <Calendar size={16} />
              Today
            </button>
            <button onClick={() => setIsNewBroadcast(true)} className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:opacity-95">
              <Send size={16} /> New Broadcast
            </button>
          </div>
        </header>

        <section className="grid grid-cols-12 gap-6">
          {/* KPIs */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <Engagement kpisData={dashboardStatsData} engagementGraphData={engagementGraphData} />
            <RecentCampaigns campaigns={campaigns}></RecentCampaigns>
          </div>

          {/* Right column: contacts + campaign details */}
          <aside className="col-span-12 lg:col-span-5 space-y-6">
            <DashboardContacts contacts={contacts} />
            <Performance campaigns={campaigns} />
          </aside>
        </section>
      </div>
      )
  );
}
