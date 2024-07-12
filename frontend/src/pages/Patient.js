import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import "../styles/patient.css"

export default function Patient(){
    return(
        <>
        <Layout>
          <body className="patientonly">
         <div className="patient-content"> 
                
                <div className="row">
                    
                    <div className="relation1"> 
                        <Link to="/getstewardpat" className="add-relations1">
                            Get StewardShips
                        </Link>
                    </div>
                    <div className="appointment"> 
                        <Link to="/addrelations" className="add-relations1">
                            Book Appointment
                        </Link>
                    </div>
                    <div className="rate"> 
                        <Link to="/rate" className="add-relations1">
                            Rate Doctor
                        </Link>
                    </div>
                    <div className="signout">
            <Link to="/" className="signout-link1">
              SignOut
            </Link>
          </div>
                </div>
            </div>
            </body>
        </Layout>
        </>
    );
}