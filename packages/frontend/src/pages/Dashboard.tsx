import { useRecoilState } from 'recoil';
import React, { useState, useEffect } from 'react';
import { MessageSquare, Users2, Layout } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@apollo/client';
import MetricsCards from '@components/UI/MetricsCards';
import { findCountForDash } from '@src/generated/graphql';
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';

interface MetricsData {
  totalChannels: number;
  totalMessages: number;
  totalContacts: number;
}

interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

const Dashboard: React.FC = () => {
  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);
  const [metrics, setMetrics] = useState<MetricsData>({
    totalChannels: 0,
    totalMessages: 0,
    totalContacts: 0,
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const { data, refetch, loading } = useQuery(findCountForDash, {
    variables: { workspaceId: currentUserWorkspace?.id }
  })

  useEffect(() => {
    refetch()
    const findCountForDash = data?.findWorkspaceByIdForDash;
    const channels = findCountForDash?.workspace?.channels;
    const contacts = findCountForDash?.contacts
    let messagesCount = 0
    channels?.forEach((channel: any) => {
      messagesCount = messagesCount + channel.messages.length
    });
    const loadData = setTimeout(() => {
      const metricsData: MetricsData = {
        totalChannels: channels.length,
        totalMessages: messagesCount,
        totalContacts: contacts.length,
      };

      setMetrics(metricsData);
      const barChartData: ChartDataPoint[] = [
        { name: 'Channels', value: metricsData.totalChannels, color: '#3b82f6' },
        { name: 'Messages', value: metricsData.totalMessages, color: '#8b5cf6' },
        { name: 'Contacts', value: metricsData.totalContacts, color: '#10b981' }
      ];
      setChartData(barChartData);

    }, 500);

    return () => clearTimeout(loadData);
  }, [data, loading]);

  const CustomBar = (props: any) => {
    const { x, y, width, height, index } = props;
    const color = chartData[index]?.color || '#8884d8';

    return <rect x={x} y={y} width={width} height={height} fill={color} rx={4} ry={4} />;
  };

  return (
    <div>
      <div className='font-bold text-lg border-gray-300 p-4 border-b'>Dashboard Overview</div>
      <div className="mt-4 bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <MetricsCards title="Total Channels" total={metrics.totalChannels}
            Ip-4 con={<Layout className="text-blue-500" size={24} />}
            baseColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <MetricsCards title="Total Messages" total={metrics.totalMessages}
            Icon={<MessageSquare className="text-purple-500" size={24} />}
            baseColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <MetricsCards title="Total Contacts" total={metrics.totalContacts}
            Icon={<Users2 className="text-green-500" size={24} />}
            baseColor="bg-green-50"
            textColor="text-green-600"
          />

        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Metrics Overview</h2>
          <div className="h-64 w-full md:w-[50%]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value}`, 'Total']}
                  labelFormatter={(name) => `${name}`}
                />
                <Bar
                  dataKey="value"
                  name="Total"
                  shape={CustomBar}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4 space-x-6">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 mr-2 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;