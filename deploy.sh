#!/bin/bash
ENV_CONTENT=$1
while IFS= read -r line; do
    key="${line=*}"
    value="${line#*=}"
    echo "key = $key"
    echo "value = $value"
    #eval "$key"="$value" # For ash, dash, sh.
    declare "$key"="$value" # For bash, other shells.
done < $1 
echo "username $SSH_USERNAME"
echo "hostname $SSH_HOSTNAME"

