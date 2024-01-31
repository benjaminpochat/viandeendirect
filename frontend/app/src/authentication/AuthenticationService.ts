import Keycloak from "keycloak-js"
import { ApiInvoker } from "../api/ApiInvoker"

export class AuthenticationService {
    keycloak: Keycloak

    constructor(keycloak: Keycloak) {
        this.keycloak = keycloak
    }

    isAuthenticated(): boolean {
        return (!!process.env.REACT_APP_MOCK_API) || (!!this.keycloak.authenticated)
    }

    getCurrentUserName(): string | undefined {
        if(process.env.REACT_APP_MOCK_API) {
            return "Utilisateur TEST"
        }
        if (this.isAuthenticated()) {
            return this.keycloak.tokenParsed?.name
        }
        return undefined
    }}