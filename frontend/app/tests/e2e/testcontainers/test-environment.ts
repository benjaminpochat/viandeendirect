import { TestEnvironment } from './test-container-setup';

let testEnv: TestEnvironment | null = null;

export async function setupTestEnvironment(): Promise<TestEnvironment> {
  if (!testEnv) {
    testEnv = new TestEnvironment();
    await testEnv.startup();
  }
  return testEnv;
}

export async function teardownTestEnvironment(): Promise<void> {
  if (testEnv) {
    await testEnv.shutdown();
    testEnv = null;
  }
}

export function getTestEnvironment(): TestEnvironment {
  if (!testEnv) {
    throw new Error('Test environment not initialized. Call setupTestEnvironment() first.');
  }
  return testEnv;
}