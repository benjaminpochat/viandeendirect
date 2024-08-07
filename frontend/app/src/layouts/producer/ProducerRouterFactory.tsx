import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthenticatedLayout from "./AuthenticatedLayout.tsx";
import CustomerController from "../../domains/customer/CustomerController.tsx";
import ProducerController from "../../domains/producer/ProducerController.tsx";
import SaleController from "../../domains/sale/SaleController.tsx";
import Dashboard from "../../domains/dashboard/views/Dashboard.tsx";
import AnonymousLayout from "./AnonymousLayout.tsx";
import NotAuthorizedForCustomers from "../../authentication/views/NotAuthorizedForCustomers.tsx";
import BeefProductionView from "../../domains/production/views/beefProduction/BeefProductionView.tsx";
import BeefProductionCreator from "../../domains/production/views/beefProduction/BeefProductionCreator.tsx";
import ProductionsList from "../../domains/production/views/ProductionsList.tsx";
import SalesList from "../../domains/sale/views/SalesList.tsx";
import SaleForm from "../../domains/sale/views/SaleForm.tsx";
import OrdersList, { loadOrdersListData } from "../../domains/sale/views/OrdersList.tsx";
import OrderView from "../../domains/sale/views/OrderView.tsx";
import ProducerOrderForm from "../../domains/sale/views/ProducerOrderForm.tsx";

export class ProducerRouterFactory {
    getRouter(keycloakClient) {
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
                        path: '/dashboard',
                        element: <Dashboard/>         
                    },
                    {
                        path: '/productions',
                        element: <ProductionsList/>
                    },
                    {
                        path: '/beefProduction/:beefProductionId',
                        element: <BeefProductionView/>
                    },
                    {
                        path: '/beefProduction/creation',
                        element: <BeefProductionCreator/>
                    },
                    {
                        path: '/sales',
                        element: <SalesList/>
                    },
                    {
                        path: '/sales/creation',
                        element: <SaleForm/>
                    },
                    {
                        path: '/sale/:saleId/orders',
                        element: <OrdersList/>,
                        loader: async ({params}) => loadOrdersListData(params.saleId, keycloakClient)
                    },
                    {
                        path: '/sale/:saleId/order/:orderId',
                        element: <OrderView/>
                    },
                    {
                        path: '/sale/:saleId/order/creation',
                        element: <ProducerOrderForm/>
                    },
                    {
                        path: '/customers',
                        element: <CustomerController/>
                    },
                    {
                        path: '/account',
                        element: <ProducerController/>
                    }
                ]
            },
            {
                path: '/authentication',
                element: <AnonymousLayout/>
            },
            {
                path: '/unauthorized',
                element: <NotAuthorizedForCustomers/>
            }
        ])
        
    }

}