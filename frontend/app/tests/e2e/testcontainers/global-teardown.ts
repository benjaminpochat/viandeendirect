import { teardownTestEnvironment } from './test-environment';

async function globalTeardown() {
  console.log('Starting test environment teardown...');
  
  try {
    await teardownTestEnvironment();
    console.log('Test environment stopped successfully.');
  } catch (error) {
    console.error('Error during teardown:', error);
    throw error;
  }
}

export default globalTeardown;