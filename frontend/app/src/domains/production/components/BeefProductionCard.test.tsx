import renderer from 'react-test-renderer';
import BeefProductionCard from './BeefProductionCard';
import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Production from 'viandeendirect_eu/dist/model/Production';

jest.mock("@react-keycloak/web", () => ({ useKeycloak: mockUseKeycloak }));


function mockUseKeycloak() {
  const token = "A random string that is non zero length";
  const userProfile: KeycloakProfile = {
    username: "test",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
  };
  const realmAccess = { roles: ["user"] };

  const authClient: Keycloak = {
    authenticated: true,
    hasRealmRole(ignored: string) {
      return true;
    },
    hasResourceRole(ignored: string) {
      return true;
    },
    idToken: token,
    profile: userProfile,
    realm: "TestRealm",
    realmAccess,
    refreshToken: token,
    token,
  } as Keycloak;
  return { initialized: true, keycloak: authClient };
}

it('should render without error', () => {

  const production = {
    slaughterDate: '2024-02-01T12:00:00.000',
    warmCarcassWeight: 350
  }

  const component = renderer.create(
    <BeefProductionCard production={production} showActions={undefined} viewBeefProductionCallback={undefined} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  
});