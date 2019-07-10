#!/bin/bash

usage() {
    echo
    echo "Usage: `basename $0` [-h, --help] [configFile]"
    echo "$0 will start the ECN viewer using the optional configFile as default Controller info"
    echo "Set the environment variable 'NODE_ENV' to 'dev' to use hot reload"
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

if ! [[ -d  ./node_modules ]]; then
 npm i
fi

if [[ $NODE_ENV == "dev" ]]; then
  npm run start-dev
else
  npm start
fi