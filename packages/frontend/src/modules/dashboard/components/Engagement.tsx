import { ChartBar, MessageCircle, Send, Users } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function KpiCard({ title, value, icon }) {
    return (
        <div className="bg-white p-4 rounded-md border flex items-center gap-4">
            <div className="p-3 rounded-md bg-green-50 text-green-600">{icon}</div>
            <div>
                <div className="text-sm text-gray-500">{title}</div>
                <div className="text-xl font-semibold">{value}</div>
            </div>
        </div>
    );
}

const Engagement = ({kpisData,engagementGraphData}) => {

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard title="Messages Sent" value={kpisData?.sentCount} icon={<MessageCircle size={20} />} />
                <KpiCard title="Delivered" value={kpisData?.deliveredCount} icon={<Users size={20} />} />
                <KpiCard title="Failed" value={kpisData?.failedCount} icon={<ChartBar size={20} />} />
                <KpiCard title="Open Rate" value={`${kpisData?.openRate.toFixed(2)}%`} icon={<Send size={20} />} />
            </div>

            <div className="bg-white p-4 rounded-md border">
                <h3 className="font-semibold mb-3">Engagement (last 7 days)</h3>
                <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={engagementGraphData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sentCount" stroke="#10B981" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="deliveredCount" stroke="#3B82F6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}



const engagementData = [
    { date: 'Aug 6', sent: 1200, delivered: 1150 },
    { date: 'Aug 7', sent: 980, delivered: 940 },
    { date: 'Aug 8', sent: 1500, delivered: 1440 },
    { date: 'Aug 9', sent: 1100, delivered: 1080 },
    { date: 'Aug 10', sent: 1250, delivered: 1200 },
    { date: 'Aug 11', sent: 900, delivered: 860 },
    { date: 'Aug 12', sent: 1700, delivered: 1630 },
];

export default Engagement
