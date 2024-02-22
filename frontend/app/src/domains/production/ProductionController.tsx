import React from 'react'
import { useState } from 'react'
import BeefProductionCreator from './views/beefProduction/BeefProductionCreator.tsx'
import PackageLotsCreator from './views/PackageLotsCreator.tsx'
import ProductionsList from './views/ProductionsList.tsx'
import BeefProductionView from './views/beefProduction/BeefProductionView.tsx'

export default function ProductionController() {

    const BEEF_PRODUCTION_CREATION = 'BEEF_PRODUCTION_CREATION'
    const BEEF_PRODUCTION_VIEW = 'BEEF_PRODUCTION_VIEW'
    const PRODUCTIONS_LIST = 'PRODUCTIONS_LIST'

    const [currentAction, setCurrentAction] = useState(PRODUCTIONS_LIST)
    const [context, setContext] = useState(undefined)

    return <>{getContent()}</>

    function getContent() {
        switch (currentAction) {
            case PRODUCTIONS_LIST: return <ProductionsList 
                                                createBeefProductionCallback={() => setCurrentAction(BEEF_PRODUCTION_CREATION)}
                                                viewBeefProductionCallback={(production) => {
                                                    setContext(production)
                                                    setCurrentAction(BEEF_PRODUCTION_VIEW)}}/>
            case BEEF_PRODUCTION_CREATION: return <BeefProductionCreator callback={(action) => {setCurrentAction(action)}} />
            case BEEF_PRODUCTION_VIEW: return <BeefProductionView beefProduction={context} backCallback={() => {
                                                    setCurrentAction(PRODUCTIONS_LIST)
                                                    setContext(undefined)}}/>
        }
    }
}