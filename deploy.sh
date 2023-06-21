#!/bin/bash
ENV_CONTENT=$1

while IFS= read -r line; do
    key="${line=*}"
    declare "$key" # For bash, other shells.
done < $1 
echo "username $SSH_USERNAME"
echo "hostname $SSH_HOSTNAME"
echo "port $SSH_PORT"
echo "folder $SSH_PROJECT_FOLDER"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

(
  cd "$DIR/.." # Go to project dir.

  ssh -p $SSH_PORT $SSH_USERNAME@$SSH_HOSTNAME -o StrictHostKeyChecking=no <<-EOF
    cd $SSH_PROJECT_FOLDER
    docker-compose pull
    docker-compose stop
    docker-compose rm -f
    docker-compose up -d
EOF
)