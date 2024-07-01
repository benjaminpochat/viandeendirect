import ApiClient from 'viandeendirect_eu/dist/ApiClient'
import DefaultApi from 'viandeendirect_eu/dist/api/DefaultApi'
import { MockApi } from './mock/MockApi.ts'
import { UrlService } from '../domains/commons/service/UrlService.ts'

export class ApiBuilder {

    urlService = new UrlService()

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
            apiClient.basePath = await this.urlService.getBackendUrl()
            var api = new DefaultApi(apiClient)
            return api
        }
    }

    async getAnonymousApi() {
        if(process.env.REACT_APP_MOCK_API) {
            return new MockApi()
        } else {
            let apiClient = ApiClient.instance
            apiClient.basePath = await this.urlService.getBackendUrl()   
            return new DefaultApi(apiClient)
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
