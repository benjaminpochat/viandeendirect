import React from 'react'
import { useState } from 'react'

import { Switch, Button } from "@mui/material"
import { AutocompleteElement, FormContainer, TextFieldElement } from 'react-hook-form-mui'

import Customer from "viandeendirect_eu/dist/model/Customer"
import User from "viandeendirect_eu/dist/model/User"

export default function CustomerSelector({ customers: customers, callback: callback }) {

    const [newCustomer, setNewCustomer] = useState<boolean>(false)

    return <>
        <div>
            Client existant
            <Switch onChange={(event) => setNewCustomer(event.target.checked)} />
            Nouveau client
        </div>
        <div>
            {newCustomer ? newCustomerForm() : existingCustomerSelection()}
        </div>
    </>

    function newCustomerForm() {
        return <>
            <FormContainer onSuccess={defineNewCustomer}>
                <div className="form">
                    <div>
                        <TextFieldElement name="lastName" label="Nom" variant="standard" validation={{ required: "Ce champ est obligatoire"}}/>
                    </div>
                    <div>
                        <TextFieldElement name="firstName" label="Prénom" variant="standard" validation={{ required: "Ce champ est obligatoire"}}/>
                    </div>
                    <div>
                        <TextFieldElement name="email" type={'email'} label="email" variant="standard" validation={{ required: "Ce champ est obligatoire", pattern: {value: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/, message: "L'adresse mail doit avoir un format valide"}}}/>
                    </div>
                    <div>
                        <TextFieldElement name="phone" label="Téléphone" variant="standard" validation={{ required: "Ce champ est obligatoire", pattern: {value: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, message: "Le numéro de téléphone doit avoir un format valide"}}}/>
                    </div>
                    <div>
                        <Button type='submit' variant="contained" size="small">Valider</Button>
                    </div>
                </div>
            </FormContainer>
        </>
    }

    function existingCustomerSelection() {
        return <>
            <FormContainer onSuccess={defineExistingCustomer}>
                <div>
                    <AutocompleteElement
                        name="customer"
                        options={customers.map(getCustomerOption)}
                        required
                    />
                </div>
                <div>
                    <Button type='submit' variant="contained" size="small">Valider</Button>
                </div>
            </FormContainer>
        </>

        function getCustomerOption(customer: Customer){
            return {
                id: customer.id,
                label: `${customer.user.lastName} ${customer.user.firstName}`
            }
        }
    }

    function defineNewCustomer(newCustomerFormData: FormData){
        const createdCustomer = new Customer()
        createdCustomer.user = new User()
        createdCustomer.user.lastName = newCustomerFormData['lastName']
        createdCustomer.user.firstName = newCustomerFormData['firstName']
        createdCustomer.user.email = newCustomerFormData['email']
        createdCustomer.user.phone = newCustomerFormData['phone']
        callback(createdCustomer)
    }

    function defineExistingCustomer(existingCustomerFormData: FormData){
        const customerId = existingCustomerFormData['customer'].id
        const selectedCustomer = customers.filter(customer => customer.id === customerId)[0]
        console.log(selectedCustomer)
        callback(selectedCustomer)
    }
}