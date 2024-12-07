import { useState } from "react";
import Navbar from "./Navbar";
import { encodeFunctionData, defineChain } from "viem";
import FlexfuseAbi from "../../public/abis/flexfuse.json";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import {
  FLARE_CONTRACT_ADDRESS_SENDER,
  HEDERA_CONTRACT_ADDRESS_SENDER,
  POLYGON_CONTRACT_ADDRESS,
  SEPOLIA_CONTRACT_ADDRESS_SENDER,
  tokenDefaultAddress,
} from "../constants";
import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import axios from "axios";
const contractadddress = "0x6f0029F082e03ee480684aC5Ef7fF019813ac1C2";

function CreateSubscription({ setAuthToken, authToken, handleLogout }:any) {
  const router = useNavigate();
  const network = useSelector((state: any) => state?.network?.network);
  const ethcontractaddress =
    network === "base"
      ? SEPOLIA_CONTRACT_ADDRESS_SENDER
      : network === "pol"
      ? POLYGON_CONTRACT_ADDRESS
      : FLARE_CONTRACT_ADDRESS_SENDER;

  async function createSubscription({
    name,
    description,
    baseAmount,
    token,
  }: {
    name: string;
    description: string;
    baseAmount: number;
    token: string;
  }): Promise<void> {
    const data = encodeFunctionData({
      abi: FlexfuseAbi,
      functionName: "createSubscription",
      args: [name, description, baseAmount, token],
    });

    try {

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

const baseAddress = networks.find((network:{ network_name: String; address: String }) => network.network_name === 'POLYGON_TESTNET_AMOY').address;

console.log("address",baseAddress)
      const options = {
        method: 'POST',
        url: 'https://sandbox-api.okto.tech/api/v1/rawtransaction/execute',
        headers: {Authorization: `Bearer ${authy}`, 'Content-Type': 'application/json'},
        data: {
          network_name: 'POLYGON_TESTNET_AMOY',
          transaction: {
            from: baseAddress,
            to: POLYGON_CONTRACT_ADDRESS,
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
      // const response = await kintoSDK.sendTransaction([
      //   { to: contractadddress, data, value: BigInt(0) },
      // ]);
      // console.log("Subscription created:", response);
      // router("/Subscriptions");
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  const [response, setResponse] = useState("");
  const [fields, setFields] = useState({
    name: "",
    description: "",
    baseAmount: "",
  });
  const defaultToken =
    network === "kinto"
      ? tokenDefaultAddress.kinto
      : tokenDefaultAddress.sepolia;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleCreateSubscription = async () => {
    try {
      const args = {
        ...fields,
        baseAmount: Number(fields.baseAmount),
        token: defaultToken,
      };

      console.log("Subscription Args:", args);

      await createSubscription(args);
      setResponse("Subscription created successfully!");
    } catch (error) {
      console.error("Error creating subscription:", error);
      setResponse(`Error: ${error}`);
    }
  };

  const createSubscriptionEth = async ({
    name,
    description,
    baseAmount,
    token,
  }: {
    name: string;
    description: string;
    baseAmount: number;
    token: string;
  }) => {
    try {
      // const response =
      //   network === "flare"
      //     ? await CREATESUBSCRIPTIONFLARE(
      //         ethcontractaddress,
      //         name,
      //         description,
      //         baseAmount
      //       )
      //     : await CREATESUBSCRIPTION(
      //         ethcontractaddress,
      //         name,
      //         description,
      //         baseAmount,
      //         token
      //       );
      // console.log("Subscription created:", response);
      // toast.success(
      //   `Subscription created successfully check the tx hash https://explorer.kinto.xyz/tx/${response}`
      // );
      // router("/Subscriptions");
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  };
  const handleCreateSubscriptionEth = async () => {
    try {
      const args = {
        ...fields,
        baseAmount: Number(fields.baseAmount),
        token: defaultToken,
      };

      console.log("Subscription Args:", args);

      await createSubscription(args);
      setResponse("Subscription created successfully!");
    } catch (error) {
      console.error("Error creating subscription:", error);
      setResponse(`Error: ${error}`);
    }
  };

  const handleCreateSubscriptionMulti = async () => {
    if (network === "kinto") {
      handleCreateSubscription();
    } else {
      handleCreateSubscriptionEth();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar handleLogout={handleLogout} authToken={authToken} setAuthToken={setAuthToken}   />
      <div className="flex  justify-between pl-20">
        <Link
          to="/Dashboard"
          className="flex gap-2 items-center text-black font-dmsans text-lg"
        >
          <FaAngleLeft />
          <span> Back</span>
        </Link>
        <div className="text-center -ml-20 mt-5">
          <p className="font-playfair italic font-bold text-3xl mt-5">
            Create a New Subscription
          </p>
          <p className="font-dmsans pt-3 text-lg">
            Fill in the details to create a new subscription.{" "}
          </p>
        </div>
        <div></div>
      </div>
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white p-6  shadow rounded-md mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={fields.name}
                onChange={handleInputChange}
                placeholder="Enter subscription name"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={fields.description}
                onChange={handleInputChange}
                placeholder="Enter subscription description"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Base Amount{" "}
                {network === "kinto" || network === "flare"
                  ? "(ETH)"
                  : "(USDC)"}
              </label>
              <input
                type="number"
                name="baseAmount"
                value={fields.baseAmount}
                onChange={handleInputChange}
                placeholder="Enter base amount"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {network !== "flare" && (
              <div>
                <label className="block text-sm font-medium mb-2">Token</label>
                <input
                  type="text"
                  value={defaultToken}
                  disabled
                  className="w-full p-2 border rounded bg-gray-200 text-gray-600"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleCreateSubscriptionMulti}
            className="bg-green-500 text-white py-3 px-6 rounded shadow-md hover:bg-green-600"
          >
            Create Subscription
          </button>
        </div>

        {/* Response Display */}
        <div className="mt-6 bg-white p-4 shadow-md rounded">
          <h3 className="text-lg font-semibold mb-2">Response:</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
            {response}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default CreateSubscription;
