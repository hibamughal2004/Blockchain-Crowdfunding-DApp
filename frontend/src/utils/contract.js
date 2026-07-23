// ethers library
import { ethers } from "ethers";

// Contract ABI
import Crowdfunding from "../abi/Crowdfunding.json";

// Contract Address
const CONTRACT_ADDRESS =
"0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Contract return karega
export async function getContract() {

    // MetaMask provider
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Connected account
    const signer = await provider.getSigner();

    // Contract object
    const contract = new ethers.Contract(

        CONTRACT_ADDRESS,

        Crowdfunding.abi,

        signer

    );

    return contract;

}