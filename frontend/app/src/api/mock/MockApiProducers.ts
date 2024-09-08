import { StripeAccount } from "@viandeendirect/api/dist/models"
import {Customer} from "@viandeendirect/api/dist/models/Customer"
import {Producer} from "@viandeendirect/api/dist/models/Producer"
import {Sale} from "@viandeendirect/api/dist/models/Sale"

export class MockApiProducers {
    getStripeAccount(): StripeAccount {
        return {
            id: 1,
            accountLink: 'http://fake_stripe_account_link',
            stripeId: '12345',
            detailsSubmitted: true
        }
    }

    getProducer(): Producer {
        return {
            id: 1,
            user: {
                id: 1,
                firstName: "Bob",
                lastName: "MARCEL",
                email: "bob.marcel@email.eu"
            },
            status: 'ACTIVE',
            sales: undefined,
            productions: undefined,
            stripeAccount: undefined,
            slideShowUrl: 'https://docs.google.com/presentation/d/1sqDR1v9AZLQYVJo2iT1gAVZ4UX25RamEBXeTmiUWRa4/edit?usp=sharing',
            websiteUrl: 'https://www.lemonde.fr'
        }
    }

    getProducerSales(): Array<Sale> {
        const sale1: Sale = {
            id: 1,
            deliveryStart: new Date('2025-11-15T18:00:00'),
            deliveryStop: new Date('2025-11-15T20:00:00'),
            deliveryAddressName: 'ESL Rémilly',
            deliveryAddressLine1: '1 rue De Gaulle',
            deliveryAddressLine2: undefined,
            deliveryCity: 'Rémilly',
            deliveryZipCode: '57580',
            productions: [
                {
                    id: 1,
                    productionType: 'BeefProduction',
                    slaughterDate: new Date('2025-10-01T10:00:00'),
                    animalLiveWeight: 450,
                    animalType: 'BEEF_HEIFER',
                    animalIdentifier: '9876'
                }
            ],
            orders: [
                {
                    customer: {},
                    id: 11,
                    items: [
                        {
                            id: 111,
                            unitPrice: 20,
                            quantity: 2,
                            packageLot: {
                                id: 111,
                                netWeight: 0.5
                            }
                        }, {
                            id: 112,
                            unitPrice: 160,
                            quantity: 1,
                            packageLot: {
                                id: 112,
                                netWeight: 10
                            }
                        }
                    ]
                },
                {
                    customer: {},
                    id: 12,
                    items: [
                        {
                            id: 121,
                            unitPrice: 160,
                            quantity: 1,
                            packageLot: {
                                id: 121,
                                netWeight: 10
                            }
                        }
                    ]
                }
            ]
        }
        const sale2: Sale = {
            id: 2,
            deliveryStart: new Date('2024-11-20T16:00:00'),
            deliveryStop: new Date('2024-11-20T18:00:00'),
            deliveryAddressName: 'Place de l\'Etoile',
            deliveryAddressLine1: '1 place de l\'Etoile',
            deliveryAddressLine2: 'Derrière l\'Arc de Triomphe',
            deliveryCity: 'Paris',
            deliveryZipCode: '75000',
            productions: [
                {
                    id: 2,
                    productionType: 'BeefProduction',
                    slaughterDate: new Date('2024-11-01T10:00:00'),
                    animalLiveWeight: 400,
                    animalType: 'BEEF_COW',
                    animalIdentifier: '0987'
                }
            ],
            orders: [
                {
                    customer: {},
                    id: 21,
                    items: [
                        {
                            id: 211,
                            unitPrice: 80,
                            quantity: 2,
                            packageLot: {
                                id: 211,
                                netWeight: 5
                            }
                        }
                    ]
                },
                {
                    customer: {},
                    id: 22,
                    items: [
                        {
                            id: 221,
                            unitPrice: 20,
                            quantity: 2,
                            packageLot: {
                                id: 221,
                                netWeight: 0.5
                            }
                        }, {
                            id: 222,
                            unitPrice: 160,
                            quantity: 1,
                            packageLot: {
                                id: 222,
                                netWeight: 10
                            }
                        }
                    ]
                },
                {
                    customer: {},
                    id: 23,
                    items: [
                        {
                            id: 231,
                            unitPrice: 160,
                            quantity: 1,
                            packageLot: {
                                id: 231,
                                netWeight: 10
                            }
                        }
                    ]
                }
            ]
        }
        const sale3: Sale = {
            id: 3,
            deliveryStart: new Date('2025-01-15T16:00:00'),
            deliveryStop: new Date('2025-01-15T18:00:00'),
            deliveryAddressName: 'Place de l\'Etoile',
            deliveryAddressLine1: '1 place de l\'Etoile',
            deliveryAddressLine2: 'Derrière l\'Arc de Triomphe',
            deliveryCity: 'Paris',
            deliveryZipCode: '75000',
            productions: [
                {
                    id: 3,
                    productionType: 'BeefProduction',
                    slaughterDate: new Date('2025-01-01T10:00:00'),
                    animalLiveWeight: 400,
                    animalType: 'BEEF_COW',
                    animalIdentifier: '1234'
                }
            ],
            orders: [
                {
                    customer: {},
                    id: 31,
                    items: [
                        {
                            id: 311,
                            unitPrice: 160,
                            quantity: 1,
                            packageLot: {
                                id: 311,
                                netWeight: 10
                            }
                        }
                    ]
                },
                {
                    customer: {},
                    id: 32,
                    items: [
                        {
                            id: 321,
                            unitPrice: 160,
                            quantity: 2,
                            packageLot: {
                                id: 321,
                                netWeight: 10
                            }
                        },
                        {
                            id: 322,
                            unitPrice: 80,
                            quantity: 1,
                            packageLot: {
                                id: 322,
                                netWeight: 5
                            }
                        }
                    ]
                },
                {
                    customer: {},
                    id: 33,
                    items: [
                        {
                            id: 331,
                            unitPrice: 80,
                            quantity: 2,
                            packageLot: {
                                id: 331,
                                netWeight: 5
                            }
                        }
                    ]
                }
            ]
        }
        return [sale1, sale2, sale3]
    }

    getCustomers(): Array<Customer> {
        const customer1 = {
            id: 1,
            user: {
                firstName: 'Bob',
                lastName: 'Sinclair',
                email: 'bob.sinclair@gmail.com',
                phone: '01 02 03 04 05'
            }
        }
        const customer2 = {
            id: 2,
            user: {
                firstName: 'Amélie',
                lastName: 'Poulain',
                email: 'amelie.poulain@hotmail.com',
                phone: '06 02 03 04 05'
            }
        }
        const customer3 = {
            id: 3,
            user: {
                firstName: 'François',
                lastName: 'Pinion',
                email: 'francois.pinion@free.fr',
                phone: '07 02 03 04 05'
            }
        }
        return [customer1, customer2, customer3]
    }

    getProducerPaymentsSummary() {
        return {
            daylyTotal: 123,
            weeklyTotal: 321,
            monthlyTotal: 456,
            yearlyTotal: 789
        }
    }
}
