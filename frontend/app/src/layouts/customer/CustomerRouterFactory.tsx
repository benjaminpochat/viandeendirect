import React from "react";

import { createBrowserRouter, Navigate } from "react-router-dom";

import PaymentLayout from "./PaymentLayout.tsx";
import CustomerLayout from "./CustomerLayout.tsx";
import CustomerOrderForm from "../../domains/sale/views/CustomerOrderForm.tsx";
import NotAuthorizedForProducers from "../../authentication/views/NotAuthorizedForProducers.tsx";
import Welcome from "../../domains/welcome/Welcome.tsx";

export class CustomerRouterFactory {
    getRouter() {
        return createBrowserRouter([
            {
                path: "/",
                element: <CustomerLayout/>,
                children: [
                    {
                        index: true,
                        element: <Navigate to='/welcome' replace/>
                    },
                    {
                        path: "/welcome",
                        element: <Welcome/>
                    },
                    {
                        path: "/order/creation",
                        element: <CustomerOrderForm/>
                    },
                    {
                        path: "/orders/:orderId/payment",
                        element: <PaymentLayout/>
                    }
                ]
            },
            {
                path: "/unauthorized",
                element: <NotAuthorizedForProducers/>
            }
        ])
    }
}