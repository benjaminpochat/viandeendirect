import React from 'react'
import { FormContainer, DatePickerElement, TextFieldElement } from 'react-hook-form-mui'

import dayjs from 'dayjs'
import '../../../../../resources/styles/form.css'

export function CuttingPropertiesForm({
    form: form,
    disabled: disabled = false,
    minCuttingDate: minCuttingDate = undefined}) {
    
    return <FormContainer formContext={form}>
        <div className="form">
            <div>
                <DatePickerElement
                    name="cuttingDate"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Date de la découpe" 
                    minDate={minCuttingDate ? dayjs(minCuttingDate) : undefined}
                    disabled={disabled}
                    className={disabled ? 'disabled' : ''}/>
            </div>
            <div>
                <TextFieldElement
                    name="cuttingButcher"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Boucherie"
                    variant="standard"
                    disabled={disabled}
                    className={disabled ? 'disabled' : ''}/>
            </div>
            <div>
                <TextFieldElement
                    name="cuttingPlace"
                    validation={{ required: 'Champ obligatoire' }}
                    label="Commune de la découpe"
                    variant="standard"
                    disabled={disabled}
                    className={disabled ? 'disabled' : ''}/>
            </div>
        </div>
    </FormContainer>
}

export function mapCuttingFormDataToBeefProduction(cuttingFormData, beefProduction) {
    return {
        ...beefProduction,
        cuttingDate: cuttingFormData.cuttingDate,
        cuttingPlace: cuttingFormData.cuttingPlace,
        cuttingButcher: cuttingFormData.cuttingButcher
    }
}

export default CuttingPropertiesForm