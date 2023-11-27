import { MockApiAddresses } from "./MockApiAddresses.ts"
import { MockApiCustomers } from "./MockApiCustomers.ts"
import { MockApiProductions } from "./MockApiProductions.ts"
import { MockApiSales } from "./MockApiSales.ts"

export class MockApi {

    mockApiProductions: MockApiProductions = new MockApiProductions()
    mockApiAddresses: MockApiAddresses = new MockApiAddresses()
    mockApiCustomers: MockApiCustomers = new MockApiCustomers()
    mockApiSales: MockApiSales = new MockApiSales()

    createProduction(production, callback) {
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

    getPackageTemplates(options, callback) {
        callback(undefined, this.mockApiProductions.getPackageTemplates())
    }

    getAddresses(options, callback) {
        callback(undefined, this.mockApiAddresses.getAddresses())
    }

    getCustomers(options, callback) {
        callback(undefined, this.mockApiCustomers.getCustomers())
    }

    getSales(options, callback) {
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
}