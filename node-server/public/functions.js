//
export function populateDropdowns(keys) {
  const xSelect = document.getElementById('xSelect');
  const ySelect = document.getElementById('ySelect');

  keys.forEach(key => {
    xSelect.appendChild(new Option(key, key));
    ySelect.appendChild(new Option(key, key));
  });

  // Preselect the first and second column
  if (keys.length > 1) {
    xSelect.value = keys[0];
    ySelect.options[1].selected = true;
  }
}

//

export function drawPlot(data) {
  const xKey = document.getElementById('xSelect').value;
  const yOptions = Array.from(document.getElementById('ySelect').selectedOptions);
  const yKeys = yOptions.map(opt => opt.value);
  const chartType = "markers";

  const traces = yKeys.map((yKey, i) => {
    const axisName = i === 0 ? 'y' : `y${i + 1}`;
    return {
      x: data.map(row => row[xKey]),
      y: data.map(row => parseFloat(row[yKey])),
      type: chartType === 'markers' ? 'scatter' : chartType,
      mode: chartType === 'scatter' ? 'lines+markers' : undefined,
      name: yKey,
      yaxis: axisName
    };
  });

  // Build layout with dynamic y-axes
  const layout = {
    title: {text:`${yKeys.join(', ')}`,
            font: {
                  family: 'sans-serif',
                  size: 20,
                  color:' #030303'
                  },   
            xref: 'paper',
            x: 0.05,
          },
    xaxis: { title: xKey },
    legend: { orientation: 'h' },
    responsive: true
  };

  // Primary y-axis
  layout.yaxis = {
    title: yKeys[0],
    titlefont: { color: 'blue' },
    tickfont: { color: 'blue' }
  };

  // Add extra y-axes dynamically (y2, y3, ...)
  for (let i = 1; i < yKeys.length; i++) {
    const axisId = `yaxis${i + 1}`; // yaxis2, yaxis3...
    layout[axisId] = {
      title: yKeys[i],
      overlaying: 'y',
      side: 'right',
      position: 1 + 0.05 * (i - 1), // Spread axes slightly to the right
      titlefont: { color: 'green' },
      tickfont: { color: 'green' }
    };
  }

  Plotly.newPlot('plotlyChart', traces, layout);
}

//

export function drawPlot_2(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const jsonData = JSON.parse(e.target.result);
      if (!jsonData.HIPAdata.profile[0].positions) {
        alert("JSON does not contain 'positions' field.");
        return;
      }

      // Trim and split multiline string
      const raw = jsonData.HIPAdata.profile[0].positions.trim();
      const lines = raw.split(/\r?\n/);
      console.log(raw)
      const x = [], y1 = [], y2 = [], y3 = [];

      for (const line of lines) {
        const parts = line.trim().split(/\s+/).map(Number);
        if (parts.length >= 4) {
          x.push(parts[0]);
          y1.push(parts[1]);
          y2.push(parts[2]);
          y3.push(parts[3]);
        }
      }

      // Downsample large data for performance
      const sampleRate = 10; // Adjust this as needed
      const xSampled = [], y1Sampled = [], y2Sampled = [], y3Sampled = [];
      for (let i = 0; i < x.length; i += sampleRate) {
        xSampled.push(x[i]);
        y1Sampled.push(y1[i]);
        y2Sampled.push(y2[i]);
        y3Sampled.push(y3[i]);
      }

      const traces = [
        { x: xSampled, y: y1Sampled, mode: 'lines', name: 'Y1', type: 'scattergl' },
        { x: xSampled, y: y2Sampled, mode: 'lines', name: 'Y2', type: 'scattergl' },
        { x: xSampled, y: y3Sampled, mode: 'lines', name: 'Y3', type: 'scattergl' },
      ];

      Plotly.newPlot('plot', traces, {
        title: 'Plot from JSON String positions',
        xaxis: { title: 'X' },
        yaxis: { title: 'Values' },
        margin: { t: 50, r: 30, b: 50, l: 60 },
      });
    } catch (err) {
      alert("Error parsing JSON or plotting: " + err.message);
    }
  };
  reader.readAsText(file);
};