import React, { useState } from "react";
import "./App.css";

// Bootstrap Components
import Container from "react-bootstrap/Container";

// Navbar Component
import NavbarComponent from "./components/NavbarComponent";

import CreateCampaign from "./components/CreateCampaign";

import CampaignList from "./components/CampaignList";

// Ethers Library
// import { ethers } from "ethers";

function App() {

    // Connected wallet address
    const [account, setAccount] = useState("");

    // ===========================================
    // Connect MetaMask Wallet
    // ===========================================

    async function connectWallet() {

        // Check MetaMask installed
        if (!window.ethereum) {

            alert("Please install MetaMask");

            return;

        }

        try {

            // Wallet connect request
            const accounts = await window.ethereum.request({

                method: "eth_requestAccounts",

            });

            // Save connected account
            setAccount(accounts[0]);

        }

        catch (error) {

            console.log(error);

        }

    }

    return (

        <>

            {/* Top Navbar */}

            <NavbarComponent

                account={account}

                connectWallet={connectWallet}

            />

            {/* Main Page */}

            <Container className="mt-5">

                <h1 className="text-center mb-4">

                  🚀 Blockchain Crowdfunding DApp</h1>

                <hr />

                {

                    account ?

                    (

                        <>

                            <h4>

                                Connected Wallet

                            </h4>

                            <p>

                              {

                                account.slice(0, 6) +

                                "..." +

                                account.slice(-4)

                              }

                            </p>

                            <CreateCampaign />
                            <CampaignList />

                        </>

                    )

                    :

                    (

                        <h4>

                            Please Connect MetaMask

                        </h4>

                    )

                }

            </Container>

        </>

    );

}

export default App;