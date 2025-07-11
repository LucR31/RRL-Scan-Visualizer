import { populateDropdowns, drawPlot, drawPlot_2 } from './functions.js';
let data = [];

const folderDropdown = document.getElementById('date');
const fileDropdown = document.getElementById('scan');
const xSelect = document.getElementById('xSelect');
const ySelect = document.getElementById('ySelect');

// Load folders into dropdown
fetch('/folders')
  .then(res => res.json())
  .then(folders => {
  folders.forEach(folder => {
    folderDropdown.appendChild(new Option(folder, folder));
    });
  });

// When folder is selected, load JSON files
folderDropdown.addEventListener('change', () => {
  const selectedFolder = folderDropdown.value;
  //reset dropdowns
  fileDropdown.innerHTML = '<option>None</option>';
  xSelect.innerHTML = '<option>None</option>';
  ySelect.innerHTML = '<option>None</option>';

  if (selectedFolder) {
    fetch(`/files/${selectedFolder}`)
      .then(res => res.json())
      .then(data => {

          // Populate JSON file dropdown
          data.jsonFiles.forEach(file => {
          fileDropdown.appendChild(new Option(file, file));
          });

          // Show CSV file
          if (data.csvFile) {
                const csvPath = `/data/${selectedFolder}/${data.csvFile}`;
                fetch(csvPath)
                  .then(res => res.text())
                  .then(csvText => {
                    const rows = csvText.trim().split('\n').map(row => row.split(','));
                    const keys = Object.values(rows[0] || {});
                    populateDropdowns(keys);
                    drawPlot(rows);
                // Listeners
                document.getElementById('xSelect').addEventListener('change', drawPlot);
                document.getElementById('ySelect').addEventListener('change', drawPlot);
                });
          }
        });
      }
    })