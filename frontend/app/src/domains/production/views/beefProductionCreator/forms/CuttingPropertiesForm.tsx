import React from 'react'
import { ButtonGroup, Button } from '@mui/material'
import { FormContainer, DatePickerElement, TextFieldElement, useForm } from 'react-hook-form-mui'

import BeefProduction from "viandeendirect_eu/dist/model/BeefProduction"

export default function CuttingPropertiesForm({
    beefProduction: beefProduction, 
    validFormCallback: validFormCallback, 
    cancelFormCallback: cancelFormCallback}) {

    const form = useForm<BeefProduction>({defaultValues: beefProduction})

    return <FormContainer onSuccess={validFormCallback} formContext={form}>
        <div className="form">
            <div>
                <DatePickerElement
                    name="cuttingDate"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Date de la découpe" 
                    minDate={beefProduction.slaughterDate}/>
            </div>
            <div>
                <TextFieldElement
                    name="cuttingButcher"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Boucherie"
                    variant="standard" />
            </div>
            <div>
                <TextFieldElement
                    name="cuttingPlace"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Commune de la découpe"
                    variant="standard" />
            </div>
            <div>
                <ButtonGroup>
                    <Button type='submit' variant="contained" size="small">Valider</Button>
                    <Button variant="outlined" size="small" onClick={cancelFormCallback}>Abandonner</Button>
                </ButtonGroup>
            </div>
        </div>
    </FormContainer>
}