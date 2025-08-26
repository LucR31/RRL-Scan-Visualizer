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

### 1. Adding Data

Create a folder called data and add subfolders with date names containing the corresponding experiment data form that day.

```bash
cd node-server
mkdir data
```
<b>example:</b> 
```
node-server/
├── data/
│   ├── 05-07-2023  
│   │   ├── data_file.json   
│   │   └── data_file.txt        
│   ├── 05-08-2023             
│   │   ├── data_file.json   
│   │   └── data_file.txt    
```

### 2. Start Node.js Server

#### 2.1 Option 1: Docker

```bash
cd node-server
docker build -t web-app .
```

```bash
docker run -p 3000:3000 web-app
```
#### 2.2 Option 2: manual

<ol>
<li>Install <b>Node.js</b> and <b>npm</b></li>

<li> use npm to install other dependecies:

```bash
cd node-server
npm install
```
</li>
<li> run the web app:

```bash
node server.js
```
</li>

</ol>



