import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthenticatedLayout from "./AuthenticatedLayout.tsx";
import CustomerController from "../../domains/customer/CustomerController.tsx";
import ProducerController from "../../domains/producer/ProducerController.tsx";
import Dashboard from "../../domains/dashboard/views/Dashboard.tsx";
import AnonymousLayout from "./AnonymousLayout.tsx";
import NotAuthorizedForCustomers from "../../authentication/views/NotAuthorizedForCustomers.tsx";
import BeefProductionView from "../../domains/production/views/beefProduction/BeefProductionView.tsx";
import BeefProductionCreator, { loadBeefProductionCreatorData } from "../../domains/production/views/beefProduction/BeefProductionCreator.tsx";
import ProductionsList, { loadProductionListData } from "../../domains/production/views/ProductionsList.tsx";
import SalesList, { loadSalesListData } from "../../domains/sale/views/SalesList.tsx";
import SaleForm, { loadSaleFormData } from "../../domains/sale/views/SaleForm.tsx";
import OrdersList, { loadOrdersListData } from "../../domains/sale/views/OrdersList.tsx";
import OrderView, { loadOrderViewData } from "../../domains/sale/views/OrderView.tsx";
import ProducerOrderForm, { loadProducerOrderFormData } from "../../domains/sale/views/ProducerOrderForm.tsx";

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
                        element: <ProductionsList/>,
                        loader: async () => loadProductionListData(keycloakClient)
                    },
                    {
                        path: '/beefProduction/:beefProductionId',
                        element: <BeefProductionView/>
                    },
                    {
                        path: '/beefProduction/creation',
                        element: <BeefProductionCreator/>,
                        loader: async () => loadBeefProductionCreatorData(keycloakClient)
                    },
                    {
                        path: '/sales',
                        element: <SalesList/>,
                        loader: async () => loadSalesListData(keycloakClient)
                    },
                    {
                        path: '/sales/creation',
                        element: <SaleForm/>,
                        loader: async () => loadSaleFormData(keycloakClient)
                    },
                    {
                        path: '/sale/:saleId/orders',
                        element: <OrdersList/>,
                        loader: async ({params}) => loadOrdersListData(+params.saleId, keycloakClient)
                    },
                    {
                        path: '/sale/:saleId/order/:orderId',
                        element: <OrderView/>,
                        loader: async ({params}) => loadOrderViewData(+params.orderId, keycloakClient)
                    },
                    {
                        path: '/sale/:saleId/order/creation',
                        element: <ProducerOrderForm/>,
                        loader: async ({params}) => loadProducerOrderFormData(+params.saleId, keycloakClient)
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