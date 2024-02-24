import React from 'react'
import { useState } from "react"
import EditIcon from '@mui/icons-material/Edit';
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { FormContainer, TextFieldElement, TextareaAutosizeElement, useForm } from 'react-hook-form-mui';

/**
 * 
 * @param {PackageLot} lot 
 * @returns 
 */
export default function PackageLotConfigurator({ 
    lot: lot, 
    disabled: disabled = false,
    changeQuantitySoldCallback: changeQuantitySoldCallback }) {
    
    const [quantity, setQuantity] = useState<number>(lot.quantity)
    const [editionPopinOpen, setEditionPopinOpen] = useState<boolean>(false)
    const form = useForm({
        defaultValues: {
            label: lot.label,
            description: lot.description,
            netWeight: lot.netWeight,
            unitPrice: lot.unitPrice
        }
    })

    return <div>
        <div className="lot">
            <div className="lot__package">
                <div className="lot__package__name">
                    <span>{lot.label}</span>
                    {displayEditionButton()}
                </div>
                <div className="lot__package__description">{lot.description}</div>
                <div className="lot__package__net-weight">{lot.netWeight} kg</div>
                <div className="lot__package__unit-price">{lot.unitPrice} € <sup>TTC</sup>/kg</div>
            </div>
            {displayRemovePackagesButtons()}
            <div className="lot__summary">
                <div className="lot__summary__package-number">{lot.quantity}</div>
                <div className="lot__summary__label">colis mis en vente</div>
                <div className="lot__summary__total-quantity">{lot.quantity * lot.netWeight} kg</div>
                <div className="lot__summary__total-price">{lot.quantity * lot.netWeight * lot.unitPrice} € <sup>TTC</sup></div>
            </div>
            {displayAddPackagesButtons()}
        </div>
        <Dialog
            open={editionPopinOpen}
            onClose={cancelForm}>
            <FormContainer onSuccess={validForm} formContext={form}>
                <DialogTitle>Caractéristiques du colis</DialogTitle>
                <DialogContent>
                    <TextFieldElement
                        autoFocus
                        validation={{ required: 'Champ obligatoire' }}
                        name="label"
                        label="Nom du colis"
                        fullWidth
                        variant="standard"
                        margin="normal"
                    />
                    <TextareaAutosizeElement
                        validation={{ required: 'Champ obligatoire' }}
                        name="description"
                        label="Description du colis"
                        fullWidth
                        variant="standard"
                        margin="normal"
                    />
                    <TextFieldElement
                        validation={{ required: 'Champ obligatoire' }}
                        name="unitPrice"
                        label="prix au kilo (€/kg)"
                        fullWidth
                        variant="standard"
                        margin="normal"
                        type="number"
                    />
                    <TextFieldElement
                        validation={{ required: 'Champ obligatoire' }}
                        name="netWeight"
                        label="poids net (kg)"
                        fullWidth
                        variant="standard"
                        margin="normal"
                        type="number"
                    />
                </DialogContent>
                <DialogActions>
                    <ButtonGroup>
                        <Button variant="contained" size="small" type="submit">Valider</Button>
                        <Button size="small" onClick={cancelForm}>Annuler</Button>
                    </ButtonGroup>
                </DialogActions>
            </FormContainer>
        </Dialog>
    </div>

    function displayEditionButton() {
        if (!disabled) {
            return <EditIcon className="lot__package__edit" onClick={openEditionPopin} />
        }
    }

    function displayAddPackagesButtons() {
        if (!disabled) {
            return  <div className="lot__quantity-actions-add">
                        <Button variant="contained" onClick={() => addPackages(10)} disabled={disabled}>+10</Button>
                        <Button variant="contained" onClick={() => addPackages(1)} disabled={disabled}> +1</Button >
                    </div>
        }
    }

    function displayRemovePackagesButtons() {
        if (!disabled) {
            return  <div className="lot__quantity-actions-remove">
                        <Button variant="contained" onClick={() => removePackages(10)} disabled={disabled}>-10</Button>
                        <Button variant="contained" onClick={() => removePackages(1)} disabled={disabled}> -1</Button>
                    </div >
        }
    }

    /**
     * @param {number} quantity 
     */
    function addPackages(quantity) {
        lot.quantity += quantity
        changeQuantitySoldCallback()
        setQuantity(lot.quantity)
    }

    /**
     * @param {number} quantity 
     */
    function removePackages(quantity) {
        lot.quantity -= Math.min(quantity, lot.quantity)
        changeQuantitySoldCallback()
        setQuantity(lot.quantity)
    }

    function openEditionPopin() {
        setEditionPopinOpen(true)
    }

    function closeEditionPopin() {
        setEditionPopinOpen(false)
    }

    function cancelForm(formData) {
        form.reset({
            label: lot.label,
            description: lot.description,
            netWeight: lot.netWeight,
            unitPrice: lot.unitPrice
        })
        closeEditionPopin()
    }

    function validForm(formData) {
        lot.label = formData.label
        lot.description = formData.description
        lot.unitPrice = formData.unitPrice
        lot.netWeight = formData.netWeight
        closeEditionPopin()
    }

}