import { useEffect, useState } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";

function CampaignList() {

    const [campaigns, setCampaigns] = useState([]);
    const [amounts, setAmounts] = useState({});
    const [loading, setLoading] = useState("");

    useEffect(() => {

        loadCampaigns();

    }, []);

    async function loadCampaigns() {

        try {

            const contract = await getContract();
            const provider = contract.runner.provider;

            const block = await provider.getBlock("latest");

            const blockchainTime = Number(block.timestamp);

            const total = await contract.getCampaignCount();

            let temp = [];

            for (let i = 1; i <= Number(total); i++) {

                const campaign = await contract.getCampaign(i);

                temp.push({
                    
                    id: campaign[0].toString(),

                    creator: campaign[1],

                    title: campaign[2],

                    description: campaign[3],

                    goal: Number(ethers.formatEther(campaign[4])),

                    raised: Number(ethers.formatEther(campaign[5])),
                    progress:
                        Math.min(
                            (Number(ethers.formatEther(campaign[5])) /
                                Number(ethers.formatEther(campaign[4]))) * 100,
                            100
                        ),

                    deadline: Number(campaign[6]),

                    expired: Number(campaign[6]) <= blockchainTime,

                    deadlineText: new Date(
                        Number(campaign[6]) * 1000
                    ).toLocaleString(),
                    blockchainTime: blockchainTime,

                    contractActive: campaign[7]

                });

            }

            setCampaigns(temp);

        }

        catch (err) {

            console.log(err);

        }

    }
    async function donate(campaignId) {

        try {
            setLoading(`donate-${campaignId}`);

            const contract = await getContract();

            const tx = await contract.donate(campaignId, {

                value: ethers.parseEther(amounts[campaignId])

            });

            await tx.wait();
            setLoading("");

            alert("Donation successful!");

            setAmounts({
                ...amounts,
                [campaignId]: ""
            });

            loadCampaigns();

        }

        catch(error) {
            setLoading("");

            console.log(error);

            alert("Donation failed");

        }

    }
    async function withdraw(campaignId) {

        try {
            setLoading(`withdraw-${campaignId}`);
 
            const contract = await getContract();

            const tx = await contract.withdrawFunds(campaignId);

            await tx.wait();
            setLoading("");

            alert("Funds withdrawn successfully!");

            loadCampaigns();

        }

        catch(error) {
            setLoading("");

            console.log(error);

            alert("Withdraw failed");

        }

    }

    async function claimRefund(campaignId) {

        try {
            setLoading(`refund-${campaignId}`);

            const contract = await getContract();

            const tx = await contract.claimRefund(
                campaignId
            );

            await tx.wait();
            setLoading("");

            alert("Refund successful");

            loadCampaigns();

        }

        catch(error) {
            setLoading("");

            console.log(error);

            alert("Refund failed");

        }

    }

    return (

        <>

            <h2 className="mt-5 mb-3">

                Campaigns

            </h2>

            {

                campaigns.length === 0 ?

                <p>No Campaign Found</p>

                :

                campaigns.map((campaign) => (

                    <Card
                        className="mb-3 shadow"
                        key={campaign.id}
                    >

                        <Card.Body>

                            <Card.Title className="text-center">

                                {campaign.title}

                            </Card.Title>

                            <Card.Text style={{ textAlign: "justify" }}>

                                {campaign.description}

                            </Card.Text>

                            <p>

                                <strong>Goal:</strong>{" "}
                                {campaign.goal} ETH

                            </p>
                            <p>

                                <strong>Creator:</strong>{" "}

                                {campaign.creator.slice(0, 6) +
                                    "..." +
                                    campaign.creator.slice(-4)}

                            </p>

                            <p>

                                <strong>Raised:</strong>{" "}
                                {campaign.raised} ETH

                            </p>
                            <p>

                                <strong>Progress:</strong>

                            </p>

                            <ProgressBar

                                now={campaign.progress}

                                label={`${campaign.progress.toFixed(0)}%`}

                                className="mb-3"

                            />

                            <p>

                                <strong>Deadline:</strong>{" "}
                                {campaign.deadlineText}

                            </p>
                            <p>

                                <strong>Deadline Timestamp:</strong>{" "}
                                {campaign.deadline}

                            </p>

                            <p>
                                <strong>Blockchain Time:</strong> {campaign.blockchainTime}
                            </p>

                            <p>
                                <strong>Expired:</strong> {campaign.expired.toString()}
                            </p>

                            <p>

                                <strong>Status:</strong>{" "}

                                {

                                    !campaign.expired ? (

                                        <Badge bg="success">

                                            Active

                                        </Badge>

                                    )

                                    :

                                    campaign.raised >= campaign.goal ? (

                                        <Badge bg="primary">

                                            Successful

                                        </Badge>

                                    )

                                    :

                                    (

                                        <Badge bg="danger">

                                            Failed

                                        </Badge>

                                    )

                                }

                            </p>

                           <input
                                type="text"
                                placeholder="Amount in ETH"
                                value={amounts[campaign.id] || ""}
                                onChange={(e) =>
                                    setAmounts({
                                        ...amounts,
                                        [campaign.id]: e.target.value
                                    })
                                }
                                className="form-control mb-2"
                            />

                            {

                            !campaign.expired && (

                            <>

                            <Button

                                variant="primary"
                                className="me-2 mt-2 rounded-pill"
                                disabled={loading === `donate-${campaign.id}`}

                                onClick={() => donate(campaign.id)}

                            >

                                {

                                    loading === `donate-${campaign.id}`

                                    ?

                                    "Donating..."

                                    :

                                    "Donate"

                                }

                            </Button>

                            </>

                            )

                            }

                            {

                            campaign.expired &&

                            campaign.raised >= campaign.goal && (

                            <Button

                                variant="success"

                                className="me-2 mt-2 rounded-pill"
                                disabled={loading === `withdraw-${campaign.id}`}

                                onClick={() => withdraw(campaign.id)}

                            >

                                {

                                    loading === `withdraw-${campaign.id}`

                                    ?

                                    "Withdrawing..."

                                    :

                                    "Withdraw Funds"

                                }

                            </Button>

                            )

                            }

                            {

                            campaign.expired &&

                            campaign.raised < campaign.goal && (

                            <Button

                                variant="warning"

                                className="mt-2 rounded-pill"
                                disabled={loading === `refund-${campaign.id}`}

                                onClick={() => claimRefund(campaign.id)}

                            >

                                {

                                    loading === `refund-${campaign.id}`

                                    ?

                                    "Refunding..."

                                    :

                                    "Claim Refund"

                                }

                            </Button>

                            )

                            }

                        </Card.Body>

                    </Card>

                ))

            }

        </>

    );

}

export default CampaignList;