import Web3 from "web3";
import contractABI from "../contracts/main.json";
import profileContractABI from "../contracts/user.json";
import { useState } from "react";

const contractAddress = "0xbcec7906b4e7b8Bc3C3072f99A2eaF10E5757C34";
const profileContractAddress = "0x5408024F42239cbcA6beca646A25F5c7c25B9D86";

const Connect = ({
  web3,
  account,
  shortAddress,
  setContract,
  setAccount,
  setProfileContract,
  setWeb3,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        setError("");

        // Request account access
        await window.ethereum.enable();

        // Check the current network
        const networkId = await window.ethereum.request({
          method: "net_version",
        });

        // Switch to Sepolia if not already connected
        if (networkId !== "11155111") {
          await switchToSepolia();
        }

        // Initialize Web3 and contracts
        const tempWeb3 = new Web3(window.ethereum);
        setWeb3(tempWeb3);

        const contractInstance = new tempWeb3.eth.Contract(
          contractABI,
          contractAddress
        );
        setContract(contractInstance);

        const profileContractInstance = new tempWeb3.eth.Contract(
          profileContractABI,
          profileContractAddress
        );
        setProfileContract(profileContractInstance);

        // Get the user's account
        const accounts = await tempWeb3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        setError("Failed to connect wallet. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("No web3 provider detected. Please install MetaMask.");
      console.error("No web3 provider detected");
    }
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setAccount(null); // Clear the account
    setWeb3(null); // Reset Web3 instance
    setContract(null); // Reset contract instance
    setProfileContract(null); // Reset profile contract instance
  };

  // Function to switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Chain ID for Sepolia
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.sepolia.org"],
              },
            ],
          });
        } catch (addError) {
          setError(
            "Failed to add Sepolia network to MetaMask. Please add it manually."
          );
          console.error("Failed to add Sepolia network to MetaMask", addError);
        }
      } else {
        setError(
          "Failed to switch to Sepolia network. Please switch manually."
        );
        console.error("Failed to switch to Sepolia network", switchError);
      }
    }
  };

  return (
    <>
      <div className="connect">
        {!account ? (
          <button
            id="connectWalletBtn"
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <>
            <div id="userAddress">Connected: {shortAddress(account)}</div>
            <button id="disconnectWalletBtn" onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
          </>
        )}
      </div>
      <div id="connectMessage">
        {!account ? "Please connect your wallet to tweet." : ""}
      </div>
      {error && (
        <div id="errorMessage" style={{ color: "red" }}>
          {error}
        </div>
      )}
    </>
  );
};

export default Connect;
