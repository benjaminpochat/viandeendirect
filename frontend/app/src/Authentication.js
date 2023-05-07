import { useKeycloak } from '@react-keycloak/web'


function Authentication() {

  const { keycloak, initialized } = useKeycloak()
  
    if(keycloak.authenticated) {
        return  <>
                    <div>bienvenue {keycloak.tokenParsed?.name}</div>
                    <a href="#" onClick={keycloak.logout}>logout</a>     
                </>
    } else {
        return <a href="#" onClick={keycloak.login}>login</a>
    }
}

export default Authentication;
