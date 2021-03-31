#!/usr/bin/env sh
#
# Package.sh is a simple script that creates a distribution tarball from the files and folders in this repo that
# we want to ship to customers. These files are defined in 'distro-list.txt'.
#

# Import our helper functions
. scripts/utils.sh

VERSION="2.0.0"

prettyTitle "Edgeworx ioFog ECN Viewer Packaging"
echoInfo "Beginning packaging process"

# echoInfo "Building application bundle"
# npm run build

# This is what we want to call our distro
DISTRO_NAME="eclipse-iofog-ecn-viewer_${VERSION}.tar.gz"
# Clean away any previous distro
if [ -f ${DISTRO_NAME} ]; then
    echoInfo "Removing old Distro file"
    rm ${DISTRO_NAME}
fi

echoInfo "Building production app"
cp controller_default.json src/ControllerProvider/controller.json
npm run build
cp -r build package/
cd package && npm version "${VERSION}" --allow-same-version && cd -

echoInfo "Creating ECN Viewer tarball with name '${DISTRO_NAME}''"

cp LICENSE.md package/LICENSE.md

# Build our archive
tar -czvf ${DISTRO_NAME} \
    --exclude='^#' \
    --exclude="./server/node_modules" \
    --exclude="./node_modules" \
    -T distro-list.txt

if [[ "$1" == "--publish" ]]; then
    npm publish ${DISTRO_NAME} --access public
fi

echoInfo "Distro packaging complete!"