import BeefProduction from "viandeendirect_eu/dist/model/BeefProduction"
import PackageTemplate from "viandeendirect_eu/dist/model/PackageTemplate"
import Production from "viandeendirect_eu/dist/model/Production"

export class MockApiProductions {

    getProductions(): Array<Production> {
        const production1 = {
            id: 1,
            productionType: 'BeefProduction',
            producer: undefined,
            lots: undefined,
            sales: undefined
        }

        const production2 = {
            id: 2,
            productionType: 'BeefProduction',
            producer: undefined,
            lots: undefined,
            sales: undefined
        }
        return [production1, production2]
    }
    
    getBeefProduction(): BeefProduction {
        return {
            id: 1,
            slaughterDate: '2023-10-01T10:00:00',
            animalLiveWeight: 450
        }
    }

    getProductionPercentageSold(): number {
        return Math.floor(Math.random() * 100)
    }

    getPackageTemplates(): Array<PackageTemplate> {
        const template1 = {
            id: 1,
            label: 'Le coli tradition',
            description: 'Un coli avec un peu de tout',
            unitPrice: 16.5,
            netWeight: 10,
            photo: undefined
        }
        const template2 = {
            id: 2,
            label: 'Le coli cuisson rapide',
            description: 'Un coli avec surtout des steaks ',
            unitPrice: 16.5,
            netWeight: 10,
            photo: undefined
        }
        const template3 = {
            id: 3,
            label: 'Le petit coli steaks',
            description: 'Un coli avec que des steaks ',
            unitPrice: 16.5,
            netWeight: 5,
            photo: undefined
        }
        return [template1, template2, template3]
    }
}