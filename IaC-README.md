# Infrastructure as Code (IaC) Documentation

## Architecture Overview

- **2 Node.js backend containers** (`app1`, `app2`) for high availability
- **MongoDB** (single instance, can be extended to replica set for production)
- **Nginx** as a load balancer (container `nginx-balancer`)
- **Prometheus** for monitoring
- **Grafana** for visualization

## Docker Compose
- All services are described in `docker-compose.yml`
- Nginx config is in `nginx.conf`
- MongoDB data is persisted in a Docker volume

## How to Run
1. Build and start all services:
   ```
   docker compose up -d --build
   ```
2. Access points:
   - App (load balanced): http://localhost:8080
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3001
   - MongoDB: localhost:27017 (from host)

## Best Practices
- Use multiple backend containers for high availability
- Use a load balancer (Nginx) to distribute traffic
- Persist MongoDB data in a volume
- Use environment variables for secrets and configs
- Monitor all components with Prometheus and Grafana

## Issues & Solutions
- **Port conflicts:** Ensure ports 3000, 3001, 8080, 9090, 27017 are free before starting
- **MongoDB single point of failure:** For production, use a MongoDB replica set
- **Scaling:** You can scale backends with `docker compose up --scale app1=2 --scale app2=2`
- **Logs:** Use `docker logs <container>` to debug issues

## Diagram

```
[Client] -> [Nginx:8080] -> [app1:3000]
                          -> [app2:3000]
                |
                v
           [MongoDB:27017]
                |
                v
         [Prometheus, Grafana]
```

---

_This documentation describes the local high-availability infrastructure for your project._
