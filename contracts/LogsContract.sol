// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LogsContract {
    struct Log {
        address source;
        string encryptedLogData;
        bool addedToBlockchain;
        uint256 lastUpdate;
    }
    struct DoctorLog {
        address[] patientList;
        // Add other relevant information if needed
    }
    mapping(address => Log[]) public logs;
    mapping(address => DoctorLog) private doctorLogs;
  uint8 _shift=3;

    event LogAdded(address indexed source, string encryptedLogData, uint256 timestamp);

 address[] doctors;

   
    function updateDoctorPatientList(address doctorId, address[] memory newPatientList) external {
        bool doctorExists = false;
        for (uint i = 0; i < doctors.length; i++) {
            if (doctors[i] == doctorId) {
                doctorExists = true;
                break;
            }
        }
        // Add the doctor only if not already present
        if (!doctorExists) {
            doctors.push(doctorId);
        }
        DoctorLog storage log = doctorLogs[doctorId];
        log.patientList = newPatientList;
        // You can add more logic here if needed
    }
    function updateDoctorLogsForPatient(address _patient, Log memory newLog) internal {
        for (uint256 i = 0; i < doctors.length; i++) {
            address doctorId = doctors[i];
            if (isPatientOfDoctor(doctorId, _patient) && !logExists(doctorId, newLog)) {
                logs[doctorId].push(newLog);
            }
        }
    }
     function logExists(address doctorId, Log memory newLog) internal view returns (bool) {
        Log[] storage doctorLogsArray = logs[doctorId];
        for (uint i = 0; i < doctorLogsArray.length; i++) {
            if (keccak256(abi.encodePacked(doctorLogsArray[i].encryptedLogData)) == keccak256(abi.encodePacked(newLog.encryptedLogData))) {
                return true;
            }
        }
        return false;
    }

    function isPatientOfDoctor(address doctorId, address patient) internal view returns (bool) {
        DoctorLog storage log = doctorLogs[doctorId];
        for (uint i = 0; i < log.patientList.length; i++) {
            if (log.patientList[i] == patient) {
                return true;
            }
        }
        return false;
    }

   function caesarEncrypt(string memory _data, uint8 shift) internal pure returns (string memory) {
    shift=3;
        bytes memory bytesData = bytes(_data);
        for (uint i = 0; i < bytesData.length; i++) {
            bytesData[i] = bytes1(uint8(bytesData[i]) + shift);
        }
        return string(bytesData);
}


    function addLog(address _source,string memory logData) internal {
        // address source = msg.sender;
          

        // Encrypt the log data using XOR encryption
        string memory encryptedData = caesarEncrypt(logData,_shift);

        Log memory newLog = Log({
            source: _source,
            encryptedLogData: encryptedData,
            addedToBlockchain: true,
            lastUpdate: block.timestamp
        });

        logs[_source].push(newLog);

        emit LogAdded(_source, encryptedData, block.timestamp);
         updateDoctorLogsForPatient(_source, newLog);
    }

    function updateLogStatus(address _source, uint256 _index) external {
        require(_index < logs[_source].length, "Invalid log index");

        logs[_source][_index].addedToBlockchain = true;
        logs[_source][_index].lastUpdate = block.timestamp;
    }

    function logPatientRecordCreation(address _patient, string memory _fileName, 
    string memory _queryLinkHash,  uint256 _timestamp) external {
        string memory logData = string(abi.encodePacked("Patient record created for address: ", toString(_patient), " - File Name: ", 
        _fileName, 
        " - Query Link Hash: ", 
        _queryLinkHash,"-Timestamp:",uint256ToString(_timestamp)));
        addLog(_patient,logData);
    }
    function getLastAddedLog(address _source) external view returns (Log memory) {
    require(logs[_source].length > 0, "No logs found for the specified source");

    // Get the index of the last added log
    uint256 lastIndex = logs[_source].length - 1;

    // Return the details of the last added log
    return logs[_source][lastIndex];
}


    function toString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
    // Utility function to convert uint256 to string
function uint256ToString(uint256 _value) internal pure returns (string memory) {
    if (_value == 0) {
        return "0";
    }

    uint256 temp = _value;
    uint256 digits;

    while (temp != 0) {
        digits++;
        temp /= 10;
    }

    bytes memory buffer = new bytes(digits);

    while (_value != 0) {
        digits -= 1;
        buffer[digits] = bytes1(uint8(48 + uint8(_value % 10)));
        _value /= 10;
    }

    return string(buffer);
}
function getAllLogs(address _source) external view returns (Log[] memory) {
    return logs[_source];
}

//  function generateEncryptionKey() internal view returns (uint256) {
//         return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)));
//     }
}