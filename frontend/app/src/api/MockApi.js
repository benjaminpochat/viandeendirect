export class MockApi {
    createProduction(production, callback) {
        callback()
    }

    getProductions(options, callback) {
        const production1 = {
            productionType: 'BeefProduction',
            id: 1
        }

        const production2 = {
            productionType: 'BeefProduction',
            id: 2
        }

        callback(undefined, [production1, production2])
    }

    getProductionPercentageSold(options, callback) {
        callback(undefined, Math.floor(Math.random() * 100))
    }

    getBeefProduction(id, callback) {
        const beefProduction1 = {
            slaughterDate: '2023-10-01T10:00:00',
            animalLiveWeight: 450,
            id: 1
        }
        callback(undefined, beefProduction1)
    }

    getPackageTemplates(options, callback) {
        const template1 = {
            label: 'Le coli tradition',
            description: 'Un coli avec un peu de tout',
            unitPrice: 16.5,
            netWeight: 10,
            id: 1
        }
        const template2 = {
            label: 'Le coli cuisson rapide',
            description: 'Un coli avec surtout des steaks ',
            unitPrice: 16.5,
            netWeight: 10,
            id: 2
        }
        const template3 = {
            label: 'Le petit coli steaks',
            description: 'Un coli avec que des steaks ',
            unitPrice: 16.5,
            netWeight: 5,
            id: 3
        }

        callback(undefined, [template1, template2, template3])
    }

    getSales(options, callback) {
        const sale1 = {
            id: 1,
            deliveryStart: '2023-11-15T18:00:00',
            deliveryStop: '2023-11-15T20:00:00',
            deliveryAddressName: 'ESL Rémilly',
            deliveryAddressLine1: '1 rue De Gaulle',
            deliveryCity: 'Rémilly',
            deliveryZipCode: '57580',
            productions: [
                {
                    id: 1,
                    productionType: 'BeefProduction',
                    slaughterDate: '2023-10-01T10:00:00',
                    animalLiveWeight: 450,
                    animalType: 'BEEF_HEIFER',
                    animalIdentifier: '9876'
                }
            ],
            orders: [
                {
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
        const sale2 = {
            id: 2,
            deliveryStart: '2023-11-20T16:00:00',
            deliveryStop: '2023-11-20T18:00:00',
            deliveryAddressName: 'Place de l\'Etoile',
            deliveryAddressLine1: '1 place de l\'Etoile',
            deliveryAddressLine2: 'Derrière l\'Arc de Triomphe',
            deliveryCity: 'Paris',
            deliveryZipCode: '75000',
            productions: [
                {
                    id: 2,
                    productionType: 'BeefProduction',
                    slaughterDate: '2023-11-01T10:00:00',
                    animalLiveWeight: 400,
                    animalType: 'BEEF_COW',
                    animalIdentifier: '0987'
                }
            ],
            orders: [
                {
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
        const sale3 = {
            id: 3,
            deliveryStart: '2024-01-15T16:00:00',
            deliveryStop: '2024-01-15T18:00:00',
            deliveryAddressName: 'Place de l\'Etoile',
            deliveryAddressLine1: '1 place de l\'Etoile',
            deliveryAddressLine2: 'Derrière l\'Arc de Triomphe',
            deliveryCity: 'Paris',
            deliveryZipCode: '75000',
            productions: [
                {
                    id: 3,
                    productionType: 'BeefProduction',
                    slaughterDate: '2024-01-01T10:00:00',
                    animalLiveWeight: 400,
                    animalType: 'BEEF_COW',
                    animalIdentifier: '1234'
                }
            ],
            orders: [
                {
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
                    id: 33,
                    items: [,
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

        callback(undefined, [sale1, sale2, sale3])
    }

    getAddresses(options, callback) {
        const address1 = {
            id: 1,
            name: 'Parking ESL Rémilly',
            addressLine1: '1 rue De Gaule',
            zipCode: '57580',
            city: 'Rémilly'
        }

        const address2 = {
            id: 2,
            name: 'Place de l\'Etoile',
            addressLine1: 'Place de l\'Etoile',
            addressLine2: 'derrière l\'Arc de Triomphe',
            zipCode: '75001',
            city: 'Paris'
        }

        const address3 = {
            id: 3,
            name: 'Bonlieu Annecy',
            addressLine1: '1 rue du Président Farvre',
            zipCode: '74000',
            city: 'Annecy'
        }

        callback(undefined, [address1, address2, address3])
    }

    getCustomers(options, callback) {
        const customer1 = {
            id: 1,
            user: {
                name: 'Bob',
                lastName: 'Sinclair',
                email: 'bob.sinclair@gmail.com',
                phone: '01 02 03 04 05'
            }
        }
        const customer2 = {
            id: 2,
            user: {
                name: 'Amélie',
                lastName: 'Poulain',
                email: 'amelie.poulain@hotmail.com',
                phone: '06 02 03 04 05'
            }
        }
        const customer3 = {
            id: 3,
            user: {
                name: 'François',
                lastName: 'Pinion',
                email: 'francois.pinion@free.fr',
                phone: '07 02 03 04 05'
            }
        }
        callback(undefined, [customer1, customer2, customer3])
    }
}