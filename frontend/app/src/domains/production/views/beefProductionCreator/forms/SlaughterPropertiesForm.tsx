import React from 'react'
import { ButtonGroup, Button } from '@mui/material'
import { DatePickerElement, FormContainer, SliderElement, TextFieldElement, useForm } from 'react-hook-form-mui'

import BeefProduction from "viandeendirect_eu/dist/model/BeefProduction"
import { BeefProductionService } from '../../../service/BeefProductionService.ts'

export default function SlaughterPropertiesForm({
    beefProduction: beefProduction, 
    validFormCallback: validFormCallback, 
    cancelFormCallback: cancelFormCallback }) {

    const form = useForm<BeefProduction>({defaultValues: beefProduction})
    const warmCarcassWeight = form.watch('warmCarcassWeight')


    return <FormContainer onSuccess={validFormCallback} formContext={form}>
        <div className="form">
            <div>
                <DatePickerElement
                    name="slaughterDate"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Date de l'abattage" 
                    minDate={beefProduction.birthDate}/>
            </div>
            <div>
                <TextFieldElement
                    name="slaughterHouse"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Abattoir"
                    variant="standard" />
            </div>
            <div>
                <TextFieldElement
                    name="slaughterPlace"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Commune d'abattage"
                    variant="standard" />
            </div>
            <div>
                <SliderElement
                    name='warmCarcassWeight'
                    label="Poids estimé de l'animal"
                    value={beefProduction.warmCarcassWeight}
                    required
                    max={500}
                    step={10} />
                <div>
                    <span>Poids de l'animal vivant : {BeefProductionService.getLiveWeight(warmCarcassWeight)} kg</span>
                </div>
                <div>
                    <span>Poids de carcasse chaude : {warmCarcassWeight || 0} kg</span>
                </div>
                <div>
                    <span>Quantité de viande : {BeefProductionService.getMeatWeight(warmCarcassWeight)} kg</span>
                </div>
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