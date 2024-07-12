import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {MoralisProvider, moralisProvider} from "react-moralis";
import Home from './pages/Home';
import Patient from './pages/Patient';
import Doctor from './pages/Doctor';
import AddRelations from './components/AddRelations';
import Getrecord from './components/Getrecord';
import GetSteward from './components/GetStewardship';
import AddDoctor from './components/AddDoctor';
import AddPatient from './components/AddPatient';
import DocSignIn from './components/DocSignIn';
import PatientSignIn from './components/PatientSignIn'
import GetLogs from './components/GetLogs';
import Banner from './components/Banner';
import Footer from './components/Footer';
import GetStewardPat from './components/GetStewardPat';
import Rate from './components/Rate';
function App() {
  return (
   <>
     <MoralisProvider initializeOnMount={false}>
      {/* <Navbar/> */}
      <Router>
        <Routes>
        
          <Route path="/" element={<Home/>}></Route>
          {/* <Route path="/admin" element={<Admin/>}></Route> */}
          <Route path="/doctor" element={<Doctor/>}></Route>
          <Route path="/Patient" element={<Patient/>}></Route>
          <Route path="/addrelations" element={<AddRelations/>}></Route>
          <Route path="/getsteward" element={<GetSteward/>}></Route>
          <Route path="/getrecord" element={<Getrecord/>}></Route>
          <Route path="/addDoctor" element={<AddDoctor/>}></Route>
          <Route path="/addPatient" element={<AddPatient/>}></Route>
          <Route path="/docsignin" element={<DocSignIn/>}></Route>
          <Route path="/patientsignin" element={<PatientSignIn/>}></Route>
          <Route path="/getlogs" element={<GetLogs/>}></Route>
          <Route path="/banner" element={<Banner/>}></Route>
          <Route path="/footer" element={<Footer/>}></Route>
          <Route path="/getstewardpat" element={<GetStewardPat/>}></Route>
          <Route path="/rate" element={<Rate/>}></Route>
        </Routes>
      </Router>
      
       
     </MoralisProvider>
   </>
  );
}

export default App;