import axios from "axios";
import { POLYGON_CONTRACT_ADDRESS, POLYGON_USDC_ADDRESS } from "../constants";
import { BASE_CONTRACT } from "../constants";
import React from "react";
import { useSelector } from "react-redux";
import {
  encodeFunctionData,
  defineChain,
  createPublicClient,
  http,
  getContract,
  Address,
} from "viem";

import FlexfuseAbi from "../../public/abis/flexfuse.json";

interface GroupExpensesTableProps {
  groupExpenses: [bigint[], string[], bigint[], boolean[]];
}

const GroupExpensesTable: React.FC<GroupExpensesTableProps> = ({
  groupExpenses,
}) => {
  const network = useSelector((state: any) => state?.network?.network);

  console.log("group",groupExpenses);
  const networkName = network === "base" ? "BASE" : network === "pol" ? "POLYGON_TESTNET_AMOY" : "APTOS"

  const structuredGroupExpenses =
    groupExpenses[0]?.map((id, index) => ({
      id,
      name: groupExpenses[1]?.[index] || "N/A",
      totalPayments: groupExpenses[2]?.[index] || 0n,
      isActive: groupExpenses[3]?.[index] || false,
    })) || [];


    const ethcontractaddress =
    network === "base"
      ? BASE_CONTRACT
      : network === "pol"
      ? POLYGON_CONTRACT_ADDRESS
      : POLYGON_CONTRACT_ADDRESS;

    const handleOnPay = async(id:any) => {
      try {
        console.log("id",id)

        const auth = localStorage.getItem("auth");


    const token = networkName === "BASE" ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913":  POLYGON_USDC_ADDRESS;
    const data = encodeFunctionData({
      abi: FlexfuseAbi,
      functionName: "payGroupExpense",
      args: [id, 1, token],
    });


const walletsResponse = await axios({  // renamed to walletsResponse
  method: 'post',
  url: "https://sandbox-api.okto.tech/api/v1/wallet",
  headers: {
      'Authorization': `Bearer ${auth}`
  }
});
console.log("wallets", walletsResponse.data.data.wallets);
const networks = walletsResponse.data.data.wallets;

console.log("networks",networks);



const baseAddress = networks.find((network:{ network_name: String; address: String }) => network.network_name === networkName).address;

console.log("address",baseAddress)


        const options = {
          method: 'POST',
          url: 'https://sandbox-api.okto.tech/api/v1/rawtransaction/execute',
          headers: {Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json'},
          data: {
            network_name: networkName,
            transaction: {
              from: baseAddress,
              to: ethcontractaddress,
              data: data,
              value: '0x'
            }
          }
        };
        
        
        try {
          const { data } = await axios.request(options);
          console.log(data);


        } catch (error) {
          console.error(error);
        }

      } catch (error) {
        
      }
    }

  return structuredGroupExpenses.length > 0 ? (
    <table className="table-auto text-center w-full mt-5 border">
      <thead>
        <tr>
          <th className="px-4 w-1/4 py-2 border">Group ID</th>
          <th className="px-4 w-1/4 py-2 border">Group Name</th>
          <th className="px-4 w-1/4 py-2 border">Balance</th>
          <th className="px-4 w-1/4 py-2 border">Active</th>
          <th className="px-4 w-1/4 py-2 border">Action</th>
        </tr>
      </thead>
      <tbody>
        {structuredGroupExpenses.map((group, index) => (
          <tr className="text-center" key={group.id?.toString() || index}>
            <td colSpan={5} className="p-2">
              <div className="flex items-center justify-between bg-white bg-opacity-[50%] border rounded-lg p-4 shadow-md">
                <span className="w-1/4">{group.id?.toString() || "N/A"}</span>
                <span className="w-1/4">{group.name || "N/A"}</span>
                <span className="w-1/4">
                  {group.totalPayments?.toString() || "N/A"}
                </span>
                <span className="w-1/4">{group.isActive ? "Yes" : "No"}</span>
                {group.isActive && <span><button className="py-4 px-3 rounded border border-black" onClick={()=>{
handleOnPay(group.id)
                }}>Pay</button></span>}
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
