import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'


function Sales() {

  const { keycloak, initialized } = useKeycloak()


  useEffect(() => {
    if(keycloak.authenticated) {
        keycloak.updateToken(30).then(function() {
        var ViandeendirectEu = require('viandeendirect_eu');
        let apiClient = ViandeendirectEu.ApiClient.instance;
        apiClient.authentications['oAuth2ForViandeEnDirect'].accessToken = keycloak.token;
        apiClient.basePath = 'http://localhost:8080'
        var api = new ViandeendirectEu.DefaultApi(apiClient)
        api.getSales().then(function(data) {
            console.log('API called successfully. Returned data: ' + data);
        }, function(error) {
            console.error(error);
        });
        }).catch(function() {
        alert('Failed to refresh token');
        });
    }

  });

  return <></>

}

export default Sales;
