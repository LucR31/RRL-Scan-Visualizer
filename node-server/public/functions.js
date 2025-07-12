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
export function drawPlot(data, flag, extraTraces = []) {
  const xKey = document.getElementById('xSelect').value;
  const yOptions = Array.from(document.getElementById('ySelect').selectedOptions);
  const yKeys = yOptions.map(opt => opt.value);

  const traces = yKeys.map((yKey, i) => {
    const axisName = i === 0 ? 'y' : `y${i + 1}`;
    return {
      x: data.map(row => (flag ? (row.scan === flag ? row[xKey] : null) : row[xKey])),
      y: data.map(row => (flag ? (row.scan === flag ? parseFloat(row[yKey]) : null) : parseFloat(row[yKey]))),
      type: 'lines+markers',
      mode: 'lines',
      name: yKey,
      yaxis:axisName,
      xaxis:'x'
    };
  });

  // Combine CSV and JSON traces
  const allTraces = traces.concat(extraTraces);

  const layout = {
    title: {
      text: `${yKeys.join(', ')}`,
      font: { family: 'sans-serif', size: 20, color: '#030303' },
      xref: 'paper', x: 0.05,
    },
    grid: {
    rows: 2,
    columns: 1,
    pattern: 'independent',
    roworder: 'top to bottom'},
    legend: { orientation: 'h' },
    responsive: true,
    margin: { t: 50, r: 30, b: 50, l: 60 },
    xaxis: { title: xKey || 'X', domain: [0,1], anchor: 'x'},
    yaxis: {
      title: yKeys[0] || 'Y',
      titlefont: { color: 'blue' },
      tickfont: { color: 'blue' , domain: [0.5,1], anchor: 'y'},
    },
    xaxis2: { title: 'Inward',domain: [0,0.5], anchor: 'x2' },
    yaxis2: { title: 'Values',domain: [0,0.5], anchor: 'y2'},
    xaxis3: { title: 'Outward',domain: [0.5,1], anchor: 'x3' },
    yaxis3: {domain: [0,0.5], anchor: 'y3'}
  };

  for (let i = 3; i < yKeys.length; i++) {
    layout[`yaxis${i + 1}`] = {
      title: yKeys[i],
      overlaying: 'y',
      side: 'right',
      position: 1 + 0.05 * (i - 1),
      titlefont: { color: 'green' },
      tickfont: { color: 'green' },
    };
  }
  Plotly.newPlot('plotlyChart', allTraces, layout);
}

//
export function getJsonTraces(positions_i, positions_o, fingerF, sampleRate = 10) {
  const raw_i = positions_i.trim();
  const lines_i = raw_i.split(/\r?\n/);
  const raw_o = positions_o.trim();
  const lines_o = raw_o.split(/\r?\n/);
  const x = [], y1 = [], x2 = [], y2 = [];
  const finger = parseFloat(fingerF[1]);

  for (const line of lines_i) {
    const parts = line.trim().split(/\s+/).map(Number);
    if (parts.length >= 4) {
      x.push(parts[0]);
      y1.push(parts[finger]);
    }
  }
   for (const line of lines_o) {
    const parts = line.trim().split(/\s+/).map(Number);
    if (parts.length >= 4) {
      x2.push(parts[0]);
      y2.push(parts[finger]);
    }
  }
  const xSampled = [], y1Sampled = [], x2Sampled = [], y2Sampled = [];
  for (let i = 0; i < x.length; i += sampleRate) {
    xSampled.push(x[i]);
    y1Sampled.push(y1[i]);
  }
  for (let i = 0; i < x2.length; i += sampleRate) {
    x2Sampled.push(x2[i]);
    y2Sampled.push(y2[i]);
  }

  return [
    { x: xSampled, y: y1Sampled, mode: 'lines', name: 'JSON Y1', type: 'scattergl' ,xaxis: 'x2',yaxis: 'y2'},
    { x: x2Sampled, y: y2Sampled, mode: 'lines', name: 'JSON Y1-REVERSE', type: 'scattergl' ,xaxis: 'x3',yaxis: 'y3'},
     ]
}
