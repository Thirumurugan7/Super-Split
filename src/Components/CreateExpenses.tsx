import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { FaAngleLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import {
  encodeFunctionData,
  defineChain,
  createPublicClient,
  http,
  getContract,
  Address,
} from "viem";
import FlexfuseAbi from "../../public/abis/flexfuse.json";
import TOKENABI from "../../public/abis/token.json";
import { toast } from "react-toastify";
import { BASE_CONTRACT, POLYGON_CONTRACT_ADDRESS, POLYGON_USDC_ADDRESS, SEPOLIA_CONTRACT_ADDRESS_SENDER, tokenDefaultAddress } from "../constants";
import { useSelector } from "react-redux";
import axios from 'axios';


const CONTRACT_ADDRESS = "0x6f0029F082e03ee480684aC5Ef7fF019813ac1C2";


function CreateExpenses({ setAuthToken, authToken, handleLogout }:any) {
  const Navigate = useNavigate();
  const network = useSelector((state: any) => state?.network?.network);
  const [groupExpenses, setGroupExpenses] = useState<
    [bigint[], string[], bigint[], boolean[]]
  >([[], [], [], []]);
  const [groupId, setGroupId] = useState<number[]>([]);
  const [amount, setAmount] = useState<number | "">("");
  const [selectedGroupId, setSelectedGroupId] = useState<number>(groupId[0] || 1);
  const ethcontractaddress =
    network === "base"
      ? BASE_CONTRACT
      : network === "pol"
      ? POLYGON_CONTRACT_ADDRESS
      : POLYGON_CONTRACT_ADDRESS;

  async function createExpenses({
    groupId,
    amount,
  }: {
    groupId: number;
    amount: number;
  }): Promise<void> {

    console.log( groupId,
      amount);
      const networkName = network === "base" ? "BASE" : network === "pol" ? "POLYGON_TESTNET_AMOY" : "APTOS"

    const token = networkName === "BASE" ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913":  POLYGON_USDC_ADDRESS;
    const data = encodeFunctionData({
      abi: FlexfuseAbi,
      functionName: "addExpense",
      args: [groupId, amount, token],
    });
 


    try {
      // const response = await kintoSDK.sendTransaction([
      //   { to: CONTRACT_ADDRESS, data, value: BigInt(0) },
      // ]);
      // console.log("Expenses created:", response);
      // toast.success("Expenses created successfully!");
      // Navigate("/Dashboard");

      const authy = localStorage.getItem("auth")

      console.log("authy", authy);
      


const walletsResponse = await axios({  // renamed to walletsResponse
  method: 'post',
  url: "https://sandbox-api.okto.tech/api/v1/wallet",
  headers: {
      'Authorization': `Bearer ${authy}`
  }
});
console.log("wallets", walletsResponse.data.data.wallets);
const networks = walletsResponse.data.data.wallets;

console.log("networks",networks);



const baseAddress = networks.find((network:{ network_name: String; address: String }) => network.network_name === networkName).address;

console.log("address",baseAddress)

const dataForapproval = encodeFunctionData({
  abi: TOKENABI,
  functionName: "approve",
  args: [ethcontractaddress, 1245125125125125121212512],
});



const options = {
  method: 'POST',
  url: 'https://sandbox-api.okto.tech/api/v1/rawtransaction/execute',
  headers: {Authorization: `Bearer ${authy}`, 'Content-Type': 'application/json'},
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
const optionsForToken = {
  method: 'POST',
  url: 'https://sandbox-api.okto.tech/api/v1/rawtransaction/execute',
  headers: {Authorization: `Bearer ${authy}`, 'Content-Type': 'application/json'},
  data: {
    network_name: networkName,
    transaction: {
      from: baseAddress,
      to: token,
      data: dataForapproval,
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

      Navigate("/Dashboard");

    } catch (error) {
      console.error("Error creating expenses:", error);
      toast.error(
        "Error creating expenses. Check the console for more details."
      );
    }
  }
  
  

  const fetchGroupExpenses = async () => {
    try {

      const authy = localStorage.getItem("auth")
console.log("authy",authy);
const networkName = network === "base" ? "BASE" : network === "pol" ? "POLYGON_TESTNET_AMOY" : "APTOS"


const options = {
  method: 'POST',
  url: 'https://sandbox-api.okto.tech/api/v1/readContractData',
  headers: {Authorization: `Bearer ${authy}`, 'Content-Type': 'application/json'},
  data: {
    network_name: networkName,
    data: {
      contractAddress: ethcontractaddress,
      abi: {
        inputs: [],
        name: 'getAllGroups',
        outputs: [
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          },
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          },
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          },
          {
            "internalType": "bool[]",
            "name": "",
            "type": "bool[]"
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      args: {}
    }
  }
};


try {
  const { data } = await axios.request(options);
  console.log("group data",data.data[0]);

  setGroupId((data.data[0] ));
          // console.log("result", subscriptionDetails);
      } catch (error) {
        console.error(error);
      }
      // const client = createPublicClient({
      //   chain: KINTO_CHAIN,
      //   transport: http(),
      // });

      // const contract = getContract({
      //   address: CONTRACT_ADDRESS as Address,
      //   abi: FlexfuseAbi,
      //   client: { public: client },
      // });

      // const groups = (await contract.read.getAllGroups()) as [
      //   bigint[],
      //   string[],
      //   bigint[],
      //   boolean[]
      // ];
      // setGroupExpenses(groups as [bigint[], string[], bigint[], boolean[]]);

      // if (groups[0] && groups[0].length > 0) {
      //   setGroupId(Number(groups[0][0]));
      // }
    } catch (error) {
      console.error("Error fetching group expenses:", error);
    }
  };



  useEffect(() => {
   
      fetchGroupExpenses();
   
  }, [network]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (groupId === null || amount === "") {
      toast.warning("Please fill in both Group ID and Amount.");
      return;
    }

    console.log("groupId",selectedGroupId);
    console.log("amount",amount);

  
   
      createExpenses({ groupId: selectedGroupId, amount: Number(amount) })
 
  };

  return (
    <div className="bg-[#E8E8E8] flex flex-col justify-between min-h-screen">
          <Navbar  authToken={authToken} setAuthToken={setAuthToken} handleLogout={handleLogout} />

      <main className="flex-grow">
        <div className="flex justify-between pl-20">
          <Link
            to="/Dashboard"
            className="flex gap-2 items-center text-black font-dmsans text-lg"
          >
            <FaAngleLeft />
            <span> Back</span>
          </Link>
          <div className="-ml-20 text-center">
            <p className="font-playfair italic font-bold text-3xl mt-5">
              Add New Expense{" "}
            </p>
            <p className="font-dmsans pt-3 text-lg">
              Record a shared expense and split it among group members.{" "}
            </p>
          </div>
          <div></div>
        </div>

        {/* Form Section */}
        <div className="px-20 max-w-2xl mx-auto mt-10">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <label htmlFor="groupId" className="block font-semibold mb-2">
                Group ID
              </label>
              <select
  value={selectedGroupId}
  onChange={(e) => setSelectedGroupId(Number(e.target.value))}
  className="w-full px-3 py-2 border rounded"
>
  {groupId.map((id) => (
    <option key={id} value={id}>
      Group {id}
    </option>
  ))}
</select>
            </div>
            <div className="mb-4">
              <label htmlFor="amount" className="block font-semibold mb-2">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.valueAsNumber || "")}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter Amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
              Create Expense
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CreateExpenses;
