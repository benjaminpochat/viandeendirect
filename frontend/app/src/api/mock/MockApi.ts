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

    createBeefProduction() {
    }

    getProductions() {
        return this.mockApiProductions.getProductions()
    }

    getProductionPercentageSold() {
        return this.mockApiProductions.getProductionPercentageSold()
    }

    getBeefProduction() {
        return this.mockApiProductions.getBeefProduction()
    }

    getPackageTemplates() {
        return this.mockApiProductions.getPackageTemplates()
    }

    getAddresses() {
        return this.mockApiAddresses.getAddresses()
    }

    createCustomer(customer){
        return this.mockApiCustomers.createCustomer(customer)
    }

    getCustomer(){
        return this.mockApiCustomers.getCustomer()
    }

    getProducerSales() {
        return this.mockApiProducers.getProducerSales()
    }

    getProducerCustomers() {
        return this.mockApiProducers.getCustomers()
    }

    getSales() {
        return this.mockApiSales.getSales()
    }

    getSale() {
        return this.mockApiSales.getSale()
    }

    getSaleOrders() {
        return this.mockApiSales.getSaleOrders()
    }

    getSaleProductions() {
        return this.mockApiSales.getSaleProductions()
    }

    getOrder() {
        return this.mockApiSales.getOrder()
    }

    createOrder(order) {
        return this.mockApiSales.createOrder(order)
    }

    getProducer() {
        return this.mockApiProducers.getProducer()
    }
}