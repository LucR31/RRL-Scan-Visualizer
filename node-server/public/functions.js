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

//
export function drawPlot(data, flag, extraTraces = []) {
  const xKey = document.getElementById("xSelect").value;
  const yOptions = Array.from(
    document.getElementById("ySelect").selectedOptions
  );
  const yKeys = yOptions.map((opt) => opt.value);

  // Prepare main traces (top plot)
  const traces = yKeys.map((yKey, i) => {
    const axisName = i === 0 ? "y" : `y${i + 1}`;
    return {
      x: data.map((row) =>
        flag ? (row.scan === flag ? row[xKey] : null) : row[xKey]
      ),
      y: data.map((row) =>
        flag
          ? row.scan === flag
            ? parseFloat(row[yKey])
            : null
          : parseFloat(row[yKey])
      ),
      type: "scattergl",
      mode: "lines",
      name: yKey,
      xaxis: "x",
      yaxis: axisName,
    };
  });

  const layout = {
    title: {
      text: `${yKeys.join(", ")}`,
      font: { family: "sans-serif", size: 20, color: "#030303" },
      xref: "paper",
      x: 0.05,
    },
    grid: {
      rows: extraTraces.length ? 2 : 1,
      columns: 1,
      pattern: "independent",
      roworder: "top to bottom",
    },
    legend: { orientation: "h" },
    margin: { t: 50, r: 50, b: 50, l: 60 },
    xaxis: {
      title: xKey || "X",
      domain: [0, 1],
      anchor: "y",
    },
    yaxis: {
      title: yKeys[0] || "Y",
      domain: [extraTraces.length ? 0.4 : 0, 1],
      anchor: "x",
    },
  };

  // Extra Y axes on top (overlaid)
  for (let i = 1; i < yKeys.length; i++) {
    layout[`yaxis${i + 1}`] = {
      title: yKeys[i],
      overlaying: "y",
      side: "right",
      position: 1 - i * 0.05,
      domain: [extraTraces.length ? 0.4 : 0, 1],
      anchor: "x",
    };
  }

  // Add bottom plots if extra traces exist
  const topYCount = yKeys.length;
  const bottomAxisStart = topYCount + 1;

  if (extraTraces.length > 0) {
    layout[`xaxis${bottomAxisStart}`] = {
      title: "Inward",
      domain: [0, 0.49],
      anchor: `y${bottomAxisStart}`,
    };
    layout[`yaxis${bottomAxisStart}`] = {
      domain: [0, 0.35],
      anchor: `x${bottomAxisStart}`,
      title: "Values",
    };

    layout[`xaxis${bottomAxisStart + 1}`] = {
      title: "Outward",
      domain: [0.5, 1],
      anchor: `y${bottomAxisStart + 1}`,
    };
    layout[`yaxis${bottomAxisStart + 1}`] = {
      domain: [0, 0.35],
      anchor: `x${bottomAxisStart + 1}`,
    };

    // Update extraTraces to use the correct axis names
    extraTraces[0].xaxis = `x${bottomAxisStart}`;
    extraTraces[0].yaxis = `y${bottomAxisStart}`;
    extraTraces[1].xaxis = `x${bottomAxisStart + 1}`;
    extraTraces[1].yaxis = `y${bottomAxisStart + 1}`;
  }

  Plotly.newPlot("plotlyChart", [...traces, ...extraTraces], layout);
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

  return [
    {
      x: xSampled,
      y: y1Sampled,
      mode: "lines",
      name: "JSON Y1",
      type: "scattergl",
    },
    {
      x: x2Sampled,
      y: y2Sampled,
      mode: "lines",
      name: "JSON Y1-REVERSE",
      type: "scattergl",
    },
  ];
}
