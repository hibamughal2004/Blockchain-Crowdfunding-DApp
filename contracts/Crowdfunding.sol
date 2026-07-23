// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Contract ka naam
contract Crowdfunding {

    // =========================
    // OWNER INFORMATION
    // =========================

    // Contract deploy karne wale ka wallet address
    address public owner;

    // =========================
    // CAMPAIGN STRUCTURE
    // =========================

    // Struct ek custom data type hota hai.
    // Isme hum campaign ki sari information ek jagah store karte hain.
    struct Campaign {

        // Har campaign ka unique ID
        uint256 id;

        // Campaign banane wale ka wallet address
        // payable isliye use kiya hai taake baad me is address ko ETH bhej saken.
        address payable creator;

        // Campaign ka title
        string title;

        // Campaign ki detail
        string description;

        // Kitna fund collect karna hai (Wei me)
        uint256 goal;

        // Ab tak kitna fund collect hua
        uint256 amountRaised;

        // Campaign kab khatam hogi (Unix Timestamp)
        uint256 deadline;

        // Campaign active hai ya nahi
        bool active;
    }

    // =========================
    // STORAGE VARIABLES
    // =========================

    // Har campaign ko uski ID ke through store karega
    mapping(uint256 => Campaign) public campaigns;

    // Next campaign ki ID generate karega
    uint256 public campaignCount;
    // ======================================================
// DONATION RECORD
// Har campaign ke liye har donor ki donation store hogi
// ======================================================

// campaignId => donorAddress => donatedAmount
    mapping(uint256 => mapping(address => uint256)) public donations;

    // =========================
    // EVENTS
    // =========================

    // Jab new campaign create hogi
    event CampaignCreated(

        uint256 id,

        address creator,

        string title,

        uint256 goal,

        uint256 deadline

    );
    // ======================================================
// Jab koi user campaign me donation kare
// ======================================================
    event CampaignFunded(

    // Campaign ID
        uint256 campaignId,

    // Donation kis wallet ne ki
        address donor,

    // Kitni donation hui
        uint256 amount

    );
// ======================================================
// Jab creator funds withdraw kare
// ======================================================
    event FundsWithdrawn(

        uint256 campaignId,

        address creator,

        uint256 amount

    );
// ======================================================
// Jab donor ko refund mile
// ======================================================
    event RefundIssued(

    // Campaign ID
        uint256 campaignId,

    // Kis donor ko refund mila
        address donor,

    // Kitna refund mila
        uint256 amount

    );

    // =========================
    // CONSTRUCTOR
    // =========================

    // Constructor sirf ek baar chalta hai
    // Jab contract deploy hota hai.
    constructor() {

        // msg.sender = jis wallet ne contract deploy kiya
        owner = msg.sender;

    }

    // =========================
    // CREATE CAMPAIGN FUNCTION
    // =========================

    function createCampaign(

        string memory _title,

        string memory _description,

        uint256 _goal,

        uint256 _duration

    ) public {

        // Goal zero nahi hona chahiye
        require(_goal > 0, "Goal must be greater than zero");

        // Duration zero nahi honi chahiye
        require(_duration > 0, "Duration must be greater than zero");

        // Campaign counter increase
        campaignCount++;

        // Mapping me nayi campaign store karna
        campaigns[campaignCount] = Campaign({

            id: campaignCount,

            creator: payable(msg.sender),

            title: _title,

            description: _description,

            goal: _goal,

            amountRaised: 0,

            // Current blockchain time + duration
            deadline: block.timestamp + _duration,

            active: true

        });

        // Event emit hoga taake frontend ko pata chale
        emit CampaignCreated(

            campaignCount,

            msg.sender,

            _title,

            _goal,

            block.timestamp + _duration

        );
        

    }
    // <-- createCampaign() function yahan khatam hoti hai

// YAHAN SE NEECHE WALA CODE PASTE KARNA HAI

// ======================================================
// DONATE FUNCTION
// Is function ke through users campaign me ETH donate karenge
// ======================================================

function donate(uint256 _campaignId) public payable {

    // Campaign exist karti hai ya nahi
    require(
        _campaignId > 0 && _campaignId <= campaignCount,
        "Invalid Campaign ID"
    );

    // Campaign storage se load karna
    Campaign storage campaign = campaigns[_campaignId];

    // Campaign active honi chahiye
    require(campaign.active, "Campaign is closed");

    // Deadline pass nahi honi chahiye
    require(
        block.timestamp < campaign.deadline,
        "Campaign deadline has passed"
    );

    // Donation zero nahi honi chahiye
    require(msg.value > 0, "Donation must be greater than zero");

    // AmountRaised update karo
    campaign.amountRaised += msg.value;
    // Donor ki donation record karo
    donations[_campaignId][msg.sender] += msg.value;

        // Event emit karo
    emit CampaignFunded(
        _campaignId,
        msg.sender,
        msg.value
    );
}

// ======================================================
// WITHDRAW FUNCTION
// Sirf campaign creator funds withdraw kar sakta hai
// ======================================================

function withdrawFunds(uint256 _campaignId) public {

    // Campaign exist karti honi chahiye
    require(
        _campaignId > 0 && _campaignId <= campaignCount,
        "Invalid Campaign ID"
    );

    // Campaign ko storage se load karo
    Campaign storage campaign = campaigns[_campaignId];

    // Sirf creator withdraw kar sakta hai
    require(
        msg.sender == campaign.creator,
        "Only campaign creator can withdraw"
    );

    // Campaign active honi chahiye
    require(
        campaign.active,
        "Campaign already closed"
    );

    // Deadline complete honi chahiye
    require(
        block.timestamp >= campaign.deadline,
        "Campaign is still running"
    );

    // Goal achieve honi chahiye
    require(
        campaign.amountRaised >= campaign.goal,
        "Funding goal not reached"
    );

    // Withdraw hone wali amount
    uint256 amount = campaign.amountRaised;

    // Double withdrawal rok do
    campaign.amountRaised = 0;

    // Campaign close kar do
    campaign.active = false;

    // ETH creator ko transfer karo
    (bool success, ) = campaign.creator.call{value: amount}("");
    require(success, "Transfer failed");

    // Event emit karo
    emit FundsWithdrawn(
        _campaignId,
        msg.sender,
        amount
    );
}
// ======================================================
// GET CAMPAIGN DETAILS
// Ye function kisi bhi campaign ki details return karega
// ======================================================

function getCampaign(
    uint256 _campaignId
)
public
view
returns(

    uint256 id,

    address creator,

    string memory title,

    string memory description,

    uint256 goal,

    uint256 amountRaised,

    uint256 deadline,

    bool active

)
{

    // Campaign exist karti honi chahiye
    require(
        _campaignId > 0 &&
        _campaignId <= campaignCount,
        "Invalid Campaign ID"
    );

    // Campaign load karo
    Campaign memory campaign = campaigns[_campaignId];

    // Saari values return karo
    return(

        campaign.id,

        campaign.creator,

        campaign.title,

        campaign.description,

        campaign.goal,

        campaign.amountRaised,

        campaign.deadline,

        campaign.active

    );
}


// ======================================================
// REFUND FUNCTION
// Agar campaign fail ho jaye to donor refund le sakta hai
// ======================================================

function claimRefund(uint256 _campaignId) public {

    // Campaign exist karti honi chahiye
    require(
        _campaignId > 0 &&
        _campaignId <= campaignCount,
        "Invalid Campaign ID"
    );

    Campaign storage campaign = campaigns[_campaignId];

    // Campaign ki deadline complete honi chahiye
    require(
        block.timestamp >= campaign.deadline,
        "Campaign still active"
    );

    // Goal achieve nahi hui honi chahiye
    require(
        campaign.amountRaised < campaign.goal,
        "Funding goal reached"
    );

    // User ne kitni donation ki thi
    uint256 donatedAmount = donations[_campaignId][msg.sender];

    require(
        donatedAmount > 0,
        "No donation found"
    );

    // Double refund rok do
    donations[_campaignId][msg.sender] = 0;

    // Raised amount update karo
    campaign.amountRaised -= donatedAmount;

    // Campaign close kar do
    campaign.active = false;

    // Refund bhejo
    (bool success, ) = payable(msg.sender).call{value: donatedAmount}("");

    require(success, "Refund failed");

    // Event emit karo
    emit RefundIssued(
        _campaignId,
        msg.sender,
        donatedAmount
    );
}
// ======================================================
// GET TOTAL CAMPAIGNS
// Blockchain me total campaigns ki count return karega
// ======================================================

function getCampaignCount() public view returns (uint256) {

    return campaignCount;

}
// Contract ka last bracket

}
