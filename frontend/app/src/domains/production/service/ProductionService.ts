import Keycloak from "keycloak-js"
import { Production } from "@viandeendirect/api/dist/models";
import { ApiBuilder } from "../../../api/ApiBuilder.ts";

export class ProductionService {
    keycloak: Keycloak
    apiBuilder: ApiBuilder

    constructor(keycloak: Keycloak) {
        this.keycloak = keycloak
        this.apiBuilder = new ApiBuilder();
    }

    
    async getProductionEnd(production: Production): Promise<Date | undefined> {
        const api = await this.apiBuilder.getAuthenticatedApi(this.keycloak)
        switch (production.productionType) {
            case 'BeefProduction':
                const beefProduction = await api.getBeefProduction({beefProductionId: +production.id})
                return beefProduction.cuttingDate
            case 'HonneyProduction':
                return undefined
            default:
                return undefined
        }
    }
}