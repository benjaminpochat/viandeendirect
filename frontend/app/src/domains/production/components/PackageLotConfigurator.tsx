import React from 'react'
import { useState } from "react"
import EditIcon from '@mui/icons-material/Edit';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

/**
 * 
 * @param {PackageLot} lot 
 * @returns 
 */
export default function PackageLotConfigurator({packageLot: packageLot, changeCallback: changeCallback}) {
    const [quantity, setQuantity] = useState<number>(packageLot.quantity)
    const [editionPopinOpen, setEditionPopinOpen] = useState<boolean>(false)
    const form = useForm({defaultValues: packageLot})

    return <div>
        <div class="lot">
            <div class="lot__package">
                <div class="lot__package__name"><span>{packageLot.label}</span><EditIcon className="lot__package__edit" onClick={openEditionPopin}/></div>
                <div class="lot__package__description">{packageLot.description}</div>
                <div class="lot__package__net-weight">{packageLot.netWeight} kg</div>
                <div class="lot__package__unit-price">{packageLot.unitPrice} € <sup>TTC</sup>/kg</div>
            </div>
            <div class="lot__quantity-actions-remove">
                <Button variant="contained" onClick={() => removePackages(10)}>-10</Button>
                <Button variant="contained" onClick={() => removePackages(1)} > -1</Button>
            </div >
            <div class="lot__summary">
                <div class="lot__summary__package-number">{quantity}</div>
                <div class="lot__summary__label">colis mis en vente</div>
                <div class="lot__summary__total-quantity">{quantity * packageLot.netWeight} kg</div>
                <div class="lot__summary__total-price">{quantity * packageLot.netWeight * packageLot.unitPrice} € <sup>TTC</sup></div>
            </div>
            <div class="lot__quantity-actions-add">
                <Button variant="contained" onClick={() => addPackages(10)}>+10</Button>
                <Button variant="contained" onClick={() => addPackages(1)}> +1</Button >
            </div>
        </div>
        <Dialog
            open={editionPopinOpen}
            onClose={closeEditionPopin}
            PaperProps={{
                component: 'form',
                onSubmit: validForm,
              }}>
            <DialogTitle>Modification du colis</DialogTitle>
            <DialogContent>
                <FormContainer onSuccess={validForm} formContext={form}>
                    <TextFieldElement
                        autoFocus
                        required
                        name="label"
                        label="Nom du colis"
                        fullWidth
                        variant="standard"
                    />
                    <TextFieldElement
                        required
                        name="description"
                        label="Description du colis"
                        fullWidth
                        variant="standard"
                    />
                    <TextFieldElement
                        required
                        name="unitPrice"
                        label="prix au kilo"
                        fullWidth
                        variant="standard"
                    />
                    <TextFieldElement
                        required
                        name="netWeight"
                        label="poids net"
                        fullWidth
                        variant="standard"
                    />
                </FormContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeEditionPopin}>Annuler</Button>
                <Button type="submit">Valider</Button>
            </DialogActions>
        </Dialog>
    </div>

    /**
     * @param {number} quantity 
     */
    function addPackages(quantity) {
        packageLot.quantity += quantity
        setQuantity(packageLot.quantity)
        changeCallback(packageLot)
    }

    /**
     * @param {number} quantity 
     */
    function removePackages(quantity) {
        packageLot.quantity -= Math.min(quantity, packageLot.quantity)
        setQuantity(packageLot.quantity)
        changeCallback(packageLot)
    }

    function openEditionPopin() {
        setEditionPopinOpen(true)
    }

    function closeEditionPopin() {
        setEditionPopinOpen(false)
    }

    function validForm(formData) {
        packageLot.label = formData.label
        packageLot.description = formData.description
        packageLot.unitPrice = formData.unitPrice
        packageLot.netWeight = formData.netWeight
        closeEditionPopin()
    }

}