import React from 'react'
import { Divider, Typography } from "@mui/material"
import './Dashboard.css'
import DashboardAccount from '../components/DashboardAccount.tsx'
import DashboardProductions from '../components/DashboardProductions.tsx'
import DashboardSales from '../components/DashboardSales.tsx'
import DashboardPayments from '../components/DashboardPayments.tsx'

function Dashboard() {
    return <>
        <Typography variant="h6">Tableau de bord</Typography>
        <div className="dashboard-container">
            <div className="dashboard-item"><DashboardAccount/></div>
            <div className="dashboard-item"><DashboardPayments/></div>
            <div className="dashboard-item"><DashboardProductions/></div>
            <div className="dashboard-item"><DashboardSales/></div>
        </div>
    </>
}

export default Dashboard