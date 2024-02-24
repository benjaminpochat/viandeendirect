import React, { useState } from 'react'
import PackageLotConfigurator from "../components/PackageLotConfigurator.tsx"
import { BeefProductionService } from '../service/BeefProductionService.ts'
import { Alert } from '@mui/material'


export default function PackageLotsCreator({
    production: production,
    disabled: disabled = false,
    changeQuantitiesCompliancyCallback: changeQuantitiesCompliancyCallback = (isCompliant) => {}}) {

    return <>
        {displayAlerts()}
        {production.lots?.map(lot => <PackageLotConfigurator
            lot={lot}
            disabled={disabled}
            changeQuantitySoldCallback={changeQuantitySold} />)}
    </>

    function displayAlerts() {
        const totalQuantitySold = production.lots?.map(lot => lot.netWeight * lot.quantity).reduce((total, added) => total + added) || 0
        if (!isTotalQuantitySoldLowerThanMeatWeight(totalQuantitySold)) {
            const meatQuantity = BeefProductionService.getMeatWeight(production.warmCarcassWeight)
            return <Alert severity="error">Le poids total des produits préparés ne doit pas dépasser la quantité de viande de l'animal estimée à {meatQuantity} kg.</Alert>
        }
    }

    function isTotalQuantitySoldLowerThanMeatWeight(totalQuantitySoldUpdated) {
        return totalQuantitySoldUpdated < BeefProductionService.getMeatWeight(production.warmCarcassWeight)
    }

    function changeQuantitySold() {
        const totalQuantitySold = production.lots?.map(lot => lot.netWeight * lot.quantity).reduce((total, added) => total + added) || 0
        changeQuantitiesCompliancyCallback(isTotalQuantitySoldLowerThanMeatWeight(totalQuantitySold))
    }
}
