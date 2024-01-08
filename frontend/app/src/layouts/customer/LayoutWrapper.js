import { useKeycloak } from '@react-keycloak/web'

export default function CustomerLayoutWrapper() {

    const { keycloak, initialized } = useKeycloak()

    if(process.env.REACT_APP_MOCK_API) {
        return <div>Page client authentifié</div>
    } else {
        return keycloak.authenticated ? <div>Page client authentifié</div> : <div>Page client anonmye</div>
    }
    
}

