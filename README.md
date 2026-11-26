<p align="left">
 <img alt="Profile views" src="https://komarev.com/ghpvc/?username=andrizan&style=flat-square&color=brightgreen&style=flat-square"/>
</p>

# Riski Andriyanto
Programmer | Backend & Fullstack Developer <br/>
Email: <a href="mailto:me@andrizan.com">me@andrizan.com</a> | GitHub: [github.com/andrizan](https://github.com/andrizan) | LinkedIn: [linkedin.com/in/andrizan](https://linkedin.com/in/andrizan)

---

## CORE COMPETENCIES

### Languages
- PHP (Laravel), Go, SQL
- JavaScript / TypeScript (Node.js, Bun.js)

### Frontend Frameworks
- React, Vue.js, Svelte, SolidJS
- HTML, CSS (Tailwind, Bootstrap)

### Backend Frameworks
- RESTful API, Hono.js, Laravel, Chi, SQLx, Express.js, WebSocket
- Message queue: RabbitMQ

### Mobile
- React Native, Flutter

### Databases & Storage
- MySQL, PostgreSQL, MongoDB, MSSQL, ClickHouse
- Redis / Valkey
- Self-hosted object storage: MinIO (legacy), RustFS, Garage

### DevOps & Tools
- Git, Docker, Podman
- CI/CD (GitLab CI, GitHub Actions)
- Kubernetes, Rancher, Rancher Fleet
- Observability: Vector, OpenObserve
- Postman, Yaak
- IDE: VS Code, Zed

### Cloud & Deployment
- VPS, Google Cloud, Digitalocean, Cloudflare
- Self-hosting: XCP-ng, Proxmox
- Nginx, systemd, Netplan, PM2

---

## WORK EXPERIENCE

### Senior Engineer – PT Belanja Pasti Indonesia
*June 2019 – Present*

Most of my time goes into the internal ERP and the company's apps. I also look after the servers they run on.

- Build and maintain the internal ERP. The backend runs on Laravel and Go, with some services on Hono/Bun, and the frontends use React and Next.js.
- Develop apps for both internal teams and customers, including a chat system built on a REST API and WebSocket.
- Work on the mobile apps in Flutter and React Native. We're now moving all of them to Flutter.
- Use RabbitMQ to queue work between services.
- Track down application issues and do R&D when a fix needs a different approach.

On the infrastructure side:

- Manage three bare-metal servers on XCP-ng and Proxmox: two host VMs (one for development, one for production), and one runs the Rancher Kubernetes cluster.
- Built the production database clusters for MongoDB and PostgreSQL.
- Set up and maintain deployments: apps on the Kubernetes cluster go out through Rancher Fleet, and everything else through plain GitLab CI pipelines.
- Collect logs with Vector and send them to OpenObserve, so logs from every service can be searched in one place.

### Fullstack Developer – CV Ezatech
*June 2018 – June 2019*
- Built web applications for private companies and government agencies, with Ezatech as the vendor.
- Handled both the backend and the frontend. The stack was a Laravel monolith with jQuery and AJAX on the frontend, styled with Bootstrap.
- Deployed releases by hand, since there was no CI/CD in place.
