import { createBrowserRouter } from "react-router-dom"
import { CustomerRouterFactory } from "./customer/CustomerRouterFactory.tsx"
import { ProducerRouterFactory } from "./producer/ProducerRouterFactory.tsx"
import React from "react"
import { ErrorLayout } from "./ErrorLayout.tsx"

export class RouterFactory {

    producerRouterFactory: ProducerRouterFactory = new ProducerRouterFactory()
    customerRouterFactory: CustomerRouterFactory = new CustomerRouterFactory()

    getRouter() {
        if(process.env.REACT_APP_MODE === 'CUSTOMER') {
          return this.customerRouterFactory.getRouter()
        }
        if(process.env.REACT_APP_MODE === 'PRODUCER') {
          return this.producerRouterFactory.getRouter()
        }
        return createBrowserRouter([
            {
            path: "/",
            element: <ErrorLayout message='Configuration du mode client ou producteur absent ou non reconnu'/>
            }
        ])
      }
}