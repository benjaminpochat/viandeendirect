import { MockApi } from './mock/MockApi.ts'
import { UrlService } from '../domains/commons/service/UrlService.ts'
import { Configuration } from '@viandeendirect/api/dist/runtime'
import { DefaultApi } from '@viandeendirect/api/dist/apis/DefaultApi'

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
            const configuration = new Configuration({
                accessToken: () => `Bearer ${keycloak.token}`,
                basePath: await this.urlService.getBackendUrl()
            });
            return new DefaultApi(configuration)
        }
    }

    async getAnonymousApi() {
        if(process.env.REACT_APP_MOCK_API) {
            return new MockApi()
        } else {
            const configuration = new Configuration({
                basePath: await this.urlService.getBackendUrl()
            });
            return new DefaultApi(configuration)
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
