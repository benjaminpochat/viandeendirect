import React from "react"

import { Button, ButtonGroup } from "@mui/material"
import { CheckboxElement, DatePickerElement, FormContainer, SelectElement, SubmitHandler, TextFieldElement, useForm } from 'react-hook-form-mui'

import BeefProduction from "viandeendirect_eu/dist/model/BeefProduction"
import dayjs from "dayjs"

export default function BreedingPropertiesForm({
    beefProduction: beefProduction, 
    validFormCallback: validFormCallback, 
    cancelFormCallback: cancelFormCallback }) {

    const animalTypeList = [
        { id: 'BEEF_COW', label: 'vache' },
        { id: 'BEEF_HEIFER', label: 'génisse' },
        { id: 'BEEF_VEAL', label: 'veau' },
        { id: 'BEEF_BULL', label: 'taureau' }
    ]

    const cattleBreedList = [
        { id: 'LIMOUSINE', label: 'limousine' },
        { id: 'CHAROLAISE', label: 'charolaise' }
    ]

    const form = useForm<BeefProduction>({defaultValues: {
        ...beefProduction,
        birthDate: dayjs(beefProduction.birthDate),
        slaughterDate: dayjs(beefProduction.slaughterDate),
        cuttingDate: dayjs(beefProduction.cuttingDate)
    }})

    return <FormContainer onSuccess={validFormCallback} formContext={form}>

        <div className="form">
            <div>
                <DatePickerElement 
                    name="birthDate" 
                    validation={{ required: 'Champ obligatoire' }} 
                    label="Date de naissance"/>
            </div>
            <div>
                <TextFieldElement 
                    name="birthFarm" 
                    validation={{ required: 'Champ obligatoire' }} 
                    label="Ferme de naissance" 
                    variant="standard" />
            </div>
            <div>
                <TextFieldElement 
                    name="birthPlace" 
                    validation={{ required: 'Champ obligatoire' }} 
                    label="Commune de naissance" 
                    variant="standard" />
            </div>
            <div>
                <TextFieldElement 
                    name="animalIdentifier" 
                    validation={{ required: 'Champ obligatoire' }} 
                    label="Numéro d'identification de l'animal" 
                    variant="standard" />
            </div>
            <div>
                <SelectElement 
                    name='animalType'
                    fullWidth
                    validation={{ required: 'Champ obligatoire' }} 
                    label="Type d'animal" 
                    variant="standard" 
                    options={animalTypeList}/>
            </div>
            <div>
                <SelectElement 
                    name='cattleBreed' 
                    fullWidth
                    validation={{ required: 'Champ obligatoire' }} 
                    label="Race bovine" 
                    variant="standard" 
                    options={cattleBreedList}/>
            </div>
            <div>
                <CheckboxElement
                    name='labelRougeCertified' 
                    label="Label rouge"/>
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