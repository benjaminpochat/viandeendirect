import Keycloak from "keycloak-js"
import { ApiBuilder } from "../../api/ApiBuilder.ts"
import { Producer } from "@viandeendirect/api/dist/models/Producer"

export class AuthenticationService {
    keycloak: Keycloak

    constructor(keycloak: Keycloak) {
        this.keycloak = keycloak
    }

    isAuthenticated(): boolean {
        return (!!process.env.REACT_APP_MOCK_API) || (!!this.keycloak.authenticated)
    }

    async isAuthenticatedAsProducer(): Promise<boolean> {
        if (this.isAuthenticated()) {
            try {
                const userEmail = this.getCurrentUserEmail()
                const apiBuilder = new ApiBuilder()
                const api = await apiBuilder.getAuthenticatedApi(this.keycloak)
                await api.getProducer({'email': userEmail})
                return true
            } catch (error) {
                if(error.response.status === 409) {
                    return false
                }
            }
        }
        return false
    }

    async isAuthenticatedAsCustomer(): Promise<boolean> {
        if (this.isAuthenticated()) {
            try {
                const userEmail = this.getCurrentUserEmail()
                const apiBuilder = new ApiBuilder()
                const api = await apiBuilder.getAuthenticatedApi(this.keycloak)
                await api.getCustomer({'email': userEmail})
                return true
            } catch (error) {
                if(error.response.status === 409) {
                    return false
                }
            }
        }
        return false
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