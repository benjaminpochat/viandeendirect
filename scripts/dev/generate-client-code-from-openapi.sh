rm -R ./frontend/app/node_modules/.cache
npm run --prefix ./frontend/app generate:api
npm run --prefix ./frontend/app build:api
npm run --prefix ./frontend/app install:api