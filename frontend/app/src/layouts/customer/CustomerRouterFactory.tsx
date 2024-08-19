import React from "react";

import { createBrowserRouter, Navigate } from "react-router-dom";

import CustomerLayout, { loadCustomerLayoutData } from "./CustomerLayout.tsx";
import CustomerOrderForm, { loadCustomerOrderFormData } from "../../domains/sale/views/CustomerOrderForm.tsx";
import CustomerCreationForm, { loadCustomerCreationFormData } from "../../domains/customer/views/CustomerCreationForm.tsx";
import NotAuthorizedForProducers, { loadNotAuthorizedForProducerData } from "../../authentication/views/NotAuthorizedForProducers.tsx";
import Welcome, { loadWelcomeData } from "../../domains/welcome/Welcome.tsx";
import PaymentLayout from "./PaymentLayout.tsx";

export class CustomerRouterFactory {
    getRouter(keycloak) {
        return createBrowserRouter([
            {
                path: "/",
                element: <CustomerLayout/>,
                loader: async () => loadCustomerLayoutData(keycloak),
                children: [
                    {
                        index: true,
                        element: <Navigate to='/welcome' replace/>
                    },
                    {
                        path: "/welcome",
                        element: <Welcome/>,
                        loader: async () => loadWelcomeData()
                    },
                    {
                        path: "sale/:saleId/order/creation",
                        element: <CustomerOrderForm/>,
                        loader: async ({params}) => loadCustomerOrderFormData(+params.saleId)
                    }
                ]
            },
            {
                path: "/order/:orderId/payment",
                element: <PaymentLayout/>
            },
            {
                path: '/customer/registration',
                element: <CustomerCreationForm/>,
                loader: () => loadCustomerCreationFormData(keycloak)
            },
            {
                path: "/unauthorized",
                element: <NotAuthorizedForProducers/>,
                loader: () => loadNotAuthorizedForProducerData(keycloak)
            }
        ])
    }
}