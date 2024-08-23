# EUNPDC eLearning

This folder contains the Gatsby source for EUNPDC eLearning [eunpdc-elearning.netlify.app](https://eunpdc-elearning.netlify.app/). If you're new to working on software, you may want to [start here](https://github.com/Peace-Research-Institute-Frankfurt/websites/wiki/How-to-Contribute) instead.

## Prerequisites

- Git
- Node (LTS) + npm

## Local development

- `git pull https://github.com/Peace-Research-Institute-Frankfurt/websites.git`
- `cd ./websites/e-learning`
- `npm install` to install Node dependencies
- `npm run start` to start a live-reloading development server at [localhost:8000](https://localhost:8000)

All React code lives in the `src` directory, all content (including author information, images, structured data, etc.) lives in `content`.

## Deployment

- The `main` branch is deployed to production via Netlify
- Any pull requests against `main` get automatic deploy previews through Netlify
