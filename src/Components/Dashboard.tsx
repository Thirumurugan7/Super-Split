import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Contract, RpcProvider } from "starknet";

import {
  Address,
  createPublicClient,
  defineChain,
  getContract,
  http,
} from "viem";
import FlexfuseAbi from "../../public/abis/flexfuse.json";
import {
  

  POLYGON_USDC_ADDRESS,POLYGON_CONTRACT_ADDRESS,
  BASE_CONTRACT
} from "../constants";
import { useAccount } from "wagmi";
import SubscriptionTable from "./SubscriptionTable";
import GroupExpensesTable from "./GroupExpensesTable";
import { Link } from "react-router-dom";
import { FaWallet } from "react-icons/fa6";
import { CiSquarePlus } from "react-icons/ci";
import { TiGroup } from "react-icons/ti";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import axios from 'axios';

interface ContractGroup {
  id: number;
  name: string;
  members: string[];
  totalPayments: number;
  active: boolean;
}

interface ApiResponse {
  data: {
    data: ContractGroup;
  };
}



const Dashboard = ({ setAuthToken, authToken, handleLogout }:any) => {
  const walletAddress = useSelector((state: any) => state?.wallet?.address);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any[]>([]);
  const [groupExpenses, setGroupExpenses] = useState<
    [bigint[], string[], bigint[], boolean[]]
  >([[], [], [], []]);
  const [loading, setLoading] = useState(false);
  const network = useSelector((state: any) => state?.network?.network);
  const auth = useSelector((state: any) => state?.auth?.auth);
  const account = useAccount();
  const [activeSection, setActiveSection] = useState<
    "subscriptions" | "groups"
  >("subscriptions");
  const ethcontractaddress =
    network === "base"
      ? BASE_CONTRACT
      : network === "pol"
      ? POLYGON_CONTRACT_ADDRESS
      : POLYGON_CONTRACT_ADDRESS;


      console.log("auth",auth);
      

      const authy = localStorage.getItem("auth")
console.log("authy",authy);

  const fetchSubscriptionDetails = async () => {
    if (!walletAddress) return;

    setLoading(false);

 
  };

  const fetchSubscriptionDetailsEth = async () => {
   
    console.log("contract", ethcontractaddress);


    const GETSUBSCRIPTION = async() => {
      try {
console.log("aavfasf",network);

        const networkName = network === "base" ? "BASE" : network === "pol" ? "POLYGON_TESTNET_AMOY" : network === "starknet" ? "STARK" :  "APTOS"
        

        if(network === "starknet"){
          console.log("starknet");

          const contractAddress = "0x75a49eb37cf05058feb345e8bfbba12ab2c2be31fae9e0e53c700ab75ef7462"
          const getValue = async () => {
            const provider = new RpcProvider({
              nodeUrl:
                "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/NC_mjlIJfcEpaOhs3JB4JHcjFQhcFOrs",
            });
            const ContAbi = await provider.getClassAt(contractAddress);
            console.log(">> contract abi", ContAbi);
            const newContract = new Contract(
              ContAbi.abi,
              contractAddress,
              provider
            );
            const address = auth?.address;
            console.log("wallet address", address);
            console.log("contract details",  newContract);
            // const response = await newContract.increment();
            // Call the contract function
            console.log("sdcdas",  newContract);
            
            const response =  await newContract.get_all_subscriptions();
        
            console.log(">> response", response);
        
            // No need for .flat(), since the response is a single value
            // setCount(response);
            console.log("Current value:", response);
          };

          getValue()
          return
        }

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
                name: 'getAllSubscriptions',
                outputs: [
                  {
                    "components": [
                      {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                      },
                      {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                      },
                      {
                        "internalType": "address",
                        "name": "serviceProvider",
                        "type": "address"
                      },
                      {
                        "internalType": "uint256",
                        "name": "baseAmount",
                        "type": "uint256"
                      },
                      {
                        "internalType": "address",
                        "name": "token",
                        "type": "address"
                      },
                      {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                      },
                      {
                        "internalType": "enum SuperSplit.Frequency",
                        "name": "frequency",
                        "type": "uint8"
                      },
                      {
                        "internalType": "bool",
                        "name": "active",
                        "type": "bool"
                      }
                    ],
                    "internalType": "struct SuperSplit.Subscription[]",
                    "name": "",
                    "type": "tuple[]"
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
          console.log(data);

          setSubscriptionDetails((data.data[0] as any[]));
            console.log("result", subscriptionDetails);
        } catch (error) {
          console.error(error);
        }

      } catch (error) {
        console.log("error in req",error);
        
      }
    }

    GETSUBSCRIPTION()

   
  };



  const fetchGroupExpensesEth = async () => {


    const GETGROUPEXPENSE = async () => {
      const networkName = network === "base" ? "BASE" : network === "pol" ? "POLYGON_TESTNET_AMOY" : "APTOS"

      try {
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
          console.log("group data",data.data);



          const results: ContractGroup[] = [];
  
          const fetchSingleGroup = async (value: number): Promise<any | null> => {

            const networkName = network === "base" ? "BASE" : network === "pol" ? "POLYGON_TESTNET_AMOY" : "APTOS"

            const options = {
              method: 'POST',
              url: 'https://sandbox-api.okto.tech/api/v1/readContractData',
              headers: {
                Authorization: `Bearer ${authy}`,
                'Content-Type': 'application/json'
              },
              data: {
                network_name: networkName,
                data: {
                  contractAddress: ethcontractaddress,
                  abi:    {
                    "inputs": [
                      {
                        "internalType": "uint256",
                        "name": "groupId",
                        "type": "uint256"
                      }
                    ],
                    "name": "getGroupDetails",
                    "outputs": [
                      {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                      },
                      {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                      },
                      {
                        "internalType": "address[]",
                        "name": "members",
                        "type": "address[]"
                      },
                      {
                        "internalType": "uint256",
                        "name": "totalPayments",
                        "type": "uint256"
                      },
                      {
                        "internalType": "bool",
                        "name": "active",
                        "type": "bool"
                      }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                  },
                  args: {
                    groupId: value
                  }
                }
              }
            };
        
            try {
              const { data } = await axios.request<ApiResponse>(options);


              return data.data;
            } catch (error) {
              console.error(`Error fetching data for value ${value}:`, error);
              return null;
            }
          };
        

          const promises = data.data[0].map((value:any )=> fetchSingleGroup(value));
  const resultsofall = await Promise.all(promises);

console.log("results of all",resultsofall);

const resultsofall1=resultsofall;
console.log( resultsofall1[0]);
console.log( resultsofall1[1]);
console.log( resultsofall1[2]);
console.log( resultsofall1[3]);

const formattedData: [bigint[], string[], bigint[], boolean[]] = [[], [], [], []];

for (let i = 0; i < resultsofall1.length; i++) {
  formattedData[0].push(resultsofall1[i][0]); // IDs
  formattedData[1].push(resultsofall1[i][1]); // Names  
  formattedData[2].push(resultsofall1[i][3]); // Payments
  formattedData[3].push(resultsofall1[i][4]); // Active status
}

setGroupExpenses(formattedData);

console.log("asfgsf",formattedData);

          // setGroupExpenses((resultsofall[0] as any[]));
            console.log("result", groupExpenses);

            return data.data[0]
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        
      }

    }

    try {
      const result = await GETGROUPEXPENSE();
console.log("resulessfd",result);

   
   



      console.log("group", groupExpenses);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
 if (network === "pol" || network === "base" || network === "starknet") {
      if (activeSection === "subscriptions") {
        fetchSubscriptionDetailsEth();
      }
     else if (activeSection === "groups") {
        fetchGroupExpensesEth();
      }
    }
    // eslint-disable-next-line
  }, [activeSection, network]);

  return (
    <div className="bg-[#E8E8E8] flex flex-col justify-between min-h-screen">
      <Navbar  authToken={authToken} setAuthToken={setAuthToken} handleLogout={handleLogout} />
      <main className="flex-grow">
        {/* Main Content */}
        <div className="flex-grow p-6">
          {true ? (
            <>
              <p className="font-playfair text-center mt-8 italic font-bold text-3xl mb-6">
                Welcome Back{" "}
                {(() => {
                  const address =
                    network === "kinto" ? walletAddress : account?.address;
                  return address
                    ? `${address.slice(0, 5)}...${address.slice(-5)}`
                    : "Guest";
                })()}
              </p>

              <div className="flex items-center gap-4 mt-8 justify-center">
                <div className="text-center text-white p-8 rounded-lg w-60 bg-[#262626] mb-6">
                  <p className="text-xl font-bold">
                    {subscriptionDetails.length}
                  </p>
                  <p className=" mt-2">Active Subscriptions</p>
                </div>
                <div className="text-center text-white p-8 rounded-lg w-60 bg-[#262626] mb-6">
                  <p className="font-bold text-xl">0.002 eth</p>
                  <p className=" mt-2"> Pending Expenses</p>{" "}
                </div>
                <div className="text-center text-white p-8 rounded-lg w-60 bg-[#262626] mb-6">
                  <p className="font-bold text-xl">$0 spent</p>
                  <p className=" mt-2"> Recent Transactions</p>{" "}
                </div>
              </div>
              <div className="flex justify-center gap-8">
                <div className="text-center w-1/4 text-white p-8 rounded-lg  bg-[#262626] mb-6">
                  <p className="font-bold flex gap-2 justify-center items-center text-xl">
                    {" "}
                    <FaWallet />
                    <span>Wallet Balance</span>
                  </p>
                  <p className="mt-2">
                    {walletAddress.slice(0, 5)}...
                    {walletAddress.slice(-5)}
                  </p>
                  <p className="mt-2 text-3xl">0.002 eth</p>
                </div>
                <div className="text-left bg-[#262626] px-3 py-2 rounded-lg flex flex-col gap-2  max-w-md mb-6">
                  <Link
                    className="bg-white flex gap-2 items-center text-black px-4 py-2 mt-1 rounded w-[350px]"
                    to="/CreateSubscription"
                  >
                    <CiSquarePlus className="text-2xl" />
                    <span>Create Subscription</span>
                  </Link>
                  <Link
                    to="/CreateExpenses"
                    className="bg-white flex gap-2 items-center text-black px-4 py-2 mt-1 rounded w-[350px]"
                  >
                    <FaMoneyBillTrendUp className="text-2xl" />
                    <span>Create Expenses</span>
                  </Link>
                  <Link
                    to="/CreateGroup"
                    className="bg-white flex gap-2 items-center text-black px-4 py-2 mt-1 rounded w-[350px]"
                  >
                    <TiGroup className="text-2xl" />
                    <span>Create Group</span>
                  </Link>
                </div>
              </div>
              <div className="flex pl-16 items-center">
                <button
                  onClick={() => setActiveSection("subscriptions")}
                  className={`block  text-left px-4 py-2 ${
                    activeSection === "subscriptions"
                      ? "text-[#262626] underline"
                      : " text-[#8D8D8D]"
                  }`}
                >
                  Subscription List
                </button>
                <button
                  onClick={() => setActiveSection("groups")}
                  className={`block  text-left px-4 py-2  ${
                    activeSection === "groups"
                      ? "text-[#262626] underline"
                      : " text-[#8D8D8D]"
                  }`}
                >
                  Group Expenses
                </button>
              </div>
              <div className="pl-20">
                {loading ? (
                  <p className="mt-5">Loading...</p>
                ) : activeSection === "subscriptions" ? (
                  <SubscriptionTable
                    subscriptionDetails={subscriptionDetails}
                  />
                ) : (
                  <GroupExpensesTable groupExpenses={groupExpenses} />
                )}
              </div>
            </>
          ) : (
            <p className="mt-5 text-center">
              Please connect your wallet to view details.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Dashboard;
