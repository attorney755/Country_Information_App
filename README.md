# Country Information App Deployment

## Overview

I created this project to demonstrate deploying a static web application using Docker, Docker Compose, and HAProxy as a load balancer. I used two Nginx-based web servers (`web-01` and `web-02`) to serve the application, with HAProxy (`lb-01`) distributing traffic between them to ensure load balancing and high availability.

The application fetches and displays information about countries using the RestCountries API. This API provides comprehensive data about countries, including their flags, capitals, populations, regions, currencies, and languages. The Fetch API is used to make HTTP requests to the RestCountries API, providing a modern and clean way to fetch data in JavaScript.

## Image Details

- **Docker Hub Repository URL:** [attorney755/country-information-app](https://hub.docker.com/r/attorney755/country-information-app)
- **Image Name:** `attorney755/country-information-app`
- **Tag:** `v1`

## API Used

### RestCountries API

The RestCountries API is a free and open-source API that provides information about countries. It is used in this project to fetch data about countries based on the user's input.

#### Why RestCountries API?

- **Comprehensive Data**: The RestCountries API provides a wide range of information about countries, making it a valuable resource for this project.
- **Ease of Use**: The API is easy to use and well-documented, simplifying the integration process.
- **Free and Open Source**: The API is free to use and open source, making it accessible for developers without any cost.
- **Modern and Clean**: The API uses modern web standards and provides a clean and consistent interface for fetching data.

### Fetch API

The Fetch API is used to make HTTP requests to the RestCountries API. It provides a modern and clean way to make HTTP requests in JavaScript, and it is used in this project to fetch data from the RestCountries API.

#### Why Fetch API?

- **Modern and Clean**: The Fetch API provides a modern and clean way to make HTTP requests in JavaScript.
- **Promise-Based**: The Fetch API is promise-based, making it easy to handle asynchronous operations and errors.
- **Built-in**: The Fetch API is built into modern browsers, eliminating the need for additional libraries or dependencies.

## Deployment Steps

### 1. Build and Push the Docker Image

I built the Docker image from the project root to containerize the application, making it easier to deploy and scale.

```sh
docker build -t attorney755/country-information-app:v1 .
```

I logged in to Docker Hub and pushed the image to make it accessible for deployment on any machine with Docker installed.

```sh
docker login
docker push attorney755/country-information-app:v1
```

I did this because containerizing the application ensures consistency across different environments and simplifies the deployment process.

### 2. Configure Docker Compose

I navigated to the `web_infra_lab-master` directory and reviewed the `compose.yml` file, which defines three services:

- **web-01**: An Nginx server at `172.20.0.11`, with ports `2211:22` for SSH and `8080:80` for HTTP.
- **web-02**: An Nginx server at `172.20.0.12`, with ports `2212:22` for SSH and `8081:80` for HTTP.
- **lb-01**: An HAProxy load balancer at `172.20.0.10`, with ports `2210:22` for SSH and `8082:80` for HTTP.

I started all services using Docker Compose to bring up the entire infrastructure defined in the compose file.

```sh
docker compose up -d --build
```

I did this because Docker Compose allows for easy orchestration of multi-container Docker applications, simplifying the setup and management of interconnected services.

### 3. SSH into the Load Balancer and Configure HAProxy

I used SSH to connect to the load balancer to configure HAProxy for distributing traffic between the web servers.

```sh
ssh ubuntu@localhost -p 2210
```

I installed HAProxy to set up the load balancing.

```sh
sudo apt update && sudo apt install -y haproxy
```

I edited the HAProxy configuration to define the load balancing rules.

```sh
sudo nano /etc/haproxy/haproxy.cfg
```

Here is an example configuration I used:

```
global
    daemon
    maxconn 256

defaults
    mode http
    timeout connect 5s
    timeout client 50s
    timeout server 50s

frontend http-in
    bind *:80
    default_backend servers

backend servers
    balance roundrobin
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
    http-response set-header X-Served-By %[srv_name]
```

I restarted HAProxy to apply the changes and ensure the load balancer uses the updated configuration.

```sh
sudo service haproxy restart
```

I did this because configuring HAProxy allows for efficient traffic distribution between multiple servers, improving the application's availability and reliability.

## Testing the Deployment

### 1. Access the Application via Load Balancer

From my host machine, I accessed the application through the load balancer to verify that it is serving traffic correctly.

```sh
curl http://localhost:8082
```

I expected to see the HTML content of my app, confirming that the load balancer is correctly routing requests to the web servers.

### 2. Verify Load Balancing

I ran the following command multiple times to check that the load balancer is distributing traffic between the two web servers.

```sh
curl -I http://localhost:8082
```

I checked the `X-Served-By` header in the response, which should alternate between `web01` and `web02`. This confirms that HAProxy is effectively balancing traffic between both servers.

I did this because verifying load balancing ensures that traffic is distributed evenly across servers, preventing any single server from becoming a bottleneck.

## Notes & Troubleshooting

- If you encounter a port allocation error (e.g., `Bind for 0.0.0.0:8080 failed: port is already allocated`), ensure no other process is using the port or stop any previous containers. I did this because freeing up the port is necessary for the new container to start correctly.
- Make sure your Docker image is pushed to Docker Hub and accessible by the compose file. I did this because the compose file needs to pull the image to deploy the containers.
- If you need to SSH into the web servers for debugging, use the following commands:
  - `ssh ubuntu@localhost -p 2211` (web-01)
  - `ssh ubuntu@localhost -p 2212` (web-02)

I did this because accessing the web servers directly can help diagnose and resolve issues that may not be apparent from the load balancer.

## Summary

- **Docker**: Used to containerize and serve the static app with Nginx, ensuring consistency and ease of deployment.
- **Docker Compose**: Orchestrated the multi-container setup, simplifying the management of interconnected services.
- **HAProxy**: Load balanced requests between two web servers, improving availability and reliability.
- **Testing**: Confirmed both servers are serving traffic via the load balancer, ensuring the setup works as intended.
```

This README file now includes the Docker Hub repository URL, image name, and tags, providing a comprehensive overview of your deployment process and the technologies involved.
