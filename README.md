<h1 align="center">
  Edge Cloud Network Viewer
  <br>
  <br>
</h1>

<p align="center">
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
</p>

# Production set up

The ECN-Viewer should be used as a node package with an Express server.
The ECN-Viewer package exposes a function that takes Express as an argument and returns a middleware that will serve the application.

## Install

`npm i @iofog/ecn-viewer`

## Usage

```js
const ecnViewer = require('@iofog/ecn-viewer')
const express = require('express')
...
app.use('/', ecnViewer.middleware(express))
```


# Development set up

This set up will get you going with an Express server that will proxy your requests to the configured ECN Controller, this is currently a work around CORS issues and is only suited for development purposes.

## Requirements

* [Node](https://nodejs.org/en/) >= 10.X
* [NPM](https://www.npmjs.com/) (It will be installed alongside node)

`./bootstrap.sh` will install Node.js and NPM using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)
Note: NVM being a sourced script, a few extra commands are needed in order to be able to use nvm in your current shell session
```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
```

## Usage

Run `./bootstrap.sh` to install required dependencies.
Run `[PORT=<YOUR_TCP_PORT>] ./start.sh [config-file.json]` will bundle the web application and start the web server on the port specified (or 80 by default).

### Bootstrap

The script will look for nvm in your path, if not present it will try to install it. Once nvm is ready, it will use it to switch to Node.js version 10.X (LTS)

Note: NVM being a sourced script, you will need to run `nvm use 'lts/*'` after running bootstrap in order to have node set up in your current shell session.

### Start

The script will use the configuration file passed as argument, or the default config `./controller_dev.json`, to bundle the web application. The web application will use the controller information from the config file as its ECN Controller. (This can later on be modified through the web app, using the settings icon on the lateral nav bar.)


The web server will listen on the PORT env variable (or 80 by default).

### Config file

The configuration JSON file contains the informations required to connect to your ECN Controller.
```json
{
  "ip": "127.0.0.1",
  "port": "51121",
  "dev": true,
  "user": {
    "email": "user@domain.com",
    "password": "#Bugs4Fun"
  }
}
```