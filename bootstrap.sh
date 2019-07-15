#!/bin/bash
#
# *******************************************************************************
#  * Copyright (c) 2019 Edgeworx, Inc.
#  *
#  * This program and the accompanying materials are made available under the
#  * terms of the Eclipse Public License v. 2.0 which is available at
#  * http://www.eclipse.org/legal/epl-2.0
#  *
#  * SPDX-License-Identifier: EPL-2.0
#  *******************************************************************************
#
. ./scripts/utils.sh

usage() {
    prettyTitle "ioFog ECN Viewer Bootstrap"
    echo
    echoInfo "Usage: `basename $0` [-h, --help]"
    echo
    echoInfo "$0 will install all dependencies"
    exit 0
}
if [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]]; then
  usage
fi


OS=$(uname -s | tr A-Z a-z)
NVM_INSTRUCTION_URL="https://github.com/nvm-sh/nvm#install--update-script"

# NVM
help_install_nvm() {
    echoError "We could not automatically install nvm"
    echoInfo "Please follow the installation instructions from here: ${NVM_INSTRUCTION_URL}"
}

set_node_version() {
  echoInfo "====> Setting Node.js version to the latest Long Term Support (LTS) version..."

  nvm install 'lts/*'
  nvm alias default 'lts/*'
}

install_nvm_success() {
    if [[ -z "$(command -v nvm)" ]]; then
        help_install_nvm
        return 1
    else
        echoSuccess "nvm installed!"
        set_node_version
        echo "" 
        return 0
    fi
}

install_nvm() {
    echoInfo "====> Installing nvm..."
    echoInfo "The script clones the nvm repository to ~/.nvm and adds the source line to your profile (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc)"
    echoInfo "Note: If the environment variable XDG_CONFIG_HOME [$XDG_CONFIG_HOME] is present, it will place the nvm files there."

    if [[ "$1" == "windows" ]]; then
        help_install_nvm
        return 1
    fi

    {
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
      load_nvm
      install_nvm_success
      return 0
    } || {
      echoError "Could not install nvm"
      help_install_nvm
      return 1
    }
}

check_nvm() {
  {
      {
          load_nvm
      } || {
        echo "Could not load nvm"
      }
      if [[ -z "$(command -v nvm)" ]]; then
          if [[ "$OSTYPE" == "linux-gnu" ]]; then
              install_nvm "linux"
          elif [[ "$OSTYPE" == "darwin"* ]]; then
              # Mac OSX
              install_nvm "darwin"
          elif [[ "$OSTYPE" == "cygwin" ]]; then
              # POSIX compatibility layer and Linux environment emulation for Windows
              install_nvm "windows"
          elif [[ "$OSTYPE" == "msys" ]]; then
              # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
              install_nvm "windows"
          elif [[ "$OSTYPE" == "win32" ]]; then
              # I'm not sure this can happen.
              install_nvm "windows"
          elif [[ "$OSTYPE" == "freebsd"* ]]; then
              install_nvm "linux"
          else
              help_install_nvm
              return 1
          fi
          return $?
      else
          echoSuccess "nvm found in path!"
          set_node_version
          echo ""
          return 0
      fi
  } || {
      help_install_nvm
      return 1
  }
}

help_install_node() {
  echoError "We could not automatically install node"
  echoInfo "Please follow the installation instructions from here: ${NVM_INSTRUCTION_URL}"
}

check_node() {
  {
      if ! [[ -x "$(command -v node)" ]]; then
        help_install_node
        return 1
      else
          echoSuccess "node found in path!"
          node -v
          echo ""
          return 0
      fi
  } || {
      help_install_node
      return 1
  }
}

prettyHeader "Bootstrapping ioFog ECN Viewer dependencies"

if ! [[ -x "$(command -v curl)" ]]; then
    echoError "curl not found"
    exit 1
fi


if [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echoError "We do not currently support Windows"
    exit 1
fi

check_nvm
nvm_success=$?
check_node
node_success=$?

success=0
echo ""
prettyTitle "Bootstrap Summary:"
if [[ $nvm_success -ne 0 ]]; then
    echoError " ✖️ Node Version Manager" 
    help_install_nvm
    success=1
else
    echoSuccess " ✔️  Node Version Manager"
    echoInfo "Please run: nvm use 'lts/*'"
fi
if [[ $node_success -ne 0  ]]; then
    echoError " ✖️ Node.js" 
    help_install_node
    success=1
else
    echoSuccess " ✔️  Node.js"
fi
exit $success