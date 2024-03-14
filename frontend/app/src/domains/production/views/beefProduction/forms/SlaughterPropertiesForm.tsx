import React from 'react'
import { DatePickerElement, FormContainer, SliderElement, TextFieldElement } from 'react-hook-form-mui'

import { BeefProductionService } from '../../../service/BeefProductionService.ts'
import dayjs from 'dayjs'

export function SlaughterPropertiesForm({
    form: form,
    disabled: disabled = false,
    minSlaughterDate: minSlaughterDate = undefined,
    maxSlaughterDate: maxSlaughterDate = undefined,
    initialWarmCarcassWeight: initialWarmCarcassWeight = 0}) {

    const warmCarcassWeight = form.watch('warmCarcassWeight')

    return <FormContainer formContext={form}>
        <div className="form">
            <div>
                <DatePickerElement
                    name="slaughterDate"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Date de l'abattage" 
                    minDate={minSlaughterDate ? dayjs(minSlaughterDate) : undefined}
                    maxDate={maxSlaughterDate ? dayjs(maxSlaughterDate) : undefined}
                    disabled={disabled}/>
            </div>
            <div>
                <TextFieldElement
                    name="slaughterHouse"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Abattoir"
                    variant="standard" 
                    disabled={disabled}/>
            </div>
            <div>
                <TextFieldElement
                    name="slaughterPlace"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Commune d'abattage"
                    variant="standard" 
                    disabled={disabled}/>
            </div>
            <div>
                <SliderElement
                    name='warmCarcassWeight'
                    label="Poids estimé de l'animal"
                    max={500}
                    step={10} 
                    disabled={disabled}
                    rules={{ required: 'Champ obligatoire' }}/>
                <div>
                    <span>Poids de l'animal vivant : {BeefProductionService.getLiveWeight(warmCarcassWeight || initialWarmCarcassWeight)} kg</span>
                </div>
                <div>
                    <span>Poids de carcasse chaude : {warmCarcassWeight || initialWarmCarcassWeight} kg</span>
                </div>
                <div>
                    <span>Quantité de viande : {BeefProductionService.getMeatWeight(warmCarcassWeight || initialWarmCarcassWeight)} kg</span>
                </div>
            </div>
        </div>
    </FormContainer>
}

export function mapSlaughterFormDataToBeefProduction(slaughterFormData, beefProduction) {
    return {
        ...beefProduction,
        slaughterDate: slaughterFormData.slaughterDate,
        slaughterHouse: slaughterFormData.slaughterHouse,
        slaughterPlace: slaughterFormData.slaughterPlace,
        warmCarcassWeight: slaughterFormData.warmCarcassWeight
    }
}

export default SlaughterPropertiesForm