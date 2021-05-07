#!/bin/bash
IFS=';'
ITEMS=node -p "Object.entries(require('./package.json').volta).map(i => i[0] + '@' + i[1]).join('$IFS')"

for item in ITEMS; do
    echo "Install $item via volta..."
    volta install $item
done