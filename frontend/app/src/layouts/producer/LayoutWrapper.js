import { useKeycloak } from '@react-keycloak/web'

import AuthenticatedLayout from './AuthenticatedLayout.tsx'
import AnonymousLayout from './AnonymousLayout.tsx';


export default function ProducerLayoutWrapper() {

    const { keycloak, initialized } = useKeycloak()

    if(process.env.REACT_APP_MOCK_API) {
        return <AuthenticatedLayout/>
    } else {
        return keycloak.authenticated ? <AuthenticatedLayout/> : <AnonymousLayout/>
    }
    
}
