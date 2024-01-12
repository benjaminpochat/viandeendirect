import { MockApiAddresses } from "./MockApiAddresses.ts"
import { MockApiCustomers } from "./MockApiCustomers.ts"
import { MockApiProductions } from "./MockApiProductions.ts"
import { MockApiSales } from "./MockApiSales.ts"

export class MockApi {

    mockApiProductions: MockApiProductions = new MockApiProductions()
    mockApiAddresses: MockApiAddresses = new MockApiAddresses()
    mockApiCustomers: MockApiCustomers = new MockApiCustomers()
    mockApiSales: MockApiSales = new MockApiSales()

    createBeefProduction(beefProduction, callback) {
        callback()
    }

    getProductions(options, callback) {
        callback(undefined, this.mockApiProductions.getProductions())
    }

    getProductionPercentageSold(options, callback) {
        callback(undefined, this.mockApiProductions.getProductionPercentageSold)
    }

    getBeefProduction(id, callback) {
        callback(undefined, this.mockApiProductions.getBeefProduction())
    }

    getPackageTemplates(callback) {
        callback(undefined, this.mockApiProductions.getPackageTemplates())
    }

    getAddresses(callback) {
        callback(undefined, this.mockApiAddresses.getAddresses())
    }

    getCustomers(callback) {
        callback(undefined, this.mockApiCustomers.getCustomers())
    }

    getCutomer(customer, callback){
        callback(undefined, this.mockApiCustomers.createCustomer(customer))
    }

    getSales(callback) {
        callback(undefined, this.mockApiSales.getSales())
    }

    getSaleOrders(options, callback) {
        callback(undefined, this.mockApiSales.getSaleOrders())
    }

    getSaleProductions(options, callback) {
        callback(undefined, this.mockApiSales.getSaleProductions())
    }

    getOrder(option, callback) {
        callback(undefined, this.mockApiSales.getOrder())
    }

    createOrder(order, callback) {
        callback(undefined, this.mockApiSales.createOrder(order))
    }
}