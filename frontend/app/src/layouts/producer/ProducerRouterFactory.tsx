import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthenticatedLayout from "./AuthenticatedLayout.tsx";
import ProductionController from "../../domains/production/ProductionController.tsx";
import CustomerController from "../../domains/customer/CustomerController.tsx";
import ProducerController from "../../domains/producer/ProducerController.tsx";
import SaleController from "../../domains/sale/SaleController.tsx";
import Dashboard from "../../domains/dashboard/views/Dashboard.tsx";
import AnonymousLayout from "./AnonymousLayout.tsx";
import NotAuthorizedForCustomers from "../../authentication/views/NotAuthorizedForCustomers.tsx";

export class ProducerRouterFactory {
    getRouter() {
        return createBrowserRouter([
            {
            path: "/",
            element: <AuthenticatedLayout/>,
            children: [
                {
                    index: true,
                    element: <Navigate to='/dashboard' replace/>
                },
                {
                    path: "/dashboard",
                    element: <Dashboard/>         
                },
                {
                    path: "/productions",
                    element: <ProductionController/>
                },
                {
                    path: "/sales",
                    element: <SaleController/>
                },
                {
                    path: "/customers",
                    element: <CustomerController/>
                },
                {
                    path: "/account",
                    element: <ProducerController/>
                },    
            ]
            },
            {
                path: "/authentication",
                element: <AnonymousLayout/>
            },
            {
                path: "/unauthorized",
                element: <NotAuthorizedForCustomers/>
            }
        ])
        
    }

}