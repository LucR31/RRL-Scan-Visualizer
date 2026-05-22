# RRL Scan Visualizer

## Getting Started

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

### 2. Run the app

### With Docker Compose (recommended)
```bash
docker compose up --build
```

Then open: http://localhost:3000