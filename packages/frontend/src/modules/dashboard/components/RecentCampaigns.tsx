
const RecentCampaigns = ({campaigns}) => {
    return (
        <>
            <div className="bg-white p-4 rounded-md border">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Recent Campaigns</h3>
                    <div className="text-sm text-gray-500">Showing 5</div>
                </div>

                <div className="divide-y">
                    {campaigns.slice(0, 5).map((c) => (
                        <div key={c.id} className="py-3 flex items-center justify-between">
                            <div>
                                <div className="font-medium">{c.name}</div>
                                <div className="text-xs text-gray-500">{c.segment} — {c.sentAt}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold">{c.messagesSent}</div>
                                <div className="text-xs text-gray-500">sent</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default RecentCampaigns
