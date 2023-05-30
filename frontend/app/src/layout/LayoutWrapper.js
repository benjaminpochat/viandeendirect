import { useKeycloak } from '@react-keycloak/web'

import AuthenticatedLayout from './AuthenticatedLayout'
import AnonymousLayout from './AnonymousLayout';


function LayoutWrapper() {

    const { keycloak, initialized } = useKeycloak()

    return keycloak.authenticated ? <AuthenticatedLayout/> : <AnonymousLayout/>
}

export default LayoutWrapper