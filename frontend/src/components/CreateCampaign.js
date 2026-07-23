// React hook for storing form data
import { useState } from "react";

// Bootstrap components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

// ethers library
import { ethers } from "ethers";

// Contract helper
import { getContract } from "../utils/contract";

function CreateCampaign() {

    // ==============================
    // Store campaign title
    // ==============================
    const [title, setTitle] = useState("");

    // Store campaign description
    const [description, setDescription] = useState("");

    // Store goal in ETH
    const [goal, setGoal] = useState("");

    // Store duration in seconds
    const [duration, setDuration] = useState("");

    // Loading state
    const [loading, setLoading] = useState(false);

    // ===========================================
    // Create Campaign Function
    // ===========================================
    async function createCampaign() {

        try {
            // ===== Frontend Validation =====

// Title empty
            if (!title.trim()) {

                alert("Please enter campaign title.");

                return;

            }

// Description empty
            if (!description.trim()) {

                alert("Please enter campaign description.");

                return;

            }

// Goal check
            if (!goal || Number(goal) <= 0) {

                alert("Goal must be greater than 0 ETH.");

                return;

            }

// Duration check
            if (!duration || Number(duration) <= 0) {

                alert("Duration must be greater than 0.");

                return;

            }

            // Show loading
            setLoading(true);

            // Get deployed contract
            const contract = await getContract();

            // Convert ETH to Wei
            const goalInWei = ethers.parseEther(goal);

            // Call smart contract function
            const tx = await contract.createCampaign(

                title,

                description,

                goalInWei,

                Number(duration)

            );

            // Wait until transaction is mined
            await tx.wait();

            // Success message
            alert("Campaign Created Successfully!");

            // Clear form
            setTitle("");
            setDescription("");
            setGoal("");
            setDuration("");

        }

        catch (error) {

            console.log(error);

            alert("Failed to create campaign.");

        }

        finally {

            // Stop loading
            setLoading(false);

        }

    }

    return (

        <Card className="mt-4 shadow">

            <Card.Body>

                <h3 className="text-center mb-4">Create Campaign</h3>

                <Form>

                    {/* Campaign Title */}

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Title

                        </Form.Label>

                        <Form.Control

                            type="text"

                            value={title}

                            onChange={(e) =>
                                setTitle(e.target.value)
                            }

                        />

                    </Form.Group>

                    {/* Description */}

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Description

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={3}

                            value={description}

                            onChange={(e) =>
                                setDescription(e.target.value)
                            }

                        />

                    </Form.Group>

                    {/* Goal */}

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Goal (ETH)

                        </Form.Label>

                        <Form.Control

                            type="number"

                            value={goal}

                            onChange={(e) =>
                                setGoal(e.target.value)
                            }

                        />

                    </Form.Group>

                    {/* Duration */}

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Duration (Seconds)

                        </Form.Label>

                        <Form.Control

                            type="number"

                            value={duration}

                            onChange={(e) =>
                                setDuration(e.target.value)
                            }

                        />

                        <Form.Text>

                            Example:
                            300 = 5 minutes

                        </Form.Text>

                    </Form.Group>

                    <Button

                        variant="primary"
                        className="w-100 rounded-pill"

                        onClick={createCampaign}

                        disabled={loading}

                    >

                        {

                            loading

                            ?

                            "Creating..."

                            :

                            "Create Campaign"

                        }

                    </Button>

                </Form>

            </Card.Body>

        </Card>

    );

}

export default CreateCampaign;