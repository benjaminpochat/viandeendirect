import { useState } from 'react'
import CustomersList from './CustomersList.tsx'

export default function Customers() {

    const NONE = 'NONE'
    
    const [currentAction, setCurrentAction] = useState(NONE)

    return <>{getContent()}</>

    function getContent() {
        switch (currentAction) {
            case 'NONE': return <CustomersList/>
        }
    }

}
