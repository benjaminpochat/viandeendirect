import React from 'react'
import { useEffect, useState } from "react"
import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import PackageLot from "viandeendirect_eu/dist/model/PackageLot"
import PackageLotsConfigurator from "../components/PackageLotConfigurator"


export default function PackageLotsCreator() {

    const { keycloak, initialized } = useKeycloak()
    const [packageLots, setPackageLots] = useState([])
    const apiBuilder = new ApiBuilder()

    useEffect(() => {
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
                        setPackageLots(lots)
                    }
                })
            }, keycloak)
        })
    }, [keycloak])

    return <>
        {packageLots.map(lot => <PackageLotsConfigurator packageLot={lot}></PackageLotsConfigurator>)}
    </>

}
