import ApiClient from 'viandeendirect_eu/dist/ApiClient'
import DefaultApi from 'viandeendirect_eu/dist/api/DefaultApi'
import { MockApi } from './mock/MockApi.ts'

export class ApiBuilder {

    backendUrl = undefined

    async getBackendUrl() {
        if (!this.backendUrl) {
            let response = await fetch(window.location.origin + '/config/viandeendirect.json')
            let config = await response.json()
            this.backendUrl = config.backendUrl
        }
        return this.backendUrl        
    }

    /**
     * 
     * @param {*} keycloak 
     * @returns {Promise< DefaultApi | MockApi>} 
     */
    async getAuthenticatedApi(keycloak) {
        if(process.env.REACT_APP_MOCK_API) {
            return new MockApi()
        } else {
            let apiClient = ApiClient.instance
            apiClient.authentications['oAuth2ForViandeEnDirect'].accessToken = keycloak.token
            apiClient.basePath = await this.getBackendUrl()
            var api = new DefaultApi(apiClient)
            return api
        }
    }

    async getAnonymousApi() {
        if(process.env.REACT_APP_MOCK_API) {
            return new MockApi()
        } else {
            return new DefaultApi(ApiClient.instance)
        }
    }

    /**
     * 
     * @param {*} apiFunction 
     * @param {Keycloak} keycloak 
     */
     invokeAuthenticatedApi(apiFunction, keycloak) {
        if(process.env.REACT_APP_MOCK_API) {
            apiFunction()
        } else {
            keycloak.updateToken(30).then(function () {
                apiFunction()
            }).catch(function (error) {
                console.log('Failed to refresh token');
                console.log(error);
            })
        }
    }

    invokeAnonymousApi(apiFunction) {
        apiFunction()
    }
}
