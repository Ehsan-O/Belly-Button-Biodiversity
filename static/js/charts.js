function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    
  });
}

// Deliverable 1

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var newSample = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleResultArray = newSample.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = sampleResultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleResult.otu_ids
    var otuLabels = sampleResult.otu_labels
    var sampleValues = sampleResult.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0, 10).map(element => `OTU ${element}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
      marker:{
        color: 'cc00ff'
      },
    }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      // font: {color: 'white'},
      title: {
        text:'<b><em>Top 10 Bacteria Cultures Found</em></b>',
        font:{
          family: "Raleway",
          size: 24,
          color: 'blue'
        }
      },
      yaxis: {tickprefix: "<b>", ticksuffix:" </br>"},
      xaxis: {tickprefix: "<b>", ticksuffix:" </br>"},
      paper_bgcolor: '#c1e1f0',
      plot_bgcolor: '#dbffff'

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout, {responsive: true})


    // Deliverable 2

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      type: "scatter",
      mode:'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Bluered"
      }
    }

    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text:'<b><em>Bacteria Cultures Per Sample</em></b>',
        font:{
          family: "Raleway",
          size: 24,
          color: 'blue'
        }
      },
      xaxis: {
        title: '<b>OTU ID</b>',
        tickprefix: "<b>",
        ticksuffix:" </b>"
      },
      yaxis: {
        tickprefix: "<b>",
        ticksuffix:" </b>"
      },
      hovermode:'closest', 
      automargin: true,
      height: 750,
      paper_bgcolor: '#c1e1f0',
      plot_bgcolor: '#ebffff'
    };
    var config = {responsive: true}

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, config)

    // Deliverable 3

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaResultArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResult = metaResultArray[0];

    // 3. Create a variable that holds the washing frequency.
    var washingFreq = parseFloat(metaResult.wfreq);

        // 4. Create the trace for the gauge chart.
        var gaugeData = [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: washingFreq,
            title: {
              text: "Scrubs per Week",
              font: {
                family: "Raleway",
                size: 18,
                color: 'blue'
              }
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
              axis: {
                range: [null, 10],
                nticks: 6
              },
              bar: { color: "darkblue" },
              steps: [
                { range: [0, 2], color: "#cce6ff" },
                { range: [2, 4], color: "#99ceff" },
                { range: [4, 6], color: "#66b5ff" },
                { range: [6, 8], color: "#339cff" },
                { range: [8, 10], color: "#0077e6" }
              ]
            },
            number: {
              font: {
                family: 'Raleway',
                color: 'darkblue'
              }
            }
          }
        ];
        
        // 5. Create the layout for the gauge chart.
        var gaugeLayout = {
          title:{
            text:'<b><em>Belly Button Washing Frequency</em></b>',
            font:{
              family: "Raleway",
              size: 24,
              color: 'blue'
            }

          },
          automargin: true,
          paper_bgcolor: '#c1e1f0',
          plot_bgcolor: '#f2f2f2'
        };
    
        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot('gauge', gaugeData, gaugeLayout, config);

  });
}
