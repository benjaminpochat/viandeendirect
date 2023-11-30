import React from 'react'
import { useState } from 'react'

import { Switch, Autocomplete, TextField, Button } from "@mui/material"
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'

import Customer from "viandeendirect_eu/dist/model/Customer"

export default function CustomerSelector({ callback: callback }) {

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
            <FormContainer onSuccess={callback}>
                <div className="form">
                    <div>
                        <TextFieldElement required name="lastName" label="Nom" variant="standard" />
                    </div>
                    <div>
                        <TextFieldElement required name="firstName" label="Prénom" variant="standard" />
                    </div>
                    <div>
                        <TextFieldElement required name="email" label="email" variant="standard" />
                    </div>
                    <div>
                        <TextFieldElement required name="phone" label="Téléphone" variant="standard" />
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
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={['Bob', 'Bill']}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Client" />}
            />
        </>
    }
}