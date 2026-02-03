import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import path from 'path';
import { execSync } from 'child_process';

export class TestEnvironment {
  private frontendContainer?: StartedTestContainer;
  private backendContainer?: StartedTestContainer;
  private databaseContainer?: StartedTestContainer;
  private keycloakContainer?: StartedTestContainer;
  private network?: string;

  async startup() {
    // Create a dedicated network for our test containers
    this.network = `test-network-${Date.now()}`;

    try {
      execSync(`docker network create ${this.network}`);
    } catch (error) {
      console.log('Network may already exist, continuing...');
    }

    // Start database
    this.databaseContainer = await new GenericContainer('postgres:13-alpine')
      .withNetwork(this.network)
      .withNetworkAliases('database')
      .withExposedPorts(5432)
      .withEnv('POSTGRES_USER', 'testuser')
      .withEnv('POSTGRES_PASSWORD', 'testpass')
      .withEnv('POSTGRES_DB', 'viandeendirect')
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
      .start();

    // Start Keycloak
    this.keycloakContainer = await new GenericContainer('quay.io/keycloak/keycloak:latest')
      .withNetwork(this.network)
      .withNetworkAliases('keycloak')
      .withExposedPorts(8080)
      .withEnv('KEYCLOAK_ADMIN', 'admin')
      .withEnv('KEYCLOAK_ADMIN_PASSWORD', 'admin')
      .withEnv('KC_DB', 'postgres')
      .withEnv('KC_DB_URL', 'jdbc:postgresql://database:5432/keycloak')
      .withEnv('KC_DB_USERNAME', 'testuser')
      .withEnv('KC_DB_PASSWORD', 'testpass')
      .withEnv('KC_HOSTNAME', 'keycloak')
      .withCommand(['start-dev', '--import-realm'])
      .withBindMounts([
        {
          source: path.join(__dirname, '../../identity/realm'),
          target: '/opt/keycloak/data/import'
        }
      ])
      .withWaitStrategy(Wait.forLogMessage('Running the server in development mode'))
      .start();

    // Start backend
    this.backendContainer = await new GenericContainer('viandeendirect-backend:test')
      .withNetwork(this.network)
      .withNetworkAliases('backend')
      .withExposedPorts(8080)
      .withEnv('SPRING_PROFILES_ACTIVE', 'test')
      .withEnv('SPRING_DATASOURCE_URL', 'jdbc:postgresql://database:5432/viandeendirect')
      .withWaitStrategy(Wait.forLogMessage('Started Application in'))
      .start();

    // Start frontend
    this.frontendContainer = await new GenericContainer('viandeendirect-frontend:test')
      .withNetwork(this.network)
      .withNetworkAliases('frontend')
      .withExposedPorts(3000)
      .withEnv('REACT_APP_API_BASE_URL', `http://backend:8080`)
      .withEnv('REACT_APP_KEYCLOAK_URL', `http://keycloak:8080`)
      .withWaitStrategy(Wait.forLogMessage('Compiled successfully'))
      .start();
  }

  async shutdown() {
    try {
      await this.frontendContainer?.stop();
      await this.backendContainer?.stop();
      await this.keycloakContainer?.stop();
      await this.databaseContainer?.stop();

      if (this.network) {
        try {
          execSync(`docker network rm ${this.network}`);
        } catch (error) {
          console.log('Network removal failed, may not exist:', error.message);
        }
      }
    } catch (error) {
      console.error('Error shutting down containers:', error);
    }
  }

  getFrontendUrl(): string {
    if (!this.frontendContainer) {
      throw new Error('Frontend container not started');
    }
    return `http://${this.frontendContainer.getHost()}:${this.frontendContainer.getMappedPort(3000)}`;
  }

  getBackendUrl(): string {
    if (!this.backendContainer) {
      throw new Error('Backend container not started');
    }
    return `http://${this.backendContainer.getHost()}:${this.backendContainer.getMappedPort(8080)}`;
  }
}