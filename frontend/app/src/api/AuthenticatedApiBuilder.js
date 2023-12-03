import ApiClient from 'viandeendirect_eu/dist/ApiClient'
import DefaultApi from 'viandeendirect_eu/dist/api/DefaultApi'
import { MockApi } from './mock/MockApi.ts'

export class AuthenticatedApiBuilder {
    /**
     * 
     * @param {*} keycloak 
     * @returns {DefaultApi | MockApi} 
     */
    getAuthenticatedApi(keycloak) {
        if(process.env.REACT_APP_MOCK_API) {
            return new MockApi()
        } else {
            let apiClient = ApiClient.instance
            apiClient.authentications['oAuth2ForViandeEnDirect'].accessToken = keycloak.token
            apiClient.basePath = '.'
            var api = new DefaultApi(apiClient)
            return api
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
}
