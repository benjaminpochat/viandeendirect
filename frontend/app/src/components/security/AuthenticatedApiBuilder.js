import ApiClient from 'viandeendirect_eu/dist/ApiClient';
import DefaultApi from 'viandeendirect_eu/dist/api/DefaultApi';

export class AuthenticatedApiBuilder {
    /**
     * 
     * @param {*} keycloak 
     * @returns {DefaultApi} 
     */
    getAuthenticatedApi(keycloak) {
        let apiClient = ApiClient.instance;
        apiClient.authentications['oAuth2ForViandeEnDirect'].accessToken = keycloak.token;
        apiClient.basePath = '.';
        var api = new DefaultApi(apiClient);
        return api;
    }

    /**
     * 
     * @param {*} apiFunction 
     * @param {Keycloak} keycloak 
     */
     invokeAuthenticatedApi(apiFunction, keycloak) {
        keycloak.updateToken(30).then(function () {
            apiFunction()
        }).catch(function (error) {
            console.log('Failed to refresh token');
            console.log(error);
        })
    }
}
