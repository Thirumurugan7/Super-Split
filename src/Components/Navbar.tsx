import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Address,
  getContract,
  createPublicClient,
  http,
  defineChain,
} from "viem";
import contractsJSON from "../../public/abis/7887.json";
import { MdVerified } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setNetwork, setWalletAddress } from "../../store/store";
import { Link } from "react-router-dom";
import { GoogleLogin, CredentialResponse, GoogleCredentialResponse } from "@react-oauth/google";
import { useOkto } from "okto-sdk-react";
import { createContext, useContext } from 'react';
import axios from "axios"

const OKTO_CLIENT_API_KEY = "ac9502db-13f0-4074-8ae0-6dc10ad2d0c5";

interface NavbarProps {
  handleLogout: () => void;
  authToken: string;
  setAuthToken: (token: string) => void;
}

function Navbar({handleLogout, authToken, setAuthToken}:NavbarProps) {
  const dispatch = useDispatch();
  const network = useSelector((state: any) => state?.network?.network);

  const [loading, setLoading] = useState(false);

  const [accountInfo, setAccountInfo] = useState<any | undefined>(
    undefined
  );


  // const {authenticate} = useOkto();





  const [selectedChain, setSelectedChain] = useState("Base");

  const handleChainChange = (event : any) => {
    dispatch(setNetwork(event.target.value));
    setSelectedChain(event.target.value);
  };


  const { authenticate } = useOkto() ?? {};



  const onLogoutClick = () => {
    handleLogout();
    // navigate('/');
  };

  useEffect(()=>{
    if(network === "eth"){
      setSelectedChain("eth");
    } 
    else if (network === "hedera"){
      setSelectedChain("hedera");
    } 
    else if (network === "flare"){
      setSelectedChain("flare");
    } 
  },[]);


  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      console.error("No credential received");
      return;
    }

    const Auth = async (auth: string) => {
      try {
        const res = await axios.post("https://suzuka-okto-be.vercel.app/deploy-token", {
          token: idToken,
          auth: auth,
        });
        console.log("res", res);
      } catch (error) {
        console.error("Error in Auth:", error);
      }
    };

  //   oktoDB?.authenticate?.(idToken, async (authResponse: any | null, error: Error | null) => {
  //     // if (authResponse) {
  //     //   console.log("authResponse", authResponse);
  //     //   setAuthToken(authResponse.auth_token);
  //     // }
  //     // if (error) {
  //     //   console.error("Authentication error:", error);
  //     // }
  //   }
  
  // );


  if(authenticate){
    authenticate(idToken, async (authResponse, error) => {
      console.log('====================================');
      console.log("Authresponse", authResponse);
      console.log('====================================');
      if (authResponse) {
        console.log("authResponse",authResponse);
        console.log("authResponse.auth_token",authResponse.auth_token);
        
        setAuthToken(authResponse.auth_token);

        // Auth(authResponse.auth_token);


        // navigate("/gf");
      }
      if (error) {
        console.error("Authentication error:", error);
      }
    });

  }
  };

  return (
    <div className="flex justify-between py-4 pt-8 px-32 font-albertsans ">
      <Link className="flex gap-3 items-center" to="/">
        <img src="/logo.svg" alt="KintoHub Logo" />
        <span className=" font-semibold text-2xl">FlexFuse</span>
      </Link>
      <div className="flex gap-8 items-center">
        <span>
          <Link to="/">Home</Link>
        </span>
        <span>
          <a
            href="/#services"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("services")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Services
          </a>{" "}
        </span>
        <span>
          <Link to="/Subscriptions">Subscriptions</Link>
        </span>
        <div>
          <select
          id="chain-selector"
          value={selectedChain}
          onChange={handleChainChange}
          className="border rounded-md px-4 py-2 text-gray-700 focus:outline-none"
        >
          <option value="base">Base</option>
          <option value="pol">Polygon</option>
          <option value="supra">Supra</option>
          <option value="starknet">Starknet</option>
        </select>
        </div>

        {network === "base" || network === "hedepolra" || network === "supra" ? 
   <>
   <div className="hidden md:block">
              {!authToken ? (
                <div className="z-50">
                   <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log("Login Failed")}
                useOneTap
                type="standard"
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="100%"
                // className="!bg-transparent !shadow-none"
              />
                   
                </div>
              ) : (
                <button 
                  onClick={onLogoutClick}
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                  Logout
                </button>
              )}
            </div>
</>
        :
          <div>
          
          
          </div>
        }
      </div>
    </div>
  );
}

export default Navbar;
