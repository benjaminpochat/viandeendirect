import Customer from "viandeendirect_eu/dist/model/Customer"

export class MockApiCustomers {
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

    createCustomer(customer: Customer) {
        return {...customer, id: 999}
    }
}