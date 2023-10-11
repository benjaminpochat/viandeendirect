import { useState, useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Typography, Button } from "@mui/material"
import Production from 'viandeendirect_eu/dist/model/Production'

/**
 * 
 * @param {Production} production 
 * @returns 
 */
function ProductionSaleForm(production) {

    const { keycloak, initialized } = useKeycloak()
    const [ productTemplates, setProductTemplates ] = useState([])

    useEffect(() => {
        loadProductTemplates(production.productionType)
    }, [keycloak])

    return <>
        {productTemplates.foreach(productTemplate => {getProductTemplateSelector(productTemplate)})}
    </>

    function loadProductTemplates() {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak)
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getProductTemplates((error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.getProductTemplates called successfully. Returned data: ' + data)
                    setProductTemplates(data)
                }
            })
        }, keycloak)
    }

    function productTemplateSelector(productTemplate) {
        return <></>
    }
}