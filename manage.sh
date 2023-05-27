#!/bin/sh

start() {
    # Start Flask server in a screen session
    screen -dmS spdtest bash -c "python3 server.py"
    echo "Flask server started."
}

stop() {
    # Terminate screen session and kill server process
    screen -S spdtest -X quit
    echo "Flask server stopped."
}

if [ "$1" = "start" ]; then
    start
elif [ "$1" = "stop" ]; then
    stop
elif [ "$1" = "restart" ]; then
    stop
    start
else
    echo "Invalid command. Usage: ./script.sh [start|stop|restart]"
    exit 1
fi
