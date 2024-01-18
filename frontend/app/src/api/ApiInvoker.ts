import { ApiBuilder } from "./ApiBuilder.ts"

export class ApiInvoker {

    apiBuilder = new ApiBuilder()

    callApiAnonymously(getApiFunction, arg, callBackFunction) {
        this.apiBuilder.getAnonymousApi().then(api => {
            this.apiBuilder.invokeAnonymousApi(() => {
                const apiFunction = getApiFunction(api)
                if (arg) {
                    apiFunction.call(api, arg, (error, data) => {
                        if (error) {
                            console.error(error)
                        } else {
                            callBackFunction(data)
                        }
                    })
                } else {
                    apiFunction.call(api, (error, data) => {
                        if (error) {
                            console.error(error)
                        } else {
                            callBackFunction(data)
                        }
                    })
                }
            })
        })
    }

    callApiAuthenticatedly(getApiFunction, arg, callBackFunction, keycloak) {
        this.apiBuilder.getAuthenticatedApi(keycloak).then(api => {
            this.apiBuilder.invokeAuthenticatedApi(() => {
                const apiFunction = getApiFunction(api)
                if (arg) {
                    apiFunction.call(api, arg, (error, data) => {
                        if (error) {
                            console.error(error)
                        } else {
                            callBackFunction(data)
                        }
                    })
                } else {
                    apiFunction.call(api, (error, data) => {
                        if (error) {
                            console.error(error)
                        } else {
                            callBackFunction(data)
                        }
                    })
                }
            }, keycloak)
        })
    }
}