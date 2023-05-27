#!/bin/sh

# Function to stop, pull, and start the server
update_server() {
    echo "Stopping the server..."
    ./flask_server.sh stop

    echo "Pulling the latest code..."
    cd /path/to/spdtest  # Replace with the actual path to the spdtest directory
    git pull

    echo "Starting the server..."
    ./flask_server.sh start
}

# Monitor the repository for changes
while true; do
    git fetch origin

    # Check if there are any changes
    if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
        echo "Changes detected. Updating the server..."
        ./manage.sh stop
        echo "Pulling the latest code..."
        git pull
        ./manage.sh start
    fi

    sleep 60  # Sleep for 1 minute before checking again
done
