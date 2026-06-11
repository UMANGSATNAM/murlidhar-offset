#!/bin/bash
trap 'echo "RECEIVED SIGNAL - NOT DYING" >> /home/z/my-project/dev.log' SIGTERM SIGINT SIGHUP
exec node node_modules/.bin/next dev -p 3000 -H 0.0.0.0
