#!/bin/sh

#  deployment script to be used to run in background
# 
#  Created by Christian Dallago on 20160309 

export PATH=$PATH:/usr/local/bin 

if [ $# -ne 1 ]; then
   DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
else
   DIR=$1
fi

echo running frm dir: $DIR
cd $DIR

$DIR/stop.sh

npm install

./node_modules/forever/bin/forever start app.js