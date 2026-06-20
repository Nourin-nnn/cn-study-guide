# 🌐 Computer Networks — Interactive Study Guide

An interactive study guide for **Computer Networks** based on **Tanenbaum's Computer Networks (6th Edition)**, built with React.

## 📚 Topics Covered

| Tab | Chapter | Sub-topics |
|-----|---------|-----------|
| 🧱 OSI Model | Ch. 1 | 7 layers, PDUs, devices |
| 🗺️ Network Layer | Ch. 5 | IPv6, Routing (LS/DV/BGP/OSPF), Congestion, QoS, Unicast/Multicast/Broadcast/Anycast, ICMP, ARP, RARP, SDN |
| 🚀 Transport Layer | Ch. 6 | Design Issues, Ports, TCP Setup/Release, TCP Segment, Flow Control, Congestion Control (AIMD), UDP, SCTP, RTP, RTCP, MPLS, QUIC, BBR, DTN |
| 🌐 Application Layer | Ch. 7 | DNS, HTTP/HTTPS (all versions), Email (SMTP/POP3/IMAP), Server Farms, CDN, P2P (BitTorrent, DHT) |
| 📍 IP Addressing | Ch. 5 | Classes A–E, binary analyzer |
| ✂️ Subnetting | Ch. 5 | CIDR, interactive subnet calculator |
| 🔷 Topologies | Ch. 1 | Bus, Star, Ring, Mesh with SVG diagrams |
| 🛡️ Error Detection | Ch. 3 | Parity, CRC, Checksum, Hamming |

## 🚀 Quick Start

### Run locally
```bash
npm install
npm start
```
Opens at `http://localhost:3000`

### Build for production
```bash
npm run build
```

## ☁️ Deploy Free

### Option 1 — Vercel (recommended, 1 click)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project → select repo
3. Click Deploy — live in ~30 seconds ✅

### Option 2 — Netlify
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Build command: `npm run build` | Publish dir: `build`
4. Deploy ✅

### Option 3 — GitHub Pages
```bash
npm install --save-dev gh-pages
```
Add to `package.json`:
```json
"homepage": "https://YOUR_USERNAME.github.io/cn-study-guide",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```
Then run:
```bash
npm run deploy
```

## 🛠️ Tech Stack
- React 18
- Pure inline CSS (no dependencies)
- SVG diagrams
- Zero external libraries

## 📖 Reference
Tanenbaum, A. S., & Wetherall, D. J. (2021). *Computer Networks* (6th ed.). Pearson.

---
Made with ❤️ for CSE undergrads
