import { useState } from 'react'
import CustomersList from './views/CustomersList.tsx'

export default function CustomerController({producer: producer}) {

    const NONE = 'NONE'
    
    const [currentAction, setCurrentAction] = useState(NONE)

    return <>{getContent()}</>

    function getContent() {
        switch (currentAction) {
            case 'NONE': return <CustomersList/>
        }
    }

}
