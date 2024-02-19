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
export default function PackageLotConfigurator({ packageLot: packageLot, changeCallback: changeCallback }) {
    const [quantity, setQuantity] = useState<number>(packageLot.quantity)
    const [editionPopinOpen, setEditionPopinOpen] = useState<boolean>(false)
    const form = useForm({
        defaultValues: {
            label: packageLot.label,
            description: packageLot.description,
            netWeight: packageLot.netWeight,
            unitPrice: packageLot.unitPrice
        }
    })

    return <div>
        <div className="lot">
            <div className="lot__package">
                <div className="lot__package__name"><span>{packageLot.label}</span><EditIcon className="lot__package__edit" onClick={openEditionPopin} /></div>
                <div className="lot__package__description">{packageLot.description}</div>
                <div className="lot__package__net-weight">{packageLot.netWeight} kg</div>
                <div className="lot__package__unit-price">{packageLot.unitPrice} € <sup>TTC</sup>/kg</div>
            </div>
            <div className="lot__quantity-actions-remove">
                <Button variant="contained" onClick={() => removePackages(10)}>-10</Button>
                <Button variant="contained" onClick={() => removePackages(1)} > -1</Button>
            </div >
            <div className="lot__summary">
                <div className="lot__summary__package-number">{quantity}</div>
                <div className="lot__summary__label">colis mis en vente</div>
                <div className="lot__summary__total-quantity">{quantity * packageLot.netWeight} kg</div>
                <div className="lot__summary__total-price">{quantity * packageLot.netWeight * packageLot.unitPrice} € <sup>TTC</sup></div>
            </div>
            <div className="lot__quantity-actions-add">
                <Button variant="contained" onClick={() => addPackages(10)}>+10</Button>
                <Button variant="contained" onClick={() => addPackages(1)}> +1</Button >
            </div>
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
                    />
                    <TextFieldElement
                        validation={{ required: 'Champ obligatoire' }}
                        name="netWeight"
                        label="poids net (kg)"
                        fullWidth
                        variant="standard"
                        margin="normal"
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
        //form.reset()
        setEditionPopinOpen(true)
    }

    function closeEditionPopin() {
        setEditionPopinOpen(false)
    }

    function cancelForm(formData) {
        form.reset({
            label: packageLot.label,
            description: packageLot.description,
            netWeight: packageLot.netWeight,
            unitPrice: packageLot.unitPrice
        })
        closeEditionPopin()
    }

    function validForm(formData) {
        packageLot.label = formData.label
        packageLot.description = formData.description
        packageLot.unitPrice = formData.unitPrice
        packageLot.netWeight = formData.netWeight
        changeCallback(packageLot)
        closeEditionPopin()
    }

}