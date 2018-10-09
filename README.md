# Site Index

Generate a site index directory with a yaml spec, setup with [robb-j/node-base](https://github.com/robb-j/node-base/).

## Usage

The app runs on port `3000` in the container and you should mount your `sites.yml` into `/app/web/sites.yml`.

**docker-compose.yml**

```yaml
services:
  site-index:
    image: robbj/site-index:latest
    volumes:
      - ./sites.yml:/app/web/sites.yml
    ports:
      - 3000:3000
```

**sites.yml**

```yaml
pageTitle: Index
sites:
  - link: github.com/robb-j/site-index
    info: Quickly generate a site index using a Yaml spec
```

## Dev Commands

```bash

# Run for development
npm run start

# Update version then builds & pushes a new docker image
# -> uses REGISTRY file & the npm version to tag the image
npm version ... # --help

# Lint the web & test directories
npm run lint

# Run the unit tests
npm test

# Generate coverage
npm run coverage          # outputs to coverage/
npm run coverage-summary  # outputs to terminal

```
