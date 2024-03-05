import { ApiBuilder } from "./ApiBuilder.ts"

export class ApiInvoker {

    apiBuilder = new ApiBuilder()

    callApiAnonymously(getApiFunction, arg, successCallbackFunction, errorCallbackFunction) {
        this.apiBuilder.getAnonymousApi().then(api => {
            this.apiBuilder.invokeAnonymousApi(() => {
                const apiFunction = getApiFunction(api)
                if (arg) {
                    apiFunction.call(api, arg, (error, data) => {
                        if (error) {
                            errorCallbackFunction(error)
                        } else {
                            successCallbackFunction(data)
                        }
                    })
                } else {
                    apiFunction.call(api, (error, data) => {
                        if (error) {
                            errorCallbackFunction(error)
                        } else {
                            successCallbackFunction(data)
                        }
                    })
                }
            })
        })
    }

    callApiAuthenticatedly(keycloak, getApiFunction, arg, successCallbackFunction, errorCallbackFunction) {
        this.apiBuilder.getAuthenticatedApi(keycloak).then(api => {
            this.apiBuilder.invokeAuthenticatedApi(() => {
                const apiFunction = getApiFunction(api)
                if (arg) {
                    apiFunction.call(api, arg, (error, data) => {
                        if (error) {
                            errorCallbackFunction(error)
                        } else {
                            successCallbackFunction(data)
                        }
                    })
                } else {
                    apiFunction.call(api, (error, data) => {
                        if (error) {
                            errorCallbackFunction(error)
                        } else {
                            successCallbackFunction(data)
                        }
                    })
                }
            }, keycloak)
        })
    }
}