# Rackspace Solve

Solve is a Vue.js app that lives on www.rackspace.com/solve

It pulls content from the following endpoints:
  - https://www.rackspace.com/api/thought-leadership?_format=json
  - https://www.rackspace.com/api/thought-leadership-categories?_format=json

Mock data is provided for tests and local development purposes.

## Requirements

NodeJS 10, 11 or 12.

## Getting Started

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

## Versioning

Use the following command to bump current version:

```bash
npm version major | minor | patch
```

For more information on versioning, see http://semver.org/

## Linting

Use the following commands to perform linting:
```bash
# Lint Javascript
npm run lint:js

# Lint Sass
npm run lint:sass
```

## Test Running

Use the following command to run tests:

```bash
npm run test
```

## Other

### Translations
All translations are ran through Drupal.t(). For local development purposes,
Drupal.t() has been mocked in index.html

### Further Vue Documentation
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
