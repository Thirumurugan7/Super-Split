import React from "react";

interface GroupExpensesTableProps {
  groupExpenses: [bigint[], string[], bigint[], boolean[]];
}

const GroupExpensesTable: React.FC<GroupExpensesTableProps> = ({
  groupExpenses,
}) => {
  const structuredGroupExpenses =
    groupExpenses[0]?.map((id, index) => ({
      id,
      name: groupExpenses[1]?.[index] || "N/A",
      totalPayments: groupExpenses[2]?.[index] || 0n,
      isActive: groupExpenses[3]?.[index] || false,
    })) || [];

  return structuredGroupExpenses.length > 0 ? (
    <table className="table-auto text-center w-full mt-5 border">
      <thead>
        <tr>
          <th className="px-4 w-1/4 py-2 border">Group ID</th>
          <th className="px-4 w-1/4 py-2 border">Group Name</th>
          <th className="px-4 w-1/4 py-2 border">Balance</th>
          <th className="px-4 w-1/4 py-2 border">Active</th>
        </tr>
      </thead>
      <tbody>
        {structuredGroupExpenses.map((group, index) => (
          <tr className="text-center" key={group.id?.toString() || index}>
            <td colSpan={4} className="p-2">
              <div className="flex items-center justify-between bg-white bg-opacity-[50%] border rounded-lg p-4 shadow-md">
                <span className="w-1/4">{group.id?.toString() || "N/A"}</span>
                <span className="w-1/4">{group.name || "N/A"}</span>
                <span className="w-1/4">
                  {group.totalPayments?.toString() || "N/A"}
                </span>
                <span className="w-1/4">{group.isActive ? "Yes" : "No"}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="mt-5">No group expenses found.</p>
  );
};

export default GroupExpensesTable;
