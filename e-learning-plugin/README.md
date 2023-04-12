# EUNPDC Utilities

A simple Firefox plugin to help us work on the EUNPDC eLearning project.

## Dev Workflow

`web-ext run`

## Release Workflow

- Run `git tag`
- Run `web-ext lint` and `web-ext sign`
- When we get the signed `xpi` file back:
  - Make a Github release with the right version number
  - Upload the `xpi` file to that release
  - Add an entry to `updates.json` pointing to the `xpi` file on Github
  - Deploy `updates.json` to a server we control
  - Build and deploy a human-readable changelog to that same server

```

```
