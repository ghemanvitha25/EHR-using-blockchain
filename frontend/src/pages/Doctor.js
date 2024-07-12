import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import "../styles/Doctor.css";
import Score from "../components/Score";
export default function Doctor(){
    return(
        <>
        <Layout>
          <body className="doctoronly">
         <div className="doctor-content"> {/* Apply the admin-content class to this container */}
                <div className="row">
                    <div className="steward"> {/* Corrected class name to orange */}
                        <Link to="/getsteward" className="add-relations">
                            Get StewardShips
                        </Link>
                    </div>
                    <div className="record">
                        <Link to="/getrecord" className="add-relations">
                            Get Patient Records
                        </Link>
                    </div>
                    <div className="relation"> 
                        <Link to="/getlogs" className="add-relations">
                            Get Transaction Details
                        </Link>
                    </div>
                    <div className="signout-container">
            <Link to="/" className="signout-link">
              SignOut
            </Link>
          </div>
          <Score />
                </div>
            </div>
            </body>
        </Layout>
        
        </>
    );
}