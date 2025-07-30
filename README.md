# WebApp Main

## 📁 Project Structure

```
webapp-main/
├── node-server/
│   ├── server.js             # Node.js server
│   ├── script.py             # Helper script
│   ├── package.json             
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── .dockerignore       
│   └── public/
│       ├── index.html        # Main frontend page
│       ├── main.js           # Frontend JS logic
│       ├── functions.js      # Extra frontend JS
│       └── style.css         # Styles
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Getting Started

### 1. Start Node.js Server

```bash
cd node-server
docker build -t web-app .
```

```bash
docker run -p 3000:3000 web-app
```

### 2. Add Data

Create a folder called data and add subfolders with date names containing the corresponding experiment data form that day.

```bash
cd node-server
mkdir data
```

