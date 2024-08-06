import React from 'react'
import { Typography } from "@mui/material"
import './Dashboard.css'
import DashboardAccount from '../components/DashboardAccount.tsx'
import AuthenticatedLayout from '../../../layouts/producer/AuthenticatedLayout.tsx'
import DashboardProductions from '../components/DashboardProductions.tsx'
import DashboardSales from '../components/DashboardSales.tsx'

function Dashboard() {
    return <>
        <Typography variant="h6">Tableau de bord</Typography>
        <div className="dashboard-container">
            <div className="dashboard-item"><DashboardAccount/></div>
            <div className="dashboard-item">Mes derniers versements</div>
            <div className="dashboard-item"><DashboardProductions/></div>
            <div className="dashboard-item"><DashboardSales/></div>
        </div>
    </>
}

export default Dashboard