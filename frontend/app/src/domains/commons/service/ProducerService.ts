import Keycloak from "keycloak-js"
import {Producer} from "@viandeendirect/api/dist/models/Producer.js";
import { AuthenticationService } from "../../../authentication/service/AuthenticationService.ts";
import { ApiBuilder } from "../../../api/ApiBuilder.ts";

export class ProducerService {
    keycloak: Keycloak
    apiBuilder: ApiBuilder
    static producer: Producer
    static unauthorized: boolean

    constructor(keycloak: Keycloak) {
        this.keycloak = keycloak
        this.apiBuilder = new ApiBuilder();
    }

    async loadProducer(): Promise<Producer> {
        const api = await this.apiBuilder.getAuthenticatedApi(this.keycloak)
        const authenticationService = new AuthenticationService(this.keycloak)
        return await api.getProducer({'email': authenticationService.getCurrentUserEmail()})
    }
}