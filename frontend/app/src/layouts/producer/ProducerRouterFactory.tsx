import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthenticatedLayout, { loadAuthenticatedLayoutData } from "./AuthenticatedLayout.tsx";
import CustomerController from "../../domains/customer/CustomerController.tsx";
import ProducerAccountView, { loadProducerAccountViewData } from "../../domains/producer/views/ProducerAccountView.tsx";
import Dashboard from "../../domains/dashboard/views/Dashboard.tsx";
import AnonymousLayout from "./AnonymousLayout.tsx";
import NotAuthorizedForCustomers, { loadNotAuthorizedForCustomerData } from "../../authentication/views/NotAuthorizedForCustomers.tsx";
import BeefProductionView, { loadBeefProductionViewData } from "../../domains/production/views/beefProduction/BeefProductionView.tsx";
import BeefProductionCreator, { loadBeefProductionCreatorData } from "../../domains/production/views/beefProduction/BeefProductionCreator.tsx";
import ProductionsList, { loadProductionListData } from "../../domains/production/views/ProductionsList.tsx";
import SalesList, { loadSalesListData } from "../../domains/sale/views/SalesList.tsx";
import SaleForm, { loadSaleFormData } from "../../domains/sale/views/SaleForm.tsx";
import OrdersList, { loadOrdersListData } from "../../domains/sale/views/OrdersList.tsx";
import OrderView, { loadOrderViewData } from "../../domains/sale/views/OrderView.tsx";
import ProducerOrderForm, { loadProducerOrderFormData } from "../../domains/sale/views/ProducerOrderForm.tsx";
import CustomersList, { loadCustomersListData } from "../../domains/customer/views/CustomersList.tsx";
import PublicationBeefProductionToSale, { loadPublicationBeefProductionToSaleData } from "../../domains/production/views/beefProduction/PublicationBeefProductionToSale.tsx";

export class ProducerRouterFactory {
    getRouter(keycloak) {
        return createBrowserRouter([
            {
            path: "/",
            element: <AuthenticatedLayout/>,
            loader: async () => loadAuthenticatedLayoutData(keycloak),
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
                        loader: async () => loadProductionListData(keycloak)
                    },
                    {
                        path: '/beefProduction/:beefProductionId',
                        element: <BeefProductionView/>,
                        loader: async ({params}) => loadBeefProductionViewData(+params.beefProductionId, keycloak)
                    },
                    {
                        path: '/beefProduction/creation',
                        element: <BeefProductionCreator/>,
                        loader: async () => loadBeefProductionCreatorData(keycloak)
                    },
                    {
                        path: '/beefProduction/:productionId/publicationToSale',
                        element: <PublicationBeefProductionToSale/>,
                        loader: async ({params}) => loadPublicationBeefProductionToSaleData(+params.productionId, keycloak)
                    },
                    {
                        path: '/sales',
                        element: <SalesList/>,
                        loader: async () => loadSalesListData(keycloak)
                    },
                    {
                        path: '/sales/creation',
                        element: <SaleForm/>,
                        loader: async () => loadSaleFormData(keycloak)
                    },
                    {
                        path: '/sale/:saleId/orders',
                        element: <OrdersList/>,
                        loader: async ({params}) => loadOrdersListData(+params.saleId, keycloak)
                    },
                    {
                        path: '/sale/:saleId/order/:orderId',
                        element: <OrderView/>,
                        loader: async ({params}) => loadOrderViewData(+params.orderId, keycloak)
                    },
                    {
                        path: '/sale/:saleId/order/creation',
                        element: <ProducerOrderForm/>,
                        loader: async ({params}) => loadProducerOrderFormData(+params.saleId, keycloak)
                    },
                    {
                        path: '/customers',
                        element: <CustomersList/>,
                        loader: async () => loadCustomersListData(keycloak)
                    },
                    {
                        path: '/account',
                        element: <ProducerAccountView/>,
                        loader: async () => loadProducerAccountViewData(keycloak)
                    }
                ]
            },
            {
                path: '/authentication',
                element: <AnonymousLayout/>
            },
            {
                path: '/unauthorized',
                element: <NotAuthorizedForCustomers/>,
                loader: async () => loadNotAuthorizedForCustomerData(keycloak)
            }
        ])
        
    }

}