export class UrlService {

    backendUrl = undefined
    customerFrontendUrl = undefined
    producerFrontendUrl = undefined

    async getBackendUrl() {
        if (!this.backendUrl) {
            await this.loadUrls()
        }
        return this.backendUrl        
    }

    async getCustomerFrontentUrl() {
        if (!this.customerFrontendUrl) {
            await this.loadUrls()
        }
        return this.customerFrontendUrl        
    }

    async getProducerFrontentUrl() {
        if (!this.producerFrontendUrl) {
            await this.loadUrls()
        }
        return this.producerFrontendUrl        
    }

    private async loadUrls() {
        let response = await fetch(window.location.origin + '/config/viandeendirect.json')
        let config = await response.json()
        this.backendUrl = config.backendUrl
        this.customerFrontendUrl = config.customerFrontendUrl
        this.producerFrontendUrl = config.producerFrontendUrl
    }
}