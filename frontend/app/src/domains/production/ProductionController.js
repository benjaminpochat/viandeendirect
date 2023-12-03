import { useState } from 'react'
import BeefProductionForm from './views/BeefProductionForm'
import PackageLotsCreator from './views/PackageLotsCreator'
import ProductionsList from './views/ProductionsList.tsx'

export default function ProductionController() {

    const BEEF_PRODUCTION_CREATION = 'BEEF_PRODUCTION_CREATION'
    const BEEF_PRODUCTION_PACKAGE_MODIFICATION = 'BEEF_PRODUCTION_PACKAGE_MODIFICATION'
    const PRODUCTIONS_LIST = 'PRODUCTIONS_LIST'

    const [currentAction, setCurrentAction] = useState(PRODUCTIONS_LIST)

    return <>{getContent()}</>

    function getContent() {
        switch (currentAction) {
            case PRODUCTIONS_LIST: return <ProductionsList createBeefProductionCallback={() => setCurrentAction(BEEF_PRODUCTION_CREATION)}></ProductionsList>
            case BEEF_PRODUCTION_CREATION: return <BeefProductionForm callback={(action) => {
                setCurrentAction(action)
            }} />
            case BEEF_PRODUCTION_PACKAGE_MODIFICATION: return <PackageLotsCreator></PackageLotsCreator>
        }
    }
}