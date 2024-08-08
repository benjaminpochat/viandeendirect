import {Customer} from "@viandeendirect/api/dist/models/Customer"

export class MockApiCustomers {

    getCustomer(): Customer {
        return {
            id: 1,
            user: {
                id: 1,
                firstName: 'Bob',
                lastName: 'Marcel',
                email: 'bob.marcel@email.eu'
            }
        }
       //return undefined
    }

    createCustomer(customer: Customer): Customer {
        return {...customer, id: 999}
    }

}