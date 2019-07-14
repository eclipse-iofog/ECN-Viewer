#!/bin/bash

. ./scripts/utils.sh

usage() {
    echo
    echoInfo "Usage: `[PORT=<YOUR_TCP_PORT>] basename $0` [-h, --help] [config-file.json]"
    echoInfo "$0 will start the ECN viewer using the optional config-file.json as default Controller info and PORT environment variable as the web server port"
    echoInfo "Set the environment variable 'NODE_ENV' to 'dev' to use hot reload. NODE_ENV=dev will overwrite the PORT variable, and the application will be served on :3000"
    exit 0
}
if [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]]; then
  usage
fi

if [[ -f "$1" ]]; then
  cp $1 ./src/ControllerProvider/controller.json
else
  cp ./controller_default.json ./src/ControllerProvider/controller.json
fi

(load_nvm && [ $(command -v nvm) == "nvm" ] && nvm use 'lts/*' > /dev/null 2>&1 ) || echo ''

if ! [[ -d  ./node_modules ]] || ! [[ -d ./server/node_modules ]]; then
 npm i
fi

if [[ $NODE_ENV == "dev" ]]; then
  npm run start-dev
else
  echoInfo "Creating an optimized production build..."
  npm run build > /dev/null 2>&1
  echoInfo "Starting web server"
  npm run prod
fi