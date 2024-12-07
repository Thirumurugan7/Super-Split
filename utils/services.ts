import {
  encodeFunctionData,
  Address,
  getContract,
  defineChain,
  createPublicClient,
  http,
} from "viem";
import FlexfuseAbi from "../public/abis/flexfuse.json";
import { createKintoSDK } from "kinto-web-sdk";

const kintoSDK = createKintoSDK("0x6f0029F082e03ee480684aC5Ef7fF019813ac1C2");

const contractadddress = "0x6f0029F082e03ee480684aC5Ef7fF019813ac1C2";
export const kinto = defineChain({
  id: 7887,
  name: "Kinto",
  network: "kinto",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.kinto-rpc.com/"],
      webSocket: ["wss://rpc.kinto.xyz/ws"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://kintoscan.io" },
  },
});

export async function fetchSubscriptionDetails(subscriptionId: string) {
  const client = createPublicClient({
    chain: kinto,
    transport: http(),
  });

  const contract = getContract({
    address: contractadddress as Address,
    abi: FlexfuseAbi,
    client: { public: client },
  });

  try {
    const details = await contract.read.getSubscriptionDetails([
      subscriptionId,
    ]);
    console.log("Subscription Details:", details);
    return details;
  } catch (error) {
    console.error("Error fetching subscription details:", error);
  }
}

interface CreateSubscriptionArgs {
  subscriptionId: string;
  serviceProvider: string;
  amount: number;
  token: string;
  startTime: number;
  interval: number;
}

export async function createSubscription({
  subscriptionId,
  serviceProvider,
  amount,
  token,
  startTime,
  interval,
}: CreateSubscriptionArgs): Promise<void> {
  const data = encodeFunctionData({
    abi: FlexfuseAbi,
    functionName: "createSubscription",
    args: [subscriptionId, serviceProvider, amount, token, startTime, interval],
  });

  try {
    const response = await kintoSDK.sendTransaction([
      { to: contractadddress, data, value: BigInt(0) },
    ]);
    console.log("Subscription created:", response);
  } catch (error) {
    console.error("Error creating subscription:", error);
  }
}

interface SendPaymentArgs {
  receiver: string;
  amount: number;
  token: string;
}

export async function sendPayment({
  receiver,
  amount,
  token,
}: SendPaymentArgs): Promise<void> {
  const data = encodeFunctionData({
    abi: FlexfuseAbi,
    functionName: "sendPayment",
    args: [receiver, amount, token],
  });

  try {
    const response = await kintoSDK.sendTransaction([
      { to: contractadddress, data, value: BigInt(0) },
    ]);
    console.log("Payment sent:", response);
  } catch (error) {
    console.error("Error sending payment:", error);
  }
}

interface FetchTransactionHistoryArgs {
  userAddress: string;
}

export async function fetchTransactionHistory({
  userAddress,
}: FetchTransactionHistoryArgs) {
  const client = createPublicClient({
    chain: kinto,
    transport: http(),
  });

  const contract = getContract({
    address: contractadddress as Address,
    abi: FlexfuseAbi,
    client: { public: client },
  });

  try {
    const transactions = await contract.read.getTransactionHistory([
      userAddress,
    ]);
    console.log("Transaction History:", transactions);
    return transactions;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
  }
}

interface CreateGroupArgs {
  groupId: string;
  members: string[];
}

export async function createGroup({
  groupId,
  members,
}: CreateGroupArgs): Promise<void> {
  const data = encodeFunctionData({
    abi: FlexfuseAbi,
    functionName: "createGroup",
    args: [groupId, members],
  });

  try {
    const response = await kintoSDK.sendTransaction([
      { to: contractadddress, data, value: BigInt(0) },
    ]);
    console.log("Group created:", response);
  } catch (error) {
    console.error("Error creating group:", error);
  }
}

interface AddPaymentToGroupArgs {
  groupId: string;
  amount: number;
  token: string;
}

export async function addPaymentToGroup({
  groupId,
  amount,
  token,
}: AddPaymentToGroupArgs): Promise<void> {
  const data = encodeFunctionData({
    abi: FlexfuseAbi,
    functionName: "addPayment",
    args: [groupId, amount, token],
  });

  try {
    const response = await kintoSDK.sendTransaction([
      { to: contractadddress, data, value: BigInt(0) },
    ]);
    console.log("Payment added to group:", response);
  } catch (error) {
    console.error("Error adding payment to group:", error);
  }
}

interface WithdrawPaymentFromGroupArgs {
  groupId: string;
  amount: number;
  token: string;
}

export async function withdrawPaymentFromGroup({
  groupId,
  amount,
  token,
}: WithdrawPaymentFromGroupArgs): Promise<void> {
  const data = encodeFunctionData({
    abi: FlexfuseAbi,
    functionName: "withdrawPayment",
    args: [groupId, amount, token],
  });

  try {
    const response = await kintoSDK.sendTransaction([
      { to: contractadddress, data, value: BigInt(0) },
    ]);
    console.log("Payment withdrawn from group:", response);
  } catch (error) {
    console.error("Error withdrawing payment from group:", error);
  }
}

