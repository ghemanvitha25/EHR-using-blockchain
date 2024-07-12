import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import Info from "../components/Info";
import Footer from "../components/Footer";


const Home = () => {
  return (
    <div>
        <Layout>
      <Banner></Banner>
      <Info />
      <Footer/>
      </Layout>
    </div>
  );
};

export default Home;
