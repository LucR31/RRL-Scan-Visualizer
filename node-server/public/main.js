let data = [];

    function populateDropdowns(keys) {
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

function drawPlot() {
  const xKey = document.getElementById('xSelect').value;
  const yOptions = Array.from(document.getElementById('ySelect').selectedOptions);
  const yKeys = yOptions.map(opt => opt.value);
  const chartType = document.getElementById('chartType').value;

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


    fetch('/data')
      .then(res => res.json())
      .then(json => {
        data = json;

        const keys = Object.keys(data[0] || {});
        populateDropdowns(keys);
        drawPlot();

        $('#csvTable').DataTable({
          data,
          columns: keys.map(k => ({ title: k, data: k }))
        });

        // Listeners
        document.getElementById('xSelect').addEventListener('change', drawPlot);
        document.getElementById('ySelect').addEventListener('change', drawPlot);
        document.getElementById('chartType').addEventListener('change', drawPlot);
      });