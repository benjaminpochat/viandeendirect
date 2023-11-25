import { useState } from "react"
import PackageLot from "viandeendirect_eu/dist/model/PackageLot"
import { Button } from "@mui/material"

/**
 * 
 * @param {PackageLot} lot 
 * @returns 
 */
export function PackageLotsConfigurator({packageLot: packageLot}) {
    const [quantity, setQuantity] = useState(packageLot.quantity)

    return <div>
        <div class="lot">
            <div class="lot__package" onClick="changepackage()">
                <div class="lot__package__name">{packageLot.label}</div>
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
    </div>

    /**
     * @param {number} quantity 
     */
    function addPackages(quantity) {
        packageLot.quantity += quantity
        setQuantity(packageLot.quantity)
    }

    /**
     * @param {number} quantity 
     */
    function removePackages(quantity) {
        packageLot.quantity -= Math.min(quantity, packageLot.quantity)
        setQuantity(packageLot.quantity)
    }

}