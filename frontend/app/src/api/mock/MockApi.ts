import { MockApiAddresses } from "./MockApiAddresses.ts"
import { MockApiCustomers } from "./MockApiCustomers.ts"
import { MockApiProductions } from "./MockApiProductions.ts"
import { MockApiSales } from "./MockApiSales.ts"
import { MockApiProducers } from "./MockApiProducers.ts"

export class MockApi {

    mockApiProductions: MockApiProductions = new MockApiProductions()
    mockApiAddresses: MockApiAddresses = new MockApiAddresses()
    mockApiCustomers: MockApiCustomers = new MockApiCustomers()
    mockApiSales: MockApiSales = new MockApiSales()
    mockApiProducers: MockApiProducers = new MockApiProducers()

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
        let mockApi = this
        callback(undefined, mockApi.mockApiProductions.getBeefProduction())
    }

    getPackageTemplates(callback) {
        callback(undefined, this.mockApiProductions.getPackageTemplates())
    }

    getAddresses(callback) {
        callback(undefined, this.mockApiAddresses.getAddresses())
    }

    createCustomer(customer, callback){
        callback(undefined, this.mockApiCustomers.createCustomer(customer))
    }

    getCustomer(options, callback){
        callback(undefined, this.mockApiCustomers.getCustomer())
    }

    getProducerSales(options, callback) {
        callback(undefined, this.mockApiProducers.getProducerSales())
    }

    getProducerCustomers(callback) {
        callback(undefined, this.mockApiProducers.getCustomers())
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

    getProducer(id, callback) {
        callback(undefined, this.mockApiProducers.getProducer())
    }
}