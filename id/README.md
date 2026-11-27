# Riski Andriyanto
Programmer | Backend & Fullstack Developer <br/>
Email: <a href="mailto:me@andrizan.com">me@andrizan.com</a> | GitHub: [github.com/andrizan](https://github.com/andrizan) | LinkedIn: [linkedin.com/in/andrizan](https://linkedin.com/in/andrizan)

---

## KEAHLIAN

### Bahasa Pemrograman
- PHP (Laravel), Go, SQL
- JavaScript / TypeScript (Node.js, Bun.js)

### Framework Frontend
- React, Vue.js, Svelte, SolidJS
- HTML, CSS (Tailwind, Bootstrap)

### Framework Backend
- RESTful API, Hono.js, Laravel, Chi, SQLx, Express.js, WebSocket
- Message queue: RabbitMQ

### Mobile
- React Native, Flutter

### Database & Storage
- MySQL, PostgreSQL, MongoDB, MSSQL, ClickHouse
- Redis / Valkey
- Object storage self-hosted: MinIO (legacy), RustFS, Garage

### DevOps & Tools
- Git, Docker, Podman
- Package manager: pnpm, Composer
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

## PENGALAMAN KERJA

### Senior Engineer – PT Belanja Pasti Indonesia
*Juni 2019 – Sekarang*

Sebagian besar pekerjaan saya ada di ERP internal dan aplikasi perusahaan. Saya juga mengurus server tempat semuanya berjalan.

- Membangun dan memelihara ERP internal. Backend-nya memakai Laravel dan Go, sebagian service berjalan di Hono/Bun, dan frontend-nya memakai React dan Next.js.
- Mengembangkan aplikasi untuk tim internal maupun pelanggan, termasuk sistem chat berbasis REST API dan WebSocket.
- Mengerjakan aplikasi mobile dengan Flutter dan React Native. Saat ini semuanya sedang dimigrasi ke Flutter.
- Memakai RabbitMQ sebagai message queue antar service.
- Menelusuri masalah aplikasi dan melakukan R&D kalau perbaikannya butuh pendekatan lain.

Di sisi infrastruktur:

- Mengelola tiga server bare-metal dengan XCP-ng dan Proxmox: dua untuk VM (satu development, satu production) dan satu untuk cluster Kubernetes Rancher.
- Membangun cluster database production untuk MongoDB dan PostgreSQL.
- Menyiapkan dan memelihara deployment: aplikasi di cluster Kubernetes di-deploy lewat Rancher Fleet, sisanya lewat pipeline GitLab CI biasa.
- Mengumpulkan log dengan Vector lalu mengirimnya ke OpenObserve, sehingga log dari semua service bisa dicari di satu tempat.

### Fullstack Developer – CV Ezatech
*Juni 2018 – Juni 2019*
- Membangun aplikasi web untuk perusahaan swasta dan instansi pemerintah, dengan Ezatech sebagai vendor.
- Mengerjakan backend sekaligus frontend. Proyeknya berupa monolith PHP, ditulis dengan PHP native, CodeIgniter, atau Laravel, dengan jQuery dan AJAX di frontend plus Bootstrap untuk tampilan.
- Deploy dilakukan manual karena belum ada CI/CD.
