import React from 'react'

import { Button, Fab } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import OrderItem from "viandeendirect_eu/dist/model/OrderItem"
import PackageLot from "viandeendirect_eu/dist/model/PackageLot"

import './PackageSelector.css'

export default function PackageSelector({ lot: lot, orderItems: orderItems, updateItemsCallback: updateItemsCallback }) {

    const quantityOrderedForLot = quantityOrdered(lot)
    const isIncreasePossibleForLot = isIncreaseQuantityPossible(lot, quantityOrderedForLot)
    const isAddToOrderDisplayed = quantityOrderedForLot === 0
        
    return <>
        <div className='package-selector'>
            <div className='package-selector__label'>{lot.label}</div>
            <div className='package-selector__description'>{lot.description}</div>
            <span className='icon euro-icon package-selector__icon'></span>
            <div className='package-selector__total_price'>{lot.unitPrice * lot.netWeight} €<sup>TTC</sup></div>
            <div className='package-selector__unit_price'>({lot.unitPrice} €<sup>TTC</sup>/kg)</div>
            <span className='icon weight-icon package-selector__icon'></span>
            <div className='package-selector__weight'>~{lot.netWeight} kg</div>
            <div className='package-selector__actions'>{isAddToOrderDisplayed ? getAddToOrderButton() : getChangeQuantityActions()}</div>
        </div>
    </>

    function getAddToOrderButton() {
        if (isIncreasePossibleForLot) {
            return <Button variant="contained" size='small' onClick={() => increaseQuantity(lot, 1)}>Ajouter à la commande</Button>
        }
        return <Button variant="contained" size='small' disabled>Tout est vendu</Button>
    }

    function getChangeQuantityActions() {
        return <>
            <Fab color='primary' size='small' onClick={() => increaseQuantity(lot, -1)}><RemoveIcon/></Fab>
            {`${quantityOrderedForLot} coli${quantityOrderedForLot > 1 ? 's' : ''}`}
            <Fab color='primary' size='small' onClick={() => increaseQuantity(lot, 1)} disabled={!isIncreasePossibleForLot}><AddIcon/></Fab>
        </>
    }

    function increaseQuantity(lot: PackageLot, quantityAdded: number) {
        const item: OrderItem = orderItems.find(item => item.packageLot.id === lot.id)
        if (item) {
            item.quantity = item.quantity + quantityAdded
            const newItems = [...orderItems]
            updateItemsCallback(newItems)
        } else {
            const newItem: OrderItem = { packageLot: lot, quantity: quantityAdded, unitPrice: lot.unitPrice }
            const newItems = [...orderItems, newItem]
            updateItemsCallback(newItems)
        }
    }

    function isIncreaseQuantityPossible(lot: PackageLot, quantityOrderedForLot: number): boolean {
        return lot.quantitySold + quantityOrderedForLot < lot.quantity
    }

    function quantityOrdered(lot: PackageLot): number {
        const item: OrderItem = orderItems.find(item => item.packageLot.id === lot.id)
        if (item) {
            return item.quantity
        } else {
            return 0
        }
    }
}

