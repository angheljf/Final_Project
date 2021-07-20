/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
 function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }
  // Submit Button handler
  function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
  
    // Select the input value from the form
    var stock = d3.select("#stockInput").node().value;
    console.log(stock);
    var startDate = d3.select("#startDate").node().value;
    console.log(startDate);
    var endDate = d3.select("#endDate").node().value;
    console.log(endDate);
  
    // clear the input value
    d3.select("#stockInput").node().value = "";
    d3.select("#startDate").node().value = "";
    d3.select("#endDate").node().value = "";
  
    // Build the plot with the new stock
    buildPlot(stock, startDate, endDate);
  }
  
  function buildPlot(stock, startDate, endDate) {
    var apiKey = "_JYx4iXZLFyMEQZB59du";
    var url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;
  
    d3.json(url).then(function(data) {
      // Grab values from the response json object to build the plots
      var name = data.dataset.name;
      var stock = data.dataset.dataset_code;
      var startDate = data.dataset.start_date;
      var endDate = data.dataset.end_date;
      var dates = unpack(data.dataset.data, 0);
      var openingPrices = unpack(data.dataset.data, 1);
      var highPrices = unpack(data.dataset.data, 2);
      var lowPrices = unpack(data.dataset.data, 3);
      var closingPrices = unpack(data.dataset.data, 4);
      var volume = unpack(data.dataset.data, 5);
      // Print the names of the columns
      console.log(data.dataset.column_names);
  
      var trace1 = {
        type: "scatter",
        mode: "lines",
        name: name,
        x: dates,
        y: volume,
        line: {
          color: "#17BECF"
        }
      };

  
      var data = [trace1];
  
      var layout = {
        title: `${stock} volume history`,
        xaxis: {
          range: [startDate, endDate],
          type: "date"
        },
        yaxis: {
          autorange: true,
          type: "linear"
        }
      };
  
      Plotly.newPlot("plot2", data, layout);
  
    });
  }
  
  // Add event listener for submit button
  d3.select("#submit").on("click", handleSubmit);
  