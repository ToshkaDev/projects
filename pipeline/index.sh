#!/bin/bash

DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

node $DIR/index.js "$@" | $DIR/../node_modules/.bin/bunyan
