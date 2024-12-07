interface Subscription {
  name: string;
  baseAmount: number;
  startTime: number;
  active: boolean;
}

interface SubscriptionTableProps {
  subscriptionDetails: Subscription[];
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptionDetails,
}) => {
  return subscriptionDetails.length > 0 ? (
    <table className="table-auto  w-full mt-5 border">
      <thead>
        <tr>
          <th className="px-4 w-1/4 py-2 border">Service Name</th>
          <th className="px-4 w-1/4 py-2 border">Cost</th>
          <th className="px-4 w-1/4 py-2 border">Next Billing Date</th>
          <th className="px-4 w-1/4 py-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {subscriptionDetails.map((subscription, index) => (
          <tr className="text-center" key={index}>
            <td colSpan={4} className="p-2">
              <div className="flex items-center justify-between bg-white bg-opacity-[50%] border rounded-lg p-4 shadow-md">
                <span className="w-1/4 ">{subscription.name || "N/A"}</span>
                <span className="w-1/4">
                  {subscription.baseAmount
                    ? Number(subscription.baseAmount)
                    : "N/A"}
                </span>
                <span className="w-1/4">
                  {subscription.startTime
                    ? new Date(
                        Number(subscription.startTime) * 1000
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
                <span className="w-1/4">
                  {subscription.active ? "Active" : "Inactive"}
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="mt-5">No subscriptions found.</p>
  );
};

export default SubscriptionTable;
