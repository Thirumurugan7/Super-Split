import { FaArrowRight } from "react-icons/fa6";
import bgaura from "./bgaura.svg";
import footer from "./footer.svg";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { GoogleLogin } from "@react-oauth/google";
import { useOkto } from "okto-sdk-react";
import { createContext, useContext } from 'react';


const OKTO_CLIENT_API_KEY = "ac9502db-13f0-4074-8ae0-6dc10ad2d0c5";


function Home({ setAuthToken, authToken, handleLogout }:any) {

  const { authenticate } = useOkto() ?? {};



  const onLogoutClick = () => {
    handleLogout();
    // navigate('/');
  };

  return (
    <div className="bg-[#E8E8E8] min-h-screen">
    {/* Header */}
    <Navbar handleLogout={handleLogout} authToken={authToken} setAuthToken={setAuthToken} />
    {/* Hero Section */}
    <div className="flex">
      <img src="/card1.svg" alt="KintoHub Logo" className="-mt-40" />
      <div className="max-w-5xl mx-auto ">
        <div
          style={{
            backgroundImage: `url(${bgaura})`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundPositionX: "50%",
            height: "90vh",
            backgroundRepeat: "no-repeat",
          }}
          className="text-center flex flex-col gap-5 pt-48 "
        >
          <img
            src="/logoxl.svg"
            className="w-20 block -rotate-6 mx-auto h-20"
            alt="KintoHub Logo"
          />
          <p className="font-dmsans italic font-semibold text-6xl">
            Simplify Multi-Chain Subscriptions and Group Payments
          </p>
          <p className="font-albertsans px-32 font-medium text-lg">
            Manage group expenses and multi-chain subscriptions seamlessly

          </p>
          <div className="flex gap-5 justify-center">
            <Link to="/Dashboard">
              <p className="bg-black px-4 py-2 rounded-lg flex gap-2 items-center text-white">
                Get Started
                <FaArrowRight />
              </p>
            </Link>
            <p className="border-black border text-black px-4 py-2 rounded-lg ">
              Learn More
            </p>
          </div>
        </div>
      </div>
      <img src="/card2.svg" alt="KintoHub Logo" className="mt-48" />
    </div>

    {/* Context */}
    <div className="font-dmsans font-semibold text-center italic text-3xl">
      No more hassle with cross-chain <br /> subscriptions — FlexFuse brings
      everything <br /> together in one place!
    </div>

    <div className="text-center font-dmsans mt-20">
      <p id="services" className="text-4xl font-semibold">
        Why Choose FlexFuse?
      </p>
      <p className="mt-3">
        Explore the powerful features that make FlexFuse the ultimate platform
        for <br /> decentralized expense and subscription management.
      </p>
    </div>
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center gap-5 pb-4 pt-10">
        <div className="flex items-center text-white w-full font-dmsans pl-10 rounded-lg bg-[#262626]">
          <div>
            <p className="font-medium text-3xl">
              Effortless Token <br /> Conversion
            </p>
            <p className="mt-4">
              Quickly swap between crypto tokens, <br /> allowing for easy
              cross-chain
              <br />
              interactions.
            </p>
          </div>
          <img
            src="/multicoin.svg"
            className="w-80 h-80 rounded-lg"
            alt="KintoHub Logo"
          />
        </div>
        <img
          src="/tokenswap.svg"
          className="w-[368px] h-80 rounded-lg"
          alt="KintoHub Logo"
        />
      </div>
      <div className="flex gap-4 w-full justify-center">
        <div className="flex flex-col items-center py-7 px-10 text-white font-dmsans  rounded-xl gap-4 bg-[#262626]">
          <img
            src="/expensetracker.svg"
            className="w-80 h-80 rounded-t-lg"
            alt="KintoHub Logo"
          />
          <div>
            <p className="font-medium text-3xl">
              Real-Time Expense <br /> Tracking{" "}
            </p>
            <p className="mt-4">
              Monitor spending with real-time budget <br /> alerts and
              insights for better financial <br /> control.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center py-7 px-10 text-white font-dmsans  rounded-xl gap-4 bg-[#262626]">
          <img
            src="/crosschain.svg"
            className="w-80 h-80 rounded-t-lg"
            alt="KintoHub Logo"
          />
          <div>
            <p className="font-medium text-3xl">
              Seamless Cross-Chain <br /> Transfers{" "}
            </p>
            <p className="mt-4">
              Transfer assets across blockchains <br /> effortlessly, bridging
              gaps between different <br /> crypto ecosystems.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center py-7 px-10 text-white font-dmsans  rounded-xl gap-4 bg-[#262626]">
          <img
            src="/invoicetracker.svg"
            className="w-80 h-80 rounded-t-lg"
            alt="KintoHub Logo"
          />
          <div>
            <p className="font-medium text-3xl">
              Simplified Invoice <br /> Tracking{" "}
            </p>
            <p className="mt-4">
              Easily manage and track invoices with <br /> automated payment
              reminders and status <br /> updates.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-5 py-3">
        <img
          src="/network.svg"
          className="w-[568px] h-80 rounded-lg"
          alt="KintoHub Logo"
        />
        <div className="flex  justify-between w-full items-center text-white font-dmsans pl-10 rounded-lg bg-[#262626]">
          <div>
            <p className="font-medium text-3xl">
              Instant Crypto <br /> Trading
            </p>
            <p className="mt-4">
              Enable seamless trading between <br /> various cryptocurrencies
              with a <br />
              user-friendly interface.
            </p>
          </div>
          <img
            src="/cryptoexchange.svg"
            className="w-80 h-80 rounded-lg"
            alt="KintoHub Logo"
          />
        </div>
      </div>
      <div className="text-center font-dmsans mt-20">
        <p className="text-4xl font-semibold">How It Works?</p>
        <p className="mt-3">
          Explore the powerful features that make FlexFuse the ultimate
          platform for <br /> decentralized expense and subscription
          management.
        </p>
      </div>
    </div>
    <div className="max-w-[820px] mt-10 mb-32 mx-auto">
      <div className="flex gap-2 pb-5  mt-10  justify-center">
        <div className="bg-[#262626] w-1/2 px-5 pt-5 rounded-lg text-white">
          <p className="text-xl ">
            Create or Connect <br /> Your Wallet
          </p>
          <p className="text-[16px] opacity-[70%]">
            Easily set up a secure wallet or connect an <br /> existing one
            using Kinto’s Wallet SDK.
          </p>
          <div className="flex justify-end -mt-14 -mb-3">
            <p className="font-playfair text-[160px] font-bold italic leading-none">
              1
            </p>
          </div>
        </div>
        '
        <div className="bg-[#262626] w-1/2 px-5 pt-5 rounded-lg text-white">
          <p className="text-xl ">
            Verify Your <br /> Identity
          </p>
          <p className="text-[16px] opacity-[70%]">
            Complete a quick, secure KYC verification to <br /> ensure a
            trusted environment for all users.
          </p>
          <div className="flex justify-end -mt-14 -mb-3">
            <p className="font-playfair text-[160px] font-bold italic leading-none">
              2
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 pb-5   mt-5  justify-center">
        <div className="bg-[#262626] w-1/2 px-5 pt-5 rounded-lg text-white">
          <p className="text-xl ">
            Settle Payments <br /> Easily
          </p>
          <p className="text-[16px] opacity-[70%]">
            Pay and receive funds in your preferred tokens <br /> and chains
            for ultimate flexibility.
          </p>
          <div className="flex justify-end -mt-14 pb-2">
            <p className="font-playfair text-[160px] font-bold italic leading-none">
              3
            </p>
          </div>
        </div>
        '
        <div className="bg-[#262626] w-1/2 px-5 pt-5 rounded-lg text-white">
          <p className="text-xl ">
            Manage Expenses <br /> and Subscriptions{" "}
          </p>
          <p className="text-[16px] opacity-[70%]">
            Effortlessly split bills or subscribe to services <br /> across
            different blockchains with ease.
          </p>
          <div className="flex justify-end -mt-14 ">
            <p className="font-playfair text-[160px] font-bold italic leading-none">
              4
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      className="mt-5 mb-16"
      style={{
        backgroundImage: `url(${footer})`,
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundPositionY: "50%",
        width: "100%",
        height: "60vh",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "12px",
        alignItems: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "3.0rem", lineHeight: 1, margin: "10px 0" }}>
        Ready to Simplify Your <br /> Decentralized Finance?
      </p>
      <p className="text-base opacity-[60%]">
        Unlock the full potential of multi-chain transactions <br /> with
        FlexFuse seamless expense and subscription <br /> management.
      </p>
      <Link to="/Dashboard">
        <p
          className="bg-white px-4 py-2 mt-6 rounded-lg flex gap-2 items-center text-black"
          style={{
            cursor: "pointer",
            display: "inline-flex",
            margin: "10px 0",
          }}
        >
          Get Started
          <FaArrowRight />
        </p>
      </Link>
    </div>
    <div className="flex font-albertsans mb-12 justify-between px-20">
      <div>
        <div className="flex gap-3 items-center">
          <img src="/logo.svg" alt="KintoHub Logo" />
          <span className=" font-semibold text-2xl">FlexFuse</span>
        </div>
        <p className="mt-3">
          Effortless multi-chain expense and <br /> subscription management.
        </p>
      </div>

      <div>
        <p className="font-medium text-lg">Quick Links</p>
        <p className=" underline">Home</p>
        <p className=" underline">Services</p>
        <p className=" underline">About Us</p>
        <p className=" underline">Contact</p>
      </div>
    </div>
    <Footer />
  </div>
  );
}

export default Home;
