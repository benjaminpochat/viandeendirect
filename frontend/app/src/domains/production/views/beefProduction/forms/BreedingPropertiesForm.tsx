import React from "react"

import { CheckboxElement, DatePickerElement, FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui'

import dayjs from "dayjs"
import '../../../../../resources/styles/form.css'
import { AnimalTypeUtils } from "../../../../../enum/AnimalTypeUtils.ts"
import { CattleBreedUtils } from "../../../../../enum/CattleBreedUtils.ts"

export function BreedingPropertiesForm({
    form: form, 
    disabled: disabled = false,
    maxBirthDate: maxBirthDate = undefined}) {

    return <>
        <FormContainer formContext={form}>
            <div className="form">
                <div>
                    <DatePickerElement 
                        name="birthDate" 
                        validation={{ required: 'Champ obligatoire' }} 
                        label="Date de naissance"
                        disabled={disabled}
                        maxDate={maxBirthDate ? dayjs(maxBirthDate) : undefined}
                        disableFuture={true}
                        className={disabled ? 'disabled' : ''}/>
                </div>
                <div>
                    <TextFieldElement 
                        name="birthFarm" 
                        validation={{ required: 'Champ obligatoire' }} 
                        label="Ferme de naissance" 
                        variant="standard" 
                        disabled={disabled}
                        className={disabled ? 'disabled' : ''}/>
                </div>
                <div>
                    <TextFieldElement 
                        name="birthPlace" 
                        validation={{ required: 'Champ obligatoire' }} 
                        label="Commune de naissance" 
                        variant="standard" 
                        disabled={disabled}
                        className={disabled ? 'disabled' : ''}/>
                </div>
                <div>
                    <TextFieldElement 
                        name="animalIdentifier" 
                        validation={{ required: 'Champ obligatoire' }} 
                        label="Numéro d'identification de l'animal" 
                        variant="standard" 
                        disabled={disabled}
                        className={disabled ? 'disabled' : ''}/>
                </div>
                <div>
                    <SelectElement 
                        name='animalType'
                        fullWidth
                        validation={{ required: 'Champ obligatoire' }} 
                        label="Type d'animal" 
                        variant="standard" 
                        options={new AnimalTypeUtils().getLabels()}
                        disabled={disabled}
                        className={disabled ? 'disabled' : ''}/>
                </div>
                <div>
                    <SelectElement 
                        name='cattleBreed' 
                        fullWidth
                        validation={{ required: 'Champ obligatoire' }} 
                        label="Race bovine" 
                        variant="standard" 
                        options={new CattleBreedUtils().getLabels()}
                        disabled={disabled}
                        className={disabled ? 'disabled' : ''}/>
                </div>
                <div>
                    <CheckboxElement
                        name='labelRougeCertified' 
                        label="Label rouge"
                        disabled={disabled}
                        className={disabled ? 'disabled' : ''}/>
                </div>
            </div>
        </FormContainer>
    </>
}

export function mapBreedingFormDataToBeefProduction(breedingFormData, beefProduction) {
    return {
        ...beefProduction,
        birthDate: breedingFormData.birthDate,
        birthFarm: breedingFormData.birthFarm,
        birthPlace: breedingFormData.birthPlace,
        animalIdentifier: breedingFormData.animalIdentifier,
        animalType: breedingFormData.animalType,
        cattleBreed: breedingFormData.cattleBreed,
        labelRougeCertified: breedingFormData.labelRougeCertified
    }
}

export default BreedingPropertiesForm