import {Order} from "@viandeendirect/api/dist/models/Order";
import {Sale} from "@viandeendirect/api/dist/models/Sale";
import { Production } from "@viandeendirect/api/dist/models/Production";

export class MockApiSales {
    getSale(): Sale {
        return  {
            id: 1,
            deliveryStart: new Date('2023-11-15T18:00:00'),
            deliveryStop: new Date('2023-11-15T20:00:00'),
            deliveryAddressName: 'ESL Rémilly',
            deliveryAddressLine1: '1 rue De Gaulle',
            deliveryAddressLine2: undefined,
            deliveryCity: 'Rémilly',
            deliveryZipCode: '57580',
            productions: [
                {
                    id: 1,
                    productionType: 'BeefProduction',
                    slaughterDate: new Date('2023-10-01T10:00:00'),
                    animalLiveWeight: 450,
                    animalType: 'BEEF_HEIFER',
                    animalIdentifier: '9876',
                    birthFarm: 'La ferme du puis'
                }
            ]
        }
    }

    getSales(): Array<Sale> {
        const sale1: Sale = {
            id: 1,
            deliveryStart: new Date('2023-11-15T18:00:00'),
            deliveryStop: new Date('2023-11-15T20:00:00'),
            deliveryAddressName: 'ESL Rémilly',
            deliveryAddressLine1: '1 rue De Gaulle',
            deliveryAddressLine2: undefined,
            deliveryCity: 'Rémilly',
            deliveryZipCode: '57580',
            productions: [
                {
                    id: 1,
                    productionType: 'BeefProduction',
                    slaughterDate: new Date('2023-10-01T10:00:00'),
                    animalLiveWeight: 450,
                    animalType: 'BEEF_HEIFER',
                    animalIdentifier: '9876',
                    birthFarm: 'La ferme du puis'
                }
            ]
        }
        const sale2: Sale = {
            id: 2,
            deliveryStart: new Date('2023-11-20T16:00:00'),
            deliveryStop: new Date('2023-11-20T18:00:00'),
            deliveryAddressName: 'Place de l\'Etoile',
            deliveryAddressLine1: '1 place de l\'Etoile',
            deliveryAddressLine2: 'Derrière l\'Arc de Triomphe',
            deliveryCity: 'Paris',
            deliveryZipCode: '75000',
            productions: [
                {
                    id: 2,
                    productionType: 'BeefProduction',
                    slaughterDate: new Date('2023-11-01T10:00:00'),
                    animalLiveWeight: 400,
                    animalType: 'BEEF_COW',
                    animalIdentifier: '0987',
                    birthFarm: 'La ferme du pommier'
                }
            ]
        }
        const sale3: Sale = {
            id: 3,
            deliveryStart: new Date('2024-01-15T16:00:00'),
            deliveryStop: new Date('2024-01-15T18:00:00'),
            deliveryAddressName: 'Place de l\'Etoile',
            deliveryAddressLine1: '1 place de l\'Etoile',
            deliveryAddressLine2: 'Derrière l\'Arc de Triomphe',
            deliveryCity: 'Paris',
            deliveryZipCode: '75000',
            productions: [
                {
                    id: 3,
                    productionType: 'BeefProduction',
                    slaughterDate: new Date('2024-01-01T10:00:00'),
                    animalLiveWeight: 400,
                    animalType: 'BEEF_COW',
                    animalIdentifier: '1234',
                    birthFarm: 'La ferme de la source'
                }
            ]
        }
        return [sale1, sale2, sale3]
    }

    getSaleOrders(): Array<Order> {
        const order1: Order = {
            id: 21,
            status: 'BOOKED_WITHOUT_PAYMENT',
            customer: {
                id: 1,
                user: {
                    id: 1,
                    lastName: 'Oscar',
                    firstName: 'Petterson'
                }
            },
            items: [
                {
                    id: 211,
                    unitPrice: 80,
                    quantity: 2,
                    packageLot: {
                        id: 1,
                        label: 'Petit colis steaks',
                        netWeight: 5
                    }
                }
            ],
            invoice: undefined
        }

        const order2: Order = {
            id: 22,
            status: 'PAYMENT_COMPLETED',
            customer: {
                id: 2,
                user: {
                    id: 2,
                    lastName: 'Davis',
                    firstName: 'Miles'
                }
            },
            items: [
                {
                    id: 221,
                    unitPrice: 20,
                    quantity: 2,
                    packageLot: {
                        id: 3,
                        label: 'Filet',
                        netWeight: 0.5
                    }
                }, {
                    id: 222,
                    unitPrice: 160,
                    quantity: 1,
                    packageLot: {
                        id: 2,
                        label: 'Colis tradition',
                        netWeight: 10
                    }
                }
            ],
            invoice: undefined
        }
        const order3: Order = {
            id: 23,
            status: 'PAYMENT_ABORTED',
            customer: {
                id: 3,
                user: {
                    id: 3,
                    lastName: 'Pettrucciani',
                    firstName: 'Michel'
                }
            },
            items: [
                {
                    id: 231,
                    unitPrice: 160,
                    quantity: 1,
                    packageLot: {
                        id: 2,
                        label: 'Colis tradition',
                        netWeight: 10
                    }
                }
            ],
            invoice: undefined
        }

        return [order1, order2, order3]
    }

    getOrder(): Order {
        return {
            id: 22,
            status: 'PAYMENT_PENDING',
            customer: {
                id: 2,
                user: {
                    id: 2,
                    firstName: 'Miles',
                    lastName: 'Davis'
                }
            },
            items: [
                {
                    id: 221,
                    unitPrice: 20,
                    quantity: 2,
                    packageLot: {
                        id: 3,
                        label: 'Filet',
                        netWeight: 0.5
                    }
                }, {
                    id: 222,
                    unitPrice: 16,
                    quantity: 1,
                    packageLot: {
                        id: 2,
                        label: 'Colis tradition',
                        netWeight: 10
                    }
                }
            ],
            invoice: undefined
        }
    }

    getSaleProductions(): Array<Production> {
        return [
            {
                id: 1,
                productionType: 'BeefProduction',
                producer: undefined,
                lots: [
                    {
                        id: 1,
                        label: 'Le coli tradition',
                        description: 'Un coli avec un peu de tout',
                        unitPrice: 16.5,
                        netWeight: 10,
                        photo: undefined,
                        quantity: 15,
                        quantitySold: 10
                    },
                    {
                        id: 2,
                        label: 'Le petit coli steaks',
                        description: 'Un coli avec surtout des steaks',
                        unitPrice: 16.5,
                        netWeight: 5,
                        photo: undefined,
                        quantity: 10,
                        quantitySold: 10
                    },
                    {
                        id: 3,
                        label: 'Filet',
                        description: 'Un filet de boeuf',
                        unitPrice: 40,
                        netWeight: 0.5,
                        photo: undefined,
                        quantity: 10,
                        quantitySold: 9
                    }
                ],
                sales: undefined
            }
        ]
    }

    createOrder(order: Order) {
        return {...order, id: 999}
    }
}
