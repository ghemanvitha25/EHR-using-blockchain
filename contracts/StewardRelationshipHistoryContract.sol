// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./PatientRecordsContract.sol";

contract StewardRelationshipHistoryContract {
    PatientRecordsContract public prc;
    constructor(address _prc){
         prc=PatientRecordsContract(_prc);
         
    }
    address prcA;

    struct Stewardship {
        address nodeId;
        string stewardshipStatus;
        uint256 lastUpdateDate;
        address prcAddress;
    }

    mapping(address => Stewardship[]) public stewardships;
    mapping(address => mapping(address => bool)) public isEngaged;

    event StewardshipUpdated(address indexed owner, address indexed associatedNode, string stewardshipStatus, uint256 lastUpdateDate, address a);
    event EngagedStewardships(address indexed node, address[] engagedNodes, string[] statuses, uint256[] timestamps,address a);

    function establishStewardRelationship(address patient, address doctor,string memory file_name,string memory file_hash) external {
        require(patient != doctor, "Patient and doctor cannot be the same");
        require(!isEngaged[patient][doctor], "Stewardship already established");

        stewardships[patient].push(Stewardship({
            nodeId: doctor,
            stewardshipStatus: "newly established",
            lastUpdateDate: block.timestamp,
            prcAddress:prcA
        }));

        stewardships[doctor].push(Stewardship({
            nodeId: patient,
            stewardshipStatus: "newly established",
            lastUpdateDate: block.timestamp,
            prcAddress:prcA
        }));

        isEngaged[patient][doctor] = true;
        isEngaged[doctor][patient] = true;
       PatientRecordsContract pt=PatientRecordsContract(prc);
       pt.createPatientRecord(patient, file_name, file_hash);
       

        emit StewardshipUpdated(patient, doctor, "newly established", block.timestamp,prcA);
    }

    function updateStewardshipStatus(address node, address otherNode, string memory newStatus) external {
        require(isEngaged[node][otherNode], "Stewardship not found");

        for (uint256 i = 0; i < stewardships[node].length; i++) {
            if (stewardships[node][i].nodeId == otherNode) {
                stewardships[node][i].stewardshipStatus = newStatus;
                stewardships[node][i].lastUpdateDate = block.timestamp;

                break;
            }
        }

        for (uint256 i = 0; i < stewardships[otherNode].length; i++) {
            if (stewardships[otherNode][i].nodeId == node) {
                stewardships[otherNode][i].stewardshipStatus = newStatus;
                stewardships[otherNode][i].lastUpdateDate = block.timestamp;

                break;
            }
        }

        emit StewardshipUpdated(node, otherNode, newStatus, block.timestamp,prcA);
    }

    function getEngagedStewardships(address node) external view returns (address[] memory, string[] memory, uint256[] memory) {
        uint256 numEngagedNodes = stewardships[node].length;

        // Create arrays to store engaged nodes, statuses, and timestamps
        address[] memory engagedNodes = new address[](numEngagedNodes);
        string[] memory statuses = new string[](numEngagedNodes);
        uint256[] memory timestamps = new uint256[](numEngagedNodes);

        // Populate the arrays with engaged nodes, statuses, and timestamps
        for (uint256 i = 0; i < numEngagedNodes; i++) {
            engagedNodes[i] = stewardships[node][i].nodeId;
            statuses[i] = stewardships[node][i].stewardshipStatus;
            timestamps[i] = stewardships[node][i].lastUpdateDate;
        }

        return (engagedNodes, statuses, timestamps);
    }
}
