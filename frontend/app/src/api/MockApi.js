import { Production } from "viandeendirect_eu"

export class MockApi {
    createProduction(production, callback) {
        callback()
    }

    getProductions(callback) {
        const production1 = {
            productionType: 'BeefProduction',
            id: 1
        }
        callback(undefined, [production1])
    }

    getBeefProduction(id, callback) {
        const beefProduction1 = {
            slaughterDate: '2023-10-01T10:00:00',
            animalLiveWeight: 450,
            id: 1
        }
        callback(undefined, beefProduction1)
    }
}