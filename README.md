<h1 align="center">
  Edge Cloud Network Viewer
  <br>
  <br>
</h1>

<p align="center">
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
</p>

## Requirements

* [Node](https://nodejs.org/en/) >= 10.X
* [NPM](https://www.npmjs.com/) (It will be installed alongside node)

`./bootstrap.sh` will install Node.js and NPM using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)
Note: NVM being a sourced script, you will need to run `nvm use 'lts/*'` after running bootstrap in order to have node set up in your current shell session.

## Usage

Run `./bootstrap.sh` to install required dependencies.
Run `[PORT=<YOUR_TCP_PORT>] ./start.sh [config-file.json]` will bundle the web application and start the web server on the port specified (or 80 by default).

### Bootstrap

The script will look for nvm in your path, if not present it will try to install it. Once nvm is ready, it will use it to switch to Node.js version 10.X (LTS)

Note: NVM being a sourced script, you will need to run `nvm use 'lts/*'` after running bootstrap in order to have node set up in your current shell session.

### Start

The script will use the configuration file passed as argument, or the default config `./controller_default.json`, to bundle the web application. The web application will use the controller information from the config file as its ECN Controller. (This can later on be modified through the web app, using the settings icon on the lateral nav bar.)


The web server will listen on the PORT env variable (or 80 by default).

### Config file

The configuration JSON file contains the informations required to connect to your ECN Controller.
```json
{
  "ip": "127.0.0.1",
  "port": "51121",
  "user": {
    "email": "user@domain.com",
    "password": "#Bugs4Fun"
  }
}
```