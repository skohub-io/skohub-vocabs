#!/bin/bash
#
###
# Provides:       skohub-vocabs
# Description:    Script to start the skohub-vocabs server.
#                 Use as standalone or in combination with
#                 /etc/init.d/skohub-vocabs.sh.
####

# config
PORT=9006 # the port skohub-vocabs runs at
NAME=skohub-vocabs
NODE_VERSION="v12.16.1"

if [ -n "$(lsof -i:$PORT)" ]; then
   echo "There is already a process running on port $PORT with an unexpectd PID. Cancelling starting."
   exit 1
fi

###
# nothing to change below this line
###
# install and use proper node version
export NVM_DIR="$HOME/.nvm"
[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh # loads nvm
nvm install $NODE_VERSION # makes also sure to use the proper version

cd $HOME/git/$NAME/

###
# nothing to change from here
###

npm install
# start skohub-pubsub
PORT=$PORT npm run listen >> logs/$NAME.log 2>&1 &

# getting the process id of the skohub server and create a pidfile
PID=$(echo $!)
sleep 15 # crucial: wait before all processes are started. Should be improved.
PID_OF_SKOHUB_VOCAB="$(pgrep -P $(pgrep -P $PID))"
if [ $PID_OF_SKOHUB_VOCAB ]; then
      echo $PID_OF_SKOHUB_VOCAB > scripts/$NAME.pid
   else
      echo "Couldn' start $NAME"
      exit 1
   fi
exit 0
