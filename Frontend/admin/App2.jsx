import React from "react";
import './App2.css';
import GoNav from "./GoNav";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';


export default function App2() {
    return (
        <div>
            <ToastContainer/>
            <GoNav/>
            <hr/>
            <div className="app2-content">
                <Sidebar/>
                <div className="app2-content-right">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}