#!/bin/bash

git pull

docker build -t angular-docker .

docker stop angular-container
docker rm angular-container

docker run --name angular-container -d -p 8000:8000 angular-docker
