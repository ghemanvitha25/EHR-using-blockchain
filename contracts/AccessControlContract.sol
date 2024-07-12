// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AccessControlContract {
    // Struct to represent access control information for a record
    struct AccessControl {
        address[] permittedNodes;
        mapping(address => AccessLevel) accessLevels;
        bytes32 symmetricKey;
        string pstatus;
        uint256 lastUpdateDate;
    }

    enum AccessLevel { Owner, Read, BlindRead }

    mapping(address => AccessControl) public accessControls;

    event AccessControlUpdated(
        address indexed owner,
        address[] permittedNodes,
        bytes32 symmetricKey,
        string pstatus,
        uint256 lastUpdateDate
    );

    function updateAccessControl(
        address[] memory _permittedNodes,
        AccessLevel[] memory _accessLevels,
        bytes32 _symmetricKey,
        string memory _pstatus
    ) external {
        AccessControl storage ac = accessControls[msg.sender];
        require(_permittedNodes.length == _accessLevels.length, "Invalid input");

        ac.permittedNodes = _permittedNodes;
        ac.symmetricKey = _symmetricKey;
        ac.pstatus = _pstatus;
        ac.lastUpdateDate = block.timestamp;

        for (uint256 i = 0; i < _permittedNodes.length; i++) {
            ac.accessLevels[_permittedNodes[i]] = _accessLevels[i];
        }

        emit AccessControlUpdated(
            msg.sender,
            _permittedNodes,
            _symmetricKey,
            _pstatus,
            block.timestamp
        );
    }

    function grantAccess(address _patient, address _doctor) external {
        require(_patient != address(0) && _doctor != address(0), "Invalid addresses");

        AccessControl storage patientAccess = accessControls[_patient];
        AccessControl storage doctorAccess = accessControls[_doctor];

        // Grant owner level access to the patient
        patientAccess.permittedNodes.push(_patient);
        patientAccess.accessLevels[_patient] = AccessLevel.Owner;

        // Grant read level access to the doctor
        doctorAccess.permittedNodes.push(_doctor);
        doctorAccess.accessLevels[_doctor] = AccessLevel.Read;

        emit AccessControlUpdated(
            _patient,
            patientAccess.permittedNodes,
            patientAccess.symmetricKey,
            patientAccess.pstatus,
            block.timestamp
        );

        emit AccessControlUpdated(
            _doctor,
            doctorAccess.permittedNodes,
            doctorAccess.symmetricKey,
            doctorAccess.pstatus,
            block.timestamp
        );
    }
    // Function to get the current access level for a given node
    function getAccessLevel(address owner, address node) external view returns (AccessLevel) {
        return accessControls[owner].accessLevels[node];
    }
}
