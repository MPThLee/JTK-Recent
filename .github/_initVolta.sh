#!/bin/bash

# For run command below, Install any node version first.
volta install node --verbose

IFS=';'
VOLTA_TOOLS=`node -p "Object.entries(require('./package.json').volta).map(i => i[0] + '@' + i[1]).join('$IFS')"`

for item in $VOLTA_TOOLS; do
    echo "Install $item via volta..."
    volta install $item --verbose
done