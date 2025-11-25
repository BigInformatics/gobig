# Documentation Docker Commands

## Build the documentation Docker image (with Caddy)
cd documentation
docker build -t gobig-docs:latest .

## Run the documentation container
docker run -d -p 8080:80 --name gobig-docs gobig-docs:latest

## Access the documentation
# Open http://localhost:8080 in your browser

## Stop and remove the container
docker stop gobig-docs
docker rm gobig-docs

## Docker Compose (alternative)
cd documentation
docker compose up -d
docker compose down
