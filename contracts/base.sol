// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./StewardRelationshipHistoryContract.sol";
import "./PatientRecordsContract.sol";
import "./LogsContract.sol";

contract base {
uint256 public doctorsCount;
address[] public allDoctors; 

StewardRelationshipHistoryContract public srhc;
PatientRecordsContract public prc;
LogsContract public lc;
constructor(address _srhcaddress,address _prcaddress, address _lcaddress) {

        // Only initialize srhc if a valid address is provided
        if (_srhcaddress != address(0)) {
            srhc = StewardRelationshipHistoryContract(_srhcaddress);
        }
        if(_prcaddress!=address(0)){
          prc= PatientRecordsContract(_prcaddress);
        }
         if(_lcaddress != address(0)) {
           lc=LogsContract(_lcaddress);
        }
    }

    struct files{
        string file_name;
        string file_type;
        string file_hash;
    }
    struct patient{
        string name;
        uint age;
        address id;
        string gender;
        string contact_info;
        string[] filehashes;
        address[] doctor_list;
    }
    struct doctor{
        string name;
        address id;
        string contact;
        string specialization;
        address[] patient_list;
         uint16[] ratings;
        uint16 yearsOfExperience;
        uint256 authorityScore;
    }
  mapping (address => doctor) public doctors;
  mapping (address => patient) public patients; //mapping patients to their addresses
  mapping (address => mapping (address => uint16)) public patientToDoctor; //patients and list of doctors allowed access to
  mapping(address => files[]) public patientFiles;
  mapping(address => mapping(address => bool)) public hasRated;
  modifier onlyDoctor() {
        require(doctors[msg.sender].id > address(0x0), "Only doctors can execute this function");
        _;
    } 
    modifier onlyPatient() {
        require(patients[msg.sender].id > address(0x0), "Only patients can execute this function");
        _;
    }

  modifier checkDoctor(address id) {
    doctor memory d = doctors[id];
    require(d.id > address(0x0));//check if doctor exist
    _;
  }
  modifier checkPatient(address id) {
    patient memory p = patients[id];
    require(p.id > address(0x0));//check if patient exist
    _;
  }
  event patientSignUp( address _patient, string message);
  event DoctorRated(address doctorAddress, uint16 rating,uint256 updatedScore);
  function signupPatient(string memory _name, address a, uint _age, string memory _contact, string memory _gender) public {
    patient storage p = patients[a];
    require(!(p.id > address(0x0)));
    patients[a] = patient({name:_name, age:_age, id:a, gender:_gender, contact_info:_contact, filehashes:new string[](0), doctor_list:new address[](0)});
    

    emit patientSignUp( a, "Registered as Patient");
  }
  event doctorSignUp(address _doctor, string message);

  function signupDoctor(address _id, string memory _name, string memory _contact, string memory _specialization, uint16 _yrsofexp) public {

      //search for doctor on blockchain
      doctor storage d = doctors[_id];
    //   adhaar memory a = doctor_adhaar_info[_id];
      //check name of doctor
      require(keccak256(abi.encodePacked(_name)) != keccak256(""));
      //check if doctor already exists
      require(!(d.id > address(0x0)),"Doctor already registered");

    //   require(a.adhaar_number > 0);
      //Add the doctor to blockchain
      doctors[_id] = doctor({name:_name, id:_id, contact:_contact, specialization: _specialization, patient_list:new address[](0),ratings:new uint16[](0),
            yearsOfExperience: _yrsofexp,
            authorityScore: calculateInitialAuthorityScore(_specialization, _yrsofexp)});
       doctorsCount++;
       allDoctors.push(_id);
     
      emit doctorSignUp(_id, "Registered as Doctor");
  }
   function addUserFiles(address a,string memory _file_name, string memory _file_type,string memory _file_hash) public{

    patientFiles[a].push(files({file_name:_file_name, file_type:_file_type,file_hash:_file_hash}));
    string[] storage patientFileshashArray = patients[a].filehashes;

    // Create a new file entry
    string memory newFile = _file_hash; // You can adjust this based on your requirements
    // Push the new file into the patient's files array
    patientFileshashArray.push(newFile);
    if (patientFileshashArray.length > 1) {
        // If it's not the first file, call the createPatientRecord function
        PatientRecordsContract pt = PatientRecordsContract(prc);
        pt.createPatientRecord(a, _file_name, _file_hash);
    }
    

  }
   event DoctorPatientListUpdated(address doctor, address[] patientList);
    function updateDoctorPatientList(address doctorId, address[] memory newPatientList) internal {
        doctor storage doc = doctors[doctorId];
        doc.patient_list = newPatientList;
        lc.updateDoctorPatientList(doctorId, newPatientList);

        emit DoctorPatientListUpdated(doctorId, newPatientList);
    }
  event grantDoctorAccess( address patient_address, string message, string _doctor, address doctor_address);
  
 function grantAccessPatientToDoctor(address doctorId, address patientId) public checkPatient(patientId) checkDoctor(doctorId) {
    patient storage p = patients[patientId];
    doctor storage d = doctors[doctorId];
    require(patientToDoctor[patientId][doctorId] < 1, "Doctor already has access");
    files[] storage filearray=patientFiles[patientId];
    require(p.filehashes.length > 0, "Patient has no files"); // Ensure patient has at least one file
    files storage lastFile = filearray[filearray.length-1]; // Retrieve file details
    p.doctor_list.push(doctorId);
    uint16 pos = (uint16)(p.doctor_list.length);
    patientToDoctor[patientId][doctorId] = pos;
    d.patient_list.push(patientId);
     updateDoctorPatientList(doctorId, d.patient_list);
    
     StewardRelationshipHistoryContract historyContract = StewardRelationshipHistoryContract(srhc);
        historyContract.establishStewardRelationship(patientId, doctorId,lastFile.file_name, lastFile.file_hash);
  

    emit grantDoctorAccess(patientId, "Granted access to doctor", d.name, doctorId);
}
 function rateDoctor(address doctorId, uint16 rating) public onlyPatient checkDoctor(doctorId) {

        require(!hasRated[msg.sender][doctorId], "Patient has already rated this doctor");

        doctors[doctorId].ratings.push(rating);
        hasRated[msg.sender][doctorId] = true;

        uint256 updatedScore = updateAndReturnAuthorityScore(doctorId); // Update and return authority score

        emit DoctorRated(doctorId, rating,updatedScore);
    }

    function updateAndReturnAuthorityScore(address doctorId) internal checkDoctor(doctorId) returns (uint256) {
        doctor storage doc = doctors[doctorId];

        uint256 ratingSum = 0;
        for (uint256 i = 0; i < doc.ratings.length; i++) {
            ratingSum += doc.ratings[i];
        }
        uint256 averageRating = doc.ratings.length > 0 ? ratingSum / doc.ratings.length : 0;

        // Decrease authority score for lower ratings
        int256 authorityAdjustment = int256(averageRating) - 3; // Ratings of 1-2 will give negative adjustment
        if (authorityAdjustment < 0) {
            authorityAdjustment *= 2; // Increase the penalty for low ratings
        }

        uint256 specializationMultiplier = getSpecializationMultiplier(doc.specialization);
        uint256 experienceMultiplier = doc.yearsOfExperience > 10 ? 11 : 10; // 1.1 if > 10 years, else 1.0

        int256 authorityScore = int256(specializationMultiplier) * int256(experienceMultiplier) * (3 + authorityAdjustment) / 10;
        doc.authorityScore = authorityScore > 0 ? uint256(authorityScore) : 0; // Ensure authority score doesn't go negative

        return doc.authorityScore; // Return the updated authority score
    }
    function calculateInitialAuthorityScore(string memory specialization, uint16 yearsOfExperience) internal pure returns (uint256) {
        uint256 specializationMultiplier = getSpecializationMultiplier(specialization);
        uint256 experienceMultiplier = yearsOfExperience > 10 ? 11 : 10; // 1.1 if > 10 years, else 1.0
        uint256 initialScore = specializationMultiplier * experienceMultiplier * 3 / 10; // Initial base score with no ratings
        return initialScore;
    }

    function getSpecializationMultiplier(string memory specialization) internal pure returns (uint256) {
    if (keccak256(abi.encodePacked(specialization)) == keccak256(abi.encodePacked("General Practitioner"))) {
        return 10; // Multiplier 1.0
    } else if (keccak256(abi.encodePacked(specialization)) == keccak256(abi.encodePacked("Cardiologist"))) {
        return 12; // Multiplier 1.2
    } else if (keccak256(abi.encodePacked(specialization)) == keccak256(abi.encodePacked("Neurologist"))) {
        return 14; // Multiplier 1.4
    } else if (keccak256(abi.encodePacked(specialization)) == keccak256(abi.encodePacked("Dermatologist"))) {
        return 11; // Multiplier 1.1
    } else if (keccak256(abi.encodePacked(specialization)) == keccak256(abi.encodePacked("Oncologist"))) {
        return 13; // Multiplier 1.3
    }  
    // Default multiplier if specialization not found
    return 10; // Default multiplier 1.0
}

//   function getEngagedNodesFromBase(address node) public view returns (address[] memory, string[] memory, uint256[] memory) {
//     StewardRelationshipHistoryContract historyContract = StewardRelationshipHistoryContract(srhc);
//     // Call the function and store the result
//     (address[] memory engagedNodes, string[] memory stewardshipStatuses, uint256[] memory lastUpdateDates) = historyContract.getEngagedStewardships(node);

//     // Return the obtained values
//     return (engagedNodes, stewardshipStatuses, lastUpdateDates);
// }
function doctorSignIn(address _doctorId) public view checkDoctor(_doctorId) {
    }
    function patientSignIn(address _patientId) public view checkPatient(_patientId) {

    }

function getDoctorSpecializations() public view returns (address[] memory, string[] memory) {
    uint256 count = allDoctors.length;
    address[] memory doctorAddresses = new address[](count);
    string[] memory specializations = new string[](count);

    for (uint256 i = 0; i < count; i++) {
        address doctorAddress = allDoctors[i];
        doctor memory d = doctors[doctorAddress];
        doctorAddresses[i] = doctorAddress;
        specializations[i] = d.specialization;
    }

    return (doctorAddresses, specializations);
}
function getDoctorSpecializationsOfPatient(address patientId) public view returns (address[] memory,string[] memory) {
        address[] memory doctorList = patients[patientId].doctor_list;
        string[] memory specializations = new string[](doctorList.length);

        for (uint256 i = 0; i < doctorList.length; i++) {
            address doctorAddress = doctorList[i];
            specializations[i] = doctors[doctorAddress].specialization;
        }

        return (doctorList,specializations);
    }
function getDoctorScore(address doctorAddress) public view returns (uint256) {
        return doctors[doctorAddress].authorityScore;
    }
}