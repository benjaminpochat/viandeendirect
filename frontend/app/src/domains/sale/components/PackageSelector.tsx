import React from 'react'

import { Button } from "@mui/material"

import OrderItem from "viandeendirect_eu/dist/model/OrderItem"
import PackageLot from "viandeendirect_eu/dist/model/PackageLot"

export default function PackageSelector({ lot: lot, orderItems: orderItems, updateItemsCallback: updateItemsCallback }) {

    const quantityOrderedForLot = quantityOrdered(lot)
    const isIncreasePossibleForLot = isIncreaseQuantityPossible(lot, quantityOrderedForLot)
    const isAddToOrderDisplayed = quantityOrderedForLot === 0
        
    return <>
        <div>
            <div>{lot.label}</div>
            <div>{lot.description}</div>
            <span className='icon euro-icon'></span>
            <div>{lot.unitPrice * lot.netWeight} €<sup>TTC</sup></div>
            <div>{lot.unitPrice} €<sup>TTC</sup>/kg</div>
            <span className='icon weight-icon'></span>
            <div>~{lot.netWeight} kg</div>
            {isAddToOrderDisplayed ? getAddToOrderButton() : getChangeQuantityActions()}
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
            <Button variant="outlined" size='small' onClick={() => increaseQuantity(lot, -1)}>-</Button>
            {`${quantityOrderedForLot} coli${quantityOrderedForLot > 1 ? 's' : ''}`}
            <Button variant="contained" size='small' onClick={() => increaseQuantity(lot, 1)} disabled={!isIncreasePossibleForLot}>+</Button>
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

