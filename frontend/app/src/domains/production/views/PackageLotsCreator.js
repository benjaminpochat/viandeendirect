import React from 'react'
import { useEffect, useState } from "react"
import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import PackageLot from "viandeendirect_eu/dist/model/PackageLot"
import PackageLotsConfigurator from "../components/PackageLotConfigurator"


export default function PackageLotsCreator({ production: production, changeProductionCallback: changeProductionCallback }) {

    const { keycloak } = useKeycloak()
    const apiBuilder = new ApiBuilder()

    useEffect(() => {
        if (!production.lots) {
            apiBuilder.getAuthenticatedApi(keycloak).then(api => {
                apiBuilder.invokeAuthenticatedApi(() => {
                    api.getPackageTemplates((error, data, response) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log('api.getPackageTemplates called successfully. Returned data: ' + data);
                            const lots = []
                            data.map(template => {
                                let lot = new PackageLot()
                                lot.label = template.label
                                lot.description = template.description
                                lot.unitPrice = template.unitPrice
                                lot.netWeight = template.netWeight
                                lot.quantity = 0
                                lot.quantitySold = 0
                                lots.push(lot)
                            })
                            changeProductionCallback({ ...production, lots: lots })
                        }
                    })
                }, keycloak)
            })
        }
    }, [keycloak])

    return <>
        {production.lots?.map(lot => <PackageLotsConfigurator packageLot={lot} changeCallback={changeLotConfiguration}></PackageLotsConfigurator>)}
    </>

    function changeLotConfiguration(lot) {
        changeProductionCallback({ ...production })
    }
}
