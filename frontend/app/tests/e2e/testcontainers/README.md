# Testcontainers Integration for Playwright E2E Tests

This directory contains the Testcontainers integration for running Playwright end-to-end tests against isolated Docker containers.

## Overview

The Testcontainers integration provides:

- **Isolated test environment**: Each test run gets its own containers
- **Complete stack testing**: Frontend, backend, database, and Keycloak
- **Reproducible tests**: Consistent environment for every test execution
- **CI/CD friendly**: Perfect for continuous integration pipelines

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Testcontainers Network                   │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│  Frontend   │   Backend   │  Database   │     Keycloak      │
│  Container  │  Container  │  Container  │    Container      │
└─────────────┴─────────────┴─────────────┴───────────────────┘
                                      ▲
                                      │
                                      │
┌─────────────────────────────────────────────────────────────┐
│                        Playwright Tests                      │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Docker installed and running
- Docker Compose
- Node.js 18+
- npm or yarn

## Installation

```bash
# Install Testcontainers dependency
npm install --save-dev testcontainers

# Build test images
npm run test:e2e:containers:build
```

## Running Tests

### With Testcontainers

```bash
# Run tests with containerized environment
npm run test:e2e:containers

# Full build and test
npm run test:e2e:containers:full
```

### Without Testcontainers (local development)

```bash
# Run tests against local environment
npm run test:e2e

# With UI
npm run test:e2e:ui
```

## Configuration Files

- `docker-compose.test.yml`: Docker Compose configuration for test environment
- `test-container-setup.ts`: Testcontainers setup and teardown logic
- `test-environment.ts`: Environment management singleton
- `global-setup.ts`: Global test setup (authentication, etc.)
- `global-teardown.ts`: Global test teardown (cleanup)

## Environment Variables

- `FRONTEND_URL`: URL of the frontend container (set automatically)
- `BACKEND_URL`: URL of the backend container (set automatically)
- `USE_TESTCONTAINERS`: Set to "true" to use Testcontainers

## Test Configuration

The Playwright configuration automatically adapts based on the environment:

- **With Testcontainers**: Uses dynamic container URLs, disables parallel execution
- **Without Testcontainers**: Uses local web server, enables parallel execution

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests with Testcontainers

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 18
    
    - name: Install dependencies
      run: npm ci
    
    - name: Set up Docker
      uses: docker/setup-buildx-action@v2
    
    - name: Build test images
      run: npm run test:e2e:containers:build
    
    - name: Run E2E tests
      run: npm run test:e2e:containers
    
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: test-results/
```

## Debugging Tips

### Common Issues

1. **Container startup timeout**: Increase timeouts in `playwright.config.ts`
2. **Port conflicts**: Ensure no local services are using ports 3000, 8080, 5432, 8081
3. **Authentication failures**: Check Keycloak realm import in `docker-compose.test.yml`
4. **Database connection issues**: Verify database health checks

### Debugging Commands

```bash
# View running containers
docker ps

# View container logs
docker logs <container_id>

# Access container shell
docker exec -it <container_id> /bin/sh

# View network
docker network ls
```

## Best Practices

1. **Keep containers lightweight**: Use alpine-based images when possible
2. **Health checks**: Always include health checks for critical services
3. **Resource limits**: Consider adding resource limits for CI environments
4. **Cleanup**: Ensure proper cleanup in global teardown
5. **Timeouts**: Use appropriate timeouts for container operations

## Troubleshooting

### "Cannot connect to Docker"
- Ensure Docker daemon is running
- Check Docker permissions (`docker ps` should work)
- On Linux, you may need to add your user to the docker group

### "Image not found"
- Run `npm run test:e2e:containers:build` first
- Ensure Docker images are built correctly

### "Port already in use"
- Check for conflicting local services
- Use `lsof -i :3000` to find processes using ports
- Kill conflicting processes or change test port mappings

## Advanced Configuration

### Custom Container Configuration

Modify `test-container-setup.ts` to:
- Add environment variables
- Adjust resource limits
- Configure networking
- Add volume mounts

### Adding More Services

To add additional services:
1. Add service to `docker-compose.test.yml`
2. Update `test-container-setup.ts` to start the new container
3. Configure networking and dependencies
4. Update environment variables as needed

## Performance Optimization

For faster test execution:
- Use cached images where possible
- Reduce container startup time
- Optimize health checks
- Consider using podman as an alternative to Docker

## Security Considerations

- Use test-specific credentials
- Isolate test networks
- Clean up containers after tests
- Avoid using production data in tests

## License

This Testcontainers integration is provided under the same license as the main project.