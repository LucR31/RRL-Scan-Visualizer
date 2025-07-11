import { populateDropdowns, drawPlot, drawPlot_2 } from './functions.js';

const folderDropdown = document.getElementById('date');
const fileDropdown = document.getElementById('scan');
const xSelect = document.getElementById('xSelect');
const ySelect = document.getElementById('ySelect');

let currentFlag = null; // null means no filtering, plot all data
let csvData = [];       // store CSV data globally for reuse in listeners

// Load folders into dropdown
fetch('/folders')
  .then(res => res.json())
  .then(folders => {
    folders.forEach(folder => {
      folderDropdown.appendChild(new Option(folder, folder));
    });
  });

// When folder is selected, load JSON files and CSV
folderDropdown.addEventListener('change', () => {
  const selectedFolder = folderDropdown.value;
  // Reset dropdowns
  fileDropdown.innerHTML = '<option>None</option>';
  xSelect.innerHTML = '<option>None</option>';
  ySelect.innerHTML = '<option>None</option>';
  csvData = [];
  currentFlag = null; // Reset flag on folder change

  if (selectedFolder) {
    fetch(`/files/${selectedFolder}`)
      .then(res => res.json())
      .then(data => {
        // Populate JSON file dropdown
        data.jsonFiles.forEach(file => {
          fileDropdown.appendChild(new Option(file, file));
        });

        // Load CSV file
        if (data.csvFile) {
          const csvPath = `/data/${selectedFolder}/${data.csvFile}`;
          fetch(csvPath)
            .then(res => res.text())
            .then(csvText => {
              const lines = csvText.split(/\r?\n/);
              const headers = lines[0].split(',');
              csvData = lines.slice(1).map(line => {
                const values = line.split(',');
                const obj = {};
                headers.forEach((header, i) => {
                  obj[header] = values[i];
                });
                return obj;
              });

              populateDropdowns(headers);

              // Plot initially with no flag (all data)
              drawPlot(csvData, currentFlag);

              // Update listeners for dropdowns to replot with currentFlag
              xSelect.addEventListener('change', () => drawPlot(csvData, currentFlag));
              ySelect.addEventListener('change', () => drawPlot(csvData, currentFlag));
            });
        }
      });
  }
});

// When JSON file is selected, update currentFlag and plot positions & CSV
fileDropdown.addEventListener('change', () => {
  const selectedFolder = folderDropdown.value;
  const selectedFile = fileDropdown.value;

  if (selectedFile && selectedFile !== 'None') {
    // Set flag as filename without extension
    currentFlag = selectedFile.replace(/\.[^/.]+$/, "");

    fetch(`/data/${selectedFolder}/${selectedFile}`)
      .then(res => res.json())
      .then(jsonData => {
        const positions = jsonData?.HIPAdata?.profile?.[0]?.positions;
        if (!positions) {
          alert("JSON does not contain 'HIPAdata.profile[0].positions'");
          return;
        }
        // Plot JSON positions
        drawPlot_2(positions);

        // Re-plot CSV data filtered by currentFlag
        if (csvData.length > 0) {
          drawPlot(csvData, currentFlag);
        }
      });
  } else {
    // No JSON file selected, reset flag and plot all CSV data
    currentFlag = null;
    drawPlot_2([]); // optionally clear the second plot or do nothing
    if (csvData.length > 0) {
      drawPlot(csvData, currentFlag);
    }
  }
});
