import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const Performance = ({campaigns}) => {
    return (
        <>
            <div className="bg-white p-4 rounded-md border">
                <h3 className="font-semibold mb-3">Campaign Performance</h3>
                <div style={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={campaigns.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="sentCount" fill="#10B981" />
                            <Bar dataKey="failedCount" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}

export default Performance
