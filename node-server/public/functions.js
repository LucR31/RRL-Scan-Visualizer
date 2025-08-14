//
export function populateDropdowns(keys) {
  const xSelect = document.getElementById("xSelect");
  const ySelect = document.getElementById("ySelect");

  keys.forEach((key) => {
    xSelect.appendChild(new Option(key, key));
    ySelect.appendChild(new Option(key, key));
  });

  // Preselect the first and second column
  if (keys.length > 1) {
    xSelect.value = keys[0];
    ySelect.options[1].selected = true;
  }
}

function splitIntoN(xArr, yArr, baseName, parts = 8) {
  const traces = [];
  const len = xArr.length;
  const partSize = Math.ceil(len / parts);

  for (let i = 0; i < parts; i++) {
    const start = i * partSize;
    const end = Math.min((i + 1) * partSize, len);

    traces.push({
      x: xArr.slice(start, end),
      y: yArr.slice(start, end),
      mode: "lines",
      name: `${baseName} Part ${i + 1}`,
      type: "scatter",
    });
  }
  return traces;
}

export function getmainTraces(data, flag) {
  //returns main traces splited in 8 parts
  const xKey = document.getElementById("xSelect").value;
  const yOptions = Array.from(document.getElementById("ySelect").selectedOptions);
  const yKeys = yOptions.map((opt) => opt.value);

  // Filter data by flag first
  const filteredData = flag ? data.filter(row => row.scan === flag) : data;

  const xArr = filteredData.map(row => row[xKey]);
  const allTraces = [];

  yKeys.forEach((yKey) => {
    const yArr = filteredData.map(row => parseFloat(row[yKey]));

    allTraces.push(...splitIntoN(xArr, yArr, yKey, 8));
  });
  
  return allTraces;
}


export function drawPlot(data, flag, extraTraces = []) {
  const xKey = document.getElementById("xSelect").value;
  const yOptions = Array.from(document.getElementById("ySelect").selectedOptions);
  const yKeys = yOptions.map((opt) => opt.value);

  const xArr = data.map((row) => row[xKey]);
  const mainTraces = [];

  // Slice each Y trace into 8 parts
  yKeys.forEach((yKey) => {
    const yArr = data.map((row) =>
      flag ? (row.scan === flag ? parseFloat(row[yKey]) : null) : parseFloat(row[yKey])
    );
    mainTraces.push(...splitIntoN(xArr, yArr, yKey, 8));
  });

  const allTraces = [...mainTraces, ...extraTraces]; // extras already sliced
  const cols = 2;
  const rows = 4;

  const layout = {
    title: `${yKeys.join(", ")} & Extra Traces`,
    grid: {
      rows:4,
      columns: 2,
      pattern: "independent",
    },
    margin: { t: 50, r: 30, b: 40, l: 50 },
    legend: { orientation: "h" },
  };

  allTraces.forEach((trace, i) => {
    const xa = `xaxis${i + 1}`;
    const ya = `yaxis${i + 1}`;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const xStart = col / cols;
    const xEnd = (col + 1) / cols - 0.1;
    const yStart = 1 - (row + 1) / rows;
    const yEnd = 1 - row / rows - 0.1;

    layout[xa] = {
      anchor: ya,
      domain: [xStart, xEnd],
      title: trace.name,
    };
    layout[ya] = {
      anchor: xa,
      domain: [yStart, yEnd],
    };

    trace.xaxis = `x${i + 1}`;
    trace.yaxis = `y${i + 1}`;
  });

  Plotly.newPlot("plotlyChart", allTraces, layout);
}


//
export function getJsonTraces(
  positions_i,
  positions_o,
  fingerF,
  sampleRate = 10,
) {
  const raw_i = positions_i.trim();
  const lines_i = raw_i.split(/\r?\n/);
  const raw_o = positions_o.trim();
  const lines_o = raw_o.split(/\r?\n/);
  const x = [],
    y1 = [],
    x2 = [],
    y2 = [];
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
  const xSampled = [],
    y1Sampled = [],
    x2Sampled = [],
    y2Sampled = [];
  for (let i = 0; i < x.length; i += sampleRate) {
    xSampled.push(x[i]);
    y1Sampled.push(y1[i]);
  }
  for (let i = 0; i < x2.length; i += sampleRate) {
    x2Sampled.push(x2[i]);
    y2Sampled.push(y2[i]);
  }
  
  const tracesY1 = splitIntoN(xSampled, y1Sampled, "Y1",4);
  const tracesY2 = splitIntoN(x2Sampled, y2Sampled, "Y2 Reverse",4);

  return [...tracesY1, ...tracesY2];
}


export function drawSeparatePlots(mainTraces, extraTraces = []) {
  const container = document.getElementById("multiPlotContainer");
  container.innerHTML = ""; // Clear old plots

  // Two-column grid layout
  container.style.display = "grid";
  container.style.gridTemplateColumns = "1fr 1fr";
  container.style.gap = "10px";

  const total = mainTraces.length;

  for (let i = 0; i < total; i++) {
    // Create a div for each individual plot
    const plotDiv = document.createElement("div");
    plotDiv.id = `plot-${i}`;
    plotDiv.style.width = "100%";
    plotDiv.style.height = "300px";
    container.appendChild(plotDiv);

    const traceMain = {
      ...mainTraces[i],
      name: `Main ${i + 1}`,
      xaxis: "x",
      yaxis: "y", 
    };

    const traceExtra = extraTraces[i]
      ? {
          ...extraTraces[i],
          name: `Extra ${i + 1}`,
          xaxis: "x2",
          yaxis: "y2", 
        }
      : null;

    const layout = {
      title: `Part ${i + 1}`,
      margin: { t: 40, r: 30, b: 40, l: 50 },
      legend: { orientation: "h" },
      xaxis: { title: "Main X", anchor: "y"},
      yaxis: { title: "Main Y", side: "left",anchor: "x",},
    };
    if (traceExtra) {
      layout.xaxis2 = {
        title: "mm",
        overlaying: "x",
        side: "top",
        anchor: "y2",
      };
      layout.yaxis2 = {
        title: "signal(uA)",
        overlaying: "y",
        side: "right",
        anchor: "x2",
      };
    }

    const tracesToPlot = [traceMain];
    if (traceExtra) {
      tracesToPlot.push(traceExtra);
    }

    Plotly.newPlot(plotDiv.id, tracesToPlot, layout);
  }
}

