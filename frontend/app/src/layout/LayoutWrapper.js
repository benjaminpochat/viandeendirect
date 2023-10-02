import { useKeycloak } from '@react-keycloak/web'

import AuthenticatedLayout from './AuthenticatedLayout'
import AnonymousLayout from './AnonymousLayout';


function LayoutWrapper() {

    const { keycloak, initialized } = useKeycloak()

    if(process.env.REACT_APP_MOCK_API) {
        return <AuthenticatedLayout/>
    } else {
        return keycloak.authenticated ? <AuthenticatedLayout/> : <AnonymousLayout/>
    }
    
}

export default LayoutWrapper