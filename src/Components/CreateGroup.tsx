import { useState } from "react";
import Navbar from "./Navbar";
import { encodeFunctionData, defineChain } from "viem";
import FlexfuseAbi from "../../public/abis/flexfuse.json";
import { createKintoSDK } from "kinto-web-sdk";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus, FaTimes } from "react-icons/fa";
import { BASE_CONTRACT, POLYGON_CONTRACT_ADDRESS, SEPOLIA_CONTRACT_ADDRESS_SENDER } from "../constants";
import { useSelector } from "react-redux";
import axios from "axios";
const contractAddress = "0x6f0029F082e03ee480684aC5Ef7fF019813ac1C2";
const ethcontractaddress = POLYGON_CONTRACT_ADDRESS;

function CreateGroup({ setAuthToken, authToken, handleLogout }:any) {
  const network = useSelector((state: any) => state?.network?.network);
  const router = useNavigate();

  const ethcontractaddress =
  network === "base"
    ? BASE_CONTRACT
    : network === "pol"
    ? POLYGON_CONTRACT_ADDRESS
    : POLYGON_CONTRACT_ADDRESS;
  async function creategroup({
    name,
    members,
  }: {
    name: string;
    members: string[];
  }): Promise<void> {
    const data = encodeFunctionData({
      abi: FlexfuseAbi,
      functionName: "createGroup",
      args: [name, members],
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

const networkName = network === "base" ? "BASE" : network === "pol" ? "POLYGON_TESTNET_AMOY" : "APTOS"


const baseAddress = networks.find((network:{ network_name: String; address: String }) => network.network_name === networkName).address;

console.log("address",baseAddress)
    
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

try {
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}

      router("/Dashboard");
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  }
  


  const [response, setResponse] = useState("");
  const [fields, setFields] = useState({
    name: "",
    members: "",
  });

  const [membersList, setMembersList] = useState<string[]>([]);
  console.log("Members List:", membersList);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const addMember = () => {
    const trimmedAddress = fields.members.trim();
    if (trimmedAddress && !membersList.includes(trimmedAddress)) {
      setMembersList([...membersList, trimmedAddress]);
      setFields({ ...fields, members: "" });
    }
  };

  const removeMember = (address: string) => {
    setMembersList(membersList.filter((member) => member !== address));
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addMember();
    }
  };

  const handleCreateGroup = async () => {
    try {
      const args = {
        name: fields.name,
        members: membersList,
      };

      console.log("Group Args:", args);

        await creategroup(args);
  
      setResponse("Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      setResponse(`Error: ${error}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout}  />

      {/* Header Section */}
      <div className="flex justify-between pl-20">
        <Link
          to="/Dashboard"
          className="flex gap-2 items-center text-black font-dmsans text-lg"
        >
          <FaAngleLeft />
          <span>Back</span>
        </Link>
        <div className="text-center -ml-20 mt-5">
          <p className="font-playfair italic font-bold text-3xl mt-5">
            Create a New Group
          </p>
          <p className="font-dmsans pt-3 text-lg">
            Fill in the details to create a new group.
          </p>
        </div>
        <div></div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white p-6 shadow rounded-md mb-6">
          {/* Group Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={fields.name}
              onChange={handleInputChange}
              placeholder="Enter group name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Members Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Members</label>
            <div className="flex items-center">
              <input
                type="text"
                name="members"
                value={fields.members}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter member addresses"
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addMember}
                className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Added Members
            </label>
            <div className="flex flex-wrap gap-2">
              {membersList.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 px-2 py-1 rounded"
                >
                  <span className="text-sm">{member}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(member)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleCreateGroup}
            className="bg-green-500 text-white py-3 px-6 rounded shadow-md hover:bg-green-600"
          >
            Create Group
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

export default CreateGroup;
