#!/bin/bash
MONGO=mongod
PIDS=`ps cax | grep $MONGO | grep -o '^[ ]*[0-9]*'`
if [ -z "$PIDS" ]; then
  systemctl start mongodb
fi