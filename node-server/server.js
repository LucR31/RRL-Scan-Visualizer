const express = require("express");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
const DATA_DIR = path.join(__dirname, "data");
app.use("/data", express.static(path.join(__dirname, "data")));

// Get all folders in data/
app.get("/folders", (req, res) => {
  fs.readdir(DATA_DIR, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).json({ error: "Cannot read directory" });

    const folders = files
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    res.json(folders);
  });
});

// Get all JSON files in a selected folder
app.get("/files/:folder", (req, res) => {
  const folderPath = path.join(DATA_DIR, req.params.folder);
  fs.readdir(folderPath, (err, files) => {
    if (err) return res.status(500).json({ error: "Cannot read folder" });

    const jsonFiles = files.filter((file) => file.endsWith(".json"));
    const csvFile = files.find((file) => file.endsWith(".csv")) || null;
    res.json({ jsonFiles, csvFile });
  });
});

app.get("/run-script", (req, res) => {
  const folderName = req.query.folder;

  if (!folderName) {
    return res.status(400).send({ error: "Missing folder parameter" });
  }
  const python = spawn("python3", ["script.py",folderName]);
  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });
  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  python.on("close", (code) => {
    if (code !== 0) {
      console.error("Python error:", errorOutput); // 👈 log real error
      return res.status(500).send({ error: errorOutput || "Python script failed" });
    }
    res.send({ output });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
