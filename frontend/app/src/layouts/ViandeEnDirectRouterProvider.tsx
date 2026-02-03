import React from "react";
import { useKeycloak } from "../../authentication/keycloak-adapter";
import { RouterProvider } from "react-router-dom";

import {RouterFactory} from './RouterFactory.tsx'

export default function ViandeEnDirectRouterProvider() {
    const {keycloak, initialized} = useKeycloak()
    const routerFactory = new RouterFactory()
    if (initialized || process.env.REACT_APP_MOCK_API) {
        return <RouterProvider router={routerFactory.getRouter(keycloak)} ></RouterProvider>
    } 
    return <>Authentification en cours...</>
}
