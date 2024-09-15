import { MockApiAddresses } from "./MockApiAddresses.ts"
import { MockApiCustomers } from "./MockApiCustomers.ts"
import { MockApiProductions } from "./MockApiProductions.ts"
import { MockApiSales } from "./MockApiSales.ts"
import { MockApiProducers } from "./MockApiProducers.ts"
import { getPopoverUtilityClass } from "@mui/material"

export class MockApi {

    mockApiProductions: MockApiProductions = new MockApiProductions()
    mockApiAddresses: MockApiAddresses = new MockApiAddresses()
    mockApiCustomers: MockApiCustomers = new MockApiCustomers()
    mockApiSales: MockApiSales = new MockApiSales()
    mockApiProducers: MockApiProducers = new MockApiProducers()

    private log(methodName: String, args: any) {
        console.log(`MockApi.${methodName} has been invoked with following artguments : ${JSON.stringify(args)}`)
    }

    createBeefProduction(args) {
        this.log('createBeefProduction', args)
    }

    getProductions(args) {
        this.log('getProductions', args)
        return this.mockApiProductions.getProductions()
    }

    getProductionPercentageSold(args) {
        this.log('getProductionPercentageSold', args)
        return this.mockApiProductions.getProductionPercentageSold()
    }

    getProductionProducerPublicData(args) {
        this.log('getProducerPublicData', args)
        return this.mockApiProductions.getProductionProducerPublicData()
    }

    getRandomProducerPublicData(args) {
        this.log('getRandomProducerPublicData', args)
        return this.mockApiProducers.getRandomProducerPublicData()
    }

    getBeefProduction(args) {
        this.log('getBeefProduction', args)
        return this.mockApiProductions.getBeefProduction()
    }

    getPackageTemplates(args) {
        this.log('getPackageTemplates', args)
        return this.mockApiProductions.getPackageTemplates()
    }

    getAddresses(args) {
        this.log('getAddresses', args)
        return this.mockApiAddresses.getAddresses()
    }

    createCustomer(args){
        this.log('createCustomer', args)
        return this.mockApiCustomers.createCustomer(args)
    }

    getCustomer(args){
        this.log('getCustomer', args)
        return this.mockApiCustomers.getCustomer()
    }

    createProducerSale(args) {
        this.log('createProducerSale', args)
    }

    getProducerSales(args) {
        this.log('getProducerSales', args)
        return this.mockApiProducers.getProducerSales()
    }

    getProducerCustomers(args) {
        this.log('getProducerCustomers', args)
        return this.mockApiProducers.getCustomers()
    }

    getSales() {
        this.log('getSales', null)
        return this.mockApiSales.getSales()
    }

    getSale(args) {
        this.log('getSale', args)
        return this.mockApiSales.getSale()
    }

    getSaleOrders(args) {
        this.log('getSaleOrders', args)
        return this.mockApiSales.getSaleOrders()
    }

    getSaleProductions(args) {
        this.log('getSaleProductions', args)
        return this.mockApiSales.getSaleProductions()
    }

    getOrder(args) {
        this.log('getOrder', args)
        return this.mockApiSales.getOrder()
    }

    createOrder(args) {
        this.log('createOrder', args)
        return this.mockApiSales.createOrder(args)
    }

    getProducer(args) {
        this.log('getProducer', args)
        return this.mockApiProducers.getProducer()
    }

    updateProducer(args) {
        this.log('updateProducer', args)
        return this.mockApiProducers.updateProducer(args)
    }

    getStripeAccount(args) {
        this.log('getStripeAccount', args)
        return this.mockApiProducers.getStripeAccount()
    }

    createStripeAccount(args) {
        this.log('createStripeAccount', args)
        return this.mockApiProducers.getStripeAccount()
    }

    getProducerPaymentsSummary(args) {
        this.log('getProducerPaymentsSummary', args)
        return this.mockApiProducers.getProducerPaymentsSummary()
    }
}