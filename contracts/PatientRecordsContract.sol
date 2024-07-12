// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./LogsContract.sol";
import "./AccessControlContract.sol";

contract PatientRecordsContract {
     LogsContract public lc;
     AccessControlContract public acc;
    constructor(address _lc,address _acc){
         lc=LogsContract(_lc);
         acc = AccessControlContract(_acc);
    }

    // Struct to represent a patient record
    struct PatientRecord {
        string fileName; // Identity string for the patient record
        // string conditions; // Special conditions associated with the record
        // string accessInfo; // Information to find the EMR Database of a provider
        string queryLinkHash; // Hash value for the query link of the file
        // bytes32 emrHash; // Hash value of the stored record in EMR Database
        // address aacAddress; // Reference to the Access Control Contract (AAC) address
    }
    struct PatientData {
        address patientAddress;
        PatientRecord[] records;
    }


    // Mapping to store patient records by the Ethereum address of the owner
    mapping(address => PatientData) public patientRecords;

    // Event to log when a new patient record is created
    event RecordCreated(
        address indexed owner,
        string fileName,
        // string conditions,
        // string accessInfo,
        string queryLinkHash
        // bytes32 emrHash
        // address aacAddress
    );

    // Function to create a new patient record
    function createPatientRecord(
        address _pat,
        string memory _fileName,
        // string memory _conditions,
        // string memory _accessInfo,
        string memory _queryLinkHash
        // bytes32 _emrHash
        // address _aacAddress
    ) external {
        // require(patientRecords[msg.sender].aacAddress == address(0), "Record already exists");

        PatientRecord memory newRecord = PatientRecord({
            fileName: _fileName,
            // conditions: _conditions,
            // accessInfo: _accessInfo,
            queryLinkHash: _queryLinkHash
            // emrHash: _emrHash
            // aacAddress: _aacAddress
        });

        patientRecords[_pat].records.push(newRecord);
       LogsContract pt=LogsContract(lc);
       pt.logPatientRecordCreation(_pat, _fileName, _queryLinkHash, block.timestamp);

        emit RecordCreated(
            _pat,
            _fileName,
            // _conditions,
            // _accessInfo,
            _queryLinkHash
            // _emrHash
            // _aacAddress
        );
    }

    // Function to update conditions of a patient record
    // function updateConditions(address owner, string memory newConditions) external {
    //     require(msg.sender == owner, "Not authorized to update conditions");
    //     // require(patientRecords[owner].aacAddress != address(0), "Record does not exist");

    //     patientRecords[owner].conditions = newConditions;
    // }

    // Function to update AccessInfo of a patient record
    // function updateAccessInfo(address owner, string memory newAccessInfo) external {
    //     require(msg.sender == owner, "Not authorized to update AccessInfo");
    //     require(patientRecords[owner].aacAddress != address(0), "Record does not exist");

    //     patientRecords[owner].accessInfo = newAccessInfo;
    // }
    // Function to get all records of a patient
    function grantAccess(address _patient, address _doctor) external {
        // Check if the record exists

        // Ensure the caller is authorized to grant access
        // require(msg.sender == _patient || msg.sender == acc.admin(), "Not authorized to grant access");

        // Call the AccessControlContract to grant access
        acc.grantAccess(_patient, _doctor);
        
        // Additional logic to update access control for the specific record
        // (e.g., store doctor's address in the record mapping)
    }
function getPatientRecords(address _patient) external view returns (address,PatientRecord[] memory ) {
     return(_patient, patientRecords[_patient].records);
    
}

}
