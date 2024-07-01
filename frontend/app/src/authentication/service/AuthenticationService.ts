import Keycloak from "keycloak-js"

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
    }

    getCurrentUserEmail(): string | undefined {
        if(process.env.REACT_APP_MOCK_API) {
            return "utilisateur@test.eu"
        }
        if (this.isAuthenticated()) {
            return this.keycloak.tokenParsed?.email
        }
        return undefined
    }

    getCurrentUserLastName(): string | undefined {
        if(process.env.REACT_APP_MOCK_API) {
            return "MARCEL"
        }
        if (this.isAuthenticated()) {
            return this.keycloak.tokenParsed?.family_name
        }
        return undefined
    }

    getCurrentUserFirstName(): string | undefined {
        if(process.env.REACT_APP_MOCK_API) {
            return "Bob"
        }
        if (this.isAuthenticated()) {
            return this.keycloak.tokenParsed?.given_name
        }
        return undefined
    }
}