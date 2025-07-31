# Country Information App Deployment

## Overview

This project demonstrates deploying a static web application using Docker, Docker Compose, and HAProxy as a load balancer. The application is served by two Nginx-based web servers (`web-01` and `web-02`), with HAProxy (`lb-01`) distributing traffic between them.

---

## Deployment Steps

### 1. Build and Push the Docker Image

Build your Docker image from the project root:

```sh
docker build -t attorney755/country-information-app:v1 .
```

Log in to Docker Hub and push the image:

```sh
docker login
docker push attorney755/country-information-app:v1
```

---

### 2. Configure Docker Compose

Navigate to the `web_infra_lab-master` directory and review the `compose.yml` file. It defines three services:

- **web-01**: Nginx server at `172.20.0.11`, ports `2211:22` and `8080:80`
- **web-02**: Nginx server at `172.20.0.12`, ports `2212:22` and `8081:80`
- **lb-01**: HAProxy load balancer at `172.20.0.10`, ports `2210:22` and `8082:80`

Start all services:

```sh
docker compose up -d --build
```

---

### 3. SSH into the Load Balancer and Configure HAProxy

SSH into the load balancer:

```sh
ssh ubuntu@localhost -p 2210
```

Install HAProxy if not already installed:

```sh
sudo apt update && sudo apt install -y haproxy
```

Edit the HAProxy configuration:

```sh
sudo nano /etc/haproxy/haproxy.cfg
```

Example configuration:

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

Restart HAProxy to apply changes:

```sh
sudo service haproxy restart
```

---

## Testing the Deployment

1. **Access the Application via Load Balancer:**

   From your host machine, run:

   ```sh
   curl http://localhost:8082
   ```

   You should see the HTML content of your app.

2. **Verify Load Balancing:**

   Run the following multiple times:

   ```sh
   curl -I http://localhost:8082
   ```

   Check the `X-Served-By` header in the response. It should alternate between `web01` and `web02`, confirming that HAProxy is balancing traffic between both servers.

---

## Notes & Troubleshooting

- If you see a port allocation error (e.g., `Bind for 0.0.0.0:8080 failed: port is already allocated`), ensure no other process is using the port or stop any previous containers.
- Make sure your Docker image is pushed to Docker Hub and accessible by the compose file.
- If you need to SSH into the web servers for debugging:
  - `ssh ubuntu@localhost -p 2211` (web-01)
  - `ssh ubuntu@localhost -p 2212` (web-02)

---

## Summary

- **Docker** is used to containerize and serve the static app with Nginx.
- **Docker Compose** orchestrates the multi-container setup.
- **HAProxy** load balances requests between two web servers.
- **Testing** confirms both servers are serving traffic via the load balancer.

---
