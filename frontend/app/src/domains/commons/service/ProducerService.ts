import Keycloak from "keycloak-js"
import {Producer} from "@viandeendirect/api/dist/models/Producer.js";
import { ApiInvoker } from "../../../api/ApiInvoker.ts";
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

    loadProducer(setProducer, setUnauthorized = unauthorized => {}) {
        if(!ProducerService.producer) {
            const apiInvoker = new ApiInvoker()
            const authenticationService = new AuthenticationService(this.keycloak)
        apiInvoker.callApiAuthenticatedly(
            this.keycloak, 
            api => api.getProducer, 
            {'email': authenticationService.getCurrentUserEmail()}, 
            producer => {
                ProducerService.producer = producer
                ProducerService.unauthorized = false
                setProducer(ProducerService.producer)
                setUnauthorized(ProducerService.unauthorized)        
                }, 
            error => {
                console.error(error)
                ProducerService.unauthorized = true
                setProducer(ProducerService.producer)
                setUnauthorized(ProducerService.unauthorized)        
                }
            )
        } else {
            setProducer(ProducerService.producer)
            setUnauthorized(ProducerService.unauthorized)
        }
    }

    async asyncLoadProducer(): Promise<Producer> {
        const api = await this.apiBuilder.getAuthenticatedApi(this.keycloak)
        const authenticationService = new AuthenticationService(this.keycloak)
        return await api.getProducer({'email': authenticationService.getCurrentUserEmail()})
    }
}