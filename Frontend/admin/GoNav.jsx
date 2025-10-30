import React from "react";
import "./App2.css";
import { asset } from "../../assets/admin_assets/assets";
import { Link } from "react-router-dom";
import bauka from '../../classWork/Foods/nav/bauyrzhan.jpg';


export default function GoNav() {
    return(
        <div className="navbar2">
            <Link to={"/"}><img src={asset.logo} alt="" className="logo" /></Link>
            <img className="profile2" src={bauka}/>
        </div>
    );
}