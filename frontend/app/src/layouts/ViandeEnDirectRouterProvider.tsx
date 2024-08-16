import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { RouterProvider } from "react-router-dom";

import {RouterFactory} from './RouterFactory.tsx'

export default function ViandeEnDirectRouterProvider() {
    const {keycloak, initialized} = useKeycloak()
    const routerFactory = new RouterFactory()

    return <RouterProvider router={routerFactory.getRouter(keycloak)} ></RouterProvider>
}
