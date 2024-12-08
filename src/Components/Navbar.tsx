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
import { setNetwork, setWalletAddress , setAuth} from "../../store/store";
import { Link } from "react-router-dom";
import { GoogleLogin, CredentialResponse, GoogleCredentialResponse } from "@react-oauth/google";
import { useOkto } from "okto-sdk-react";
import { createContext, useContext } from 'react';
import {  useNavigate } from "react-router-dom";
import { connect, disconnect , ConnectedStarknetWindowObject} from "@argent/get-starknet";

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
  const Navigate = useNavigate();
  const WW_URL = "https://web.argent.xyz";

  const [connection, setConnection] =  useState<ConnectedStarknetWindowObject | undefined>(undefined);
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





  if(authenticate){
    authenticate(idToken, async (authResponse, error) => {
      console.log('====================================');
      console.log("Authresponse", authResponse);
      console.log('====================================');
      if (authResponse) {
        console.log("authResponse",authResponse);
        console.log("authResponse.auth_token",authResponse.auth_token);
        dispatch(setAuth(authResponse.auth_token))

        localStorage.setItem("auth",authResponse.auth_token)

        setAuthToken(authResponse.auth_token);

       
        // Auth(authResponse.auth_token);
        Navigate("/Dashboard");

        // navigate("/gf");
      }
      if (error) {
        console.error("Authentication error:", error);
      }
    });

  }
  };

  const authy = localStorage.getItem("auth")

  console.log("auhty",authy);


  useEffect(() => {
    const connectToStarknet = async () => {
      const connection = await connect({
        modalMode: "neverAsk",
        webWalletUrl: WW_URL,
      });

      if (connection && connection.isConnected && connection.account) {
        setConnection(connection);

        dispatch(
          setAuth({
            provider: connection.account,
            address: connection.account.address,
          })
        );
      }
    };
    connectToStarknet();
  }, []);

  

  return (
    <div className="flex justify-between py-4 pt-8 px-32 font-albertsans ">
      <Link className="flex gap-3 items-center" to="/">
        <img src="/logo.svg" alt="KintoHub Logo" />
        <span className=" font-semibold text-2xl">Super Split</span>
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

        {network === "base" || network === "pol" || network === "supra" ? 
   <>
   <div className="hidden md:block">
              {authy === "null" || authy === undefined || authy === null ? (
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
            <div>
              {!connection ? (
                <>
                  <button
                    onClick={async () => {
                      const connection = await connect({
                        webWalletUrl: WW_URL,
                      });

                      if (connection && connection.isConnected) {
                        setConnection(connection);
                      }
                    }}
                  >
                    Connect wallet
                  </button>
                </>
              ) : (
                <>
                  <div className="flex">
                    {/* <WalletDetails wallet={connection} /> */}
                    <button
                      onClick={async () => {
                        await disconnect();
                        setConnection(undefined);
                      }}
                    >
                      Disconnect wallet
                    </button>
                  </div>
                </>
              )}
            </div>
          
          </div>
        }
      </div>
    </div>
  );
}

export default Navbar;
