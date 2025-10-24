import React, { useMemo, useState } from "react";
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
import { findCountForDash } from '@src/generated/graphql';
import { useRecoilState } from 'recoil';


import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
import Engagement from "@src/modules/dashboard/components/Engagement";
import RecentCampaigns from "@src/modules/dashboard/components/RecentCampaigns";
import DashboardContacts from "@src/modules/dashboard/components/DashboardContacts";
import Performance from "@src/modules/dashboard/components/Performance";
import BroadcastForm from "@src/modules/broadcast/components/BroadcastForm";


export default function Dashboard() {

  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);

  const [campaigns, setCampaigns] = useState(sampleCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isNewBroadcast, setIsNewBroadcast] = useState(false)

  const { data, refetch, loading } = useQuery(findCountForDash, {
    variables: { workspaceId: currentUserWorkspace?.id }
  })

  const kpisData = data?.findWorkspaceByIdForDash;


  const [contacts] = useState(kpisData?.contacts);


  const kpis = useMemo(() => {
    const totalSent = campaigns.reduce((s, c) => s + c.messagesSent, 0);
    const totalDelivered = campaigns.reduce((s, c) => s + c.messagesDelivered, 0);
    const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
    const openRate = totalDelivered ? Math.round((totalClicks / totalDelivered) * 100) : 0;
    return { totalSent, totalDelivered, totalClicks, openRate };
  }, [campaigns]);

  return (
    isNewBroadcast ?
      (<BroadcastForm onBack={() => setIsNewBroadcast(false)} broadcastId={false}/>)
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
            <Engagement kpis={kpis} />
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


// --- Sample Data ---
const engagementData = [
  { date: 'Aug 6', sent: 1200, delivered: 1150 },
  { date: 'Aug 7', sent: 980, delivered: 940 },
  { date: 'Aug 8', sent: 1500, delivered: 1440 },
  { date: 'Aug 9', sent: 1100, delivered: 1080 },
  { date: 'Aug 10', sent: 1250, delivered: 1200 },
  { date: 'Aug 11', sent: 900, delivered: 860 },
  { date: 'Aug 12', sent: 1700, delivered: 1630 },
];

const sampleContacts = [
  { id: 'c1', name: 'Amit Sharma', phone: '+91 98765 43210', avatar: '🧑', lastSeen: '2h' },
  { id: 'c2', name: 'Design Team', phone: '+91 11111 22222', avatar: '🎨', lastSeen: '1d' },
  { id: 'c3', name: 'Mom', phone: '+91 99999 88888', avatar: '👩‍🦳', lastSeen: 'online' },
  { id: 'c4', name: 'Vendor', phone: '+91 77777 66666', avatar: '🏢', lastSeen: '3d' },
  { id: 'c5', name: 'Customers', phone: '+91 55555 44444', avatar: '👥', lastSeen: '5d' },
];

const sampleCampaigns = [
  { id: 'cmp1', name: 'Onboarding Flow', segment: 'New users', sentAt: 'Aug 11, 2025', messagesSent: 1500, messagesDelivered: 1400, clicks: 120 },
  { id: 'cmp2', name: 'Sale Promo', segment: 'All customers', sentAt: 'Aug 9, 2025', messagesSent: 3000, messagesDelivered: 2900, clicks: 400 },
  { id: 'cmp3', name: 'NPS Survey', segment: 'Recent buyers', sentAt: 'Aug 5, 2025', messagesSent: 800, messagesDelivered: 760, clicks: 60 },
  { id: 'cmp4', name: 'Feature Update', segment: 'Active users', sentAt: 'Aug 2, 2025', messagesSent: 1200, messagesDelivered: 1150, clicks: 90 },
  { id: 'cmp5', name: 'Re-engagement', segment: 'Dormant users', sentAt: 'Jul 30, 2025', messagesSent: 600, messagesDelivered: 540, clicks: 30 },
];