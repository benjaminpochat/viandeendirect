import Address from "@viandeendirect/api/dist/models/Address"

export class MockApiAddresses {
    getAddresses(): Array<Address> {
        const address1 = {
            id: 1,
            name: 'Parking ESL Rémilly',
            addressLine1: '1 rue De Gaule',
            addressLine2: undefined,
            zipCode: '57580',
            city: 'Rémilly',
            owner: undefined
        }

        const address2 = {
            id: 2,
            name: 'Place de l\'Etoile',
            addressLine1: 'Place de l\'Etoile',
            addressLine2: 'derrière l\'Arc de Triomphe',
            zipCode: '75001',
            city: 'Paris',
            owner: undefined
        }

        const address3 = {
            id: 3,
            name: 'Bonlieu Annecy',
            addressLine1: '1 rue du Président Farvre',
            addressLine2: undefined,
            zipCode: '74000',
            city: 'Annecy',
            owner: undefined
        }

        return [address1, address2, address3]
    }
}