interface UpdateSubscriptionArgs {
  subscriptionId: string;
  newAmount: number;
  newInterval: number;
}

export async function updateSubscription({
  subscriptionId,
  newAmount,
  newInterval,
}: UpdateSubscriptionArgs): Promise<void> {
  const data = encodeFunctionData({
    abi: FlexfuseAbi,
    functionName: "updateSubscription",
    args: [subscriptionId, newAmount, newInterval],
  });

  try {
    const response = await kintoSDK.sendTransaction([
      { to: contractadddress, data, value: BigInt(0) },
    ]);
    console.log("Subscription updated:", response);
  } catch (error) {
    console.error("Error updating subscription:", error);
  }
}

interface RemoveMemberArgs {
  groupId: string;
  member: string;
}

export async function removeMember({
  groupId,
  member,
}: RemoveMemberArgs): Promise<void> {
  const data = encodeFunctionData({
    abi: FlexfuseAbi,
    functionName: "removeMember",
    args: [groupId, member],
  });

  try {
    const response = await kintoSDK.sendTransaction([
      { to: contractadddress, data, value: BigInt(0) },
    ]);
    console.log("Member removed:", response);
  } catch (error) {
    console.error("Error removing member:", error);
  }
}

interface DeactivateGroupArgs {
  groupId: string;
}

export async function deactivateGroup({
  groupId,
}: DeactivateGroupArgs): Promise<void> {
  const data = encodeFunctionData({
    abi: FlexfuseAbi,
    functionName: "deactivateGroup",
    args: [groupId],
  });

  try {
    const response = await kintoSDK.sendTransaction([
      { to: contractadddress, data, value: BigInt(0) },
    ]);
    console.log("Group deactivated:", response);
  } catch (error) {
    console.error("Error deactivating group:", error);
  }
}

interface ReleasePaymentArgs {
  subscriptionId: string;
  groupId: string;
}

export async function releasePayment({
  subscriptionId,
  groupId,
}: ReleasePaymentArgs): Promise<void> {
  const data = encodeFunctionData({
    abi: FlexfuseAbi,
    functionName: "releasePayment",
    args: [subscriptionId, groupId],
  });

  try {
    const response = await kintoSDK.sendTransaction([
      { to: contractadddress, data, value: BigInt(0) },
    ]);
    console.log("Payment released:", response);
  } catch (error) {
    console.error("Error releasing payment:", error);
  }
}

interface CheckSubscriptionDueArgs {
  subscriptionId: string;
}

export async function checkSubscriptionDue({
  subscriptionId,
}: CheckSubscriptionDueArgs): Promise<boolean | undefined> {
  const client = createPublicClient({
    chain: kinto,
    transport: http(),
  });

  const contract = getContract({
    address: contractadddress as Address,
    abi: FlexfuseAbi,
    client: { public: client },
  });

  try {
    const isDue = await contract.read.checkSubscriptionDue([subscriptionId]);
    console.log("Subscription due:", isDue);
    return isDue as boolean;
  } catch (error) {
    console.error("Error checking subscription due:", error);
  }
}

interface GetGroupMembersArgs {
  groupId: string;
}

export async function getGroupMembers({ groupId }: GetGroupMembersArgs) {
  const client = createPublicClient({
    chain: kinto,
    transport: http(),
  });

  const contract = getContract({
    address: contractadddress as Address,
    abi: FlexfuseAbi,
    client: { public: client },
  });

  try {
    const members = await contract.read.getGroupMembers([groupId]);
    console.log("Group members:", members);
    return members;
  } catch (error) {
    console.error("Error fetching group members:", error);
  }
}

interface GetGroupPaymentsArgs {
  groupId: string;
  member: string;
}

export async function getGroupPayments({
  groupId,
  member,
}: GetGroupPaymentsArgs) {
  const client = createPublicClient({
    chain: kinto,
    transport: http(),
  });

  const contract = getContract({
    address: contractadddress as Address,
    abi: FlexfuseAbi,
    client: { public: client },
  });

  try {
    const payments = await contract.read.getGroupPayments([groupId, member]);
    console.log("Group payments:", payments);
    return payments;
  } catch (error) {
    console.error("Error fetching group payments:", error);
  }
}

export async function getGroupDetails(groupId: string) {
  const client = createPublicClient({
    chain: kinto,
    transport: http(),
  });

  const contract = getContract({
    address: contractadddress as Address,
    abi: FlexfuseAbi,
    client: { public: client },
  });

  try {
    const details = await contract.read.getGroupDetails([groupId]);
    console.log("Group details:", details);
    return details;
  } catch (error) {
    console.error("Error fetching group details:", error);
  }
}
