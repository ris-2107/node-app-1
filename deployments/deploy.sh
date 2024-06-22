#!/bin/bash

# Stop and remove existing container
docker stop api-gateway
docker rm api-gateway

# Remove existing image
docker rmi node-gateway-app-img

# Build the new image
docker build --no-cache -t node-gateway-app-img .

# Wait for 5 seconds (adjust as needed)
sleep 10
echo "wait over"

# Run the container with the new image
docker run -d --name api-gateway --network api-a-network -p 8000:8000 \
    -e NODE_ENV=development \
    -e MONGODB_URI="mongodb+srv://db1:2nknGTM21M9BYEwL@api-a-cluster.jhheehg.mongodb.net/?retryWrites=true&w=majority&appName=API-A-CLUSTER" \
    -v "$(pwd)":/usr/src/app \
    node-gateway-app-img
