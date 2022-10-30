
let apiKey = 'THXGBDLIBS7FAKC4'
// // replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
// let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${apiKey}`;



let result = []
const handleClick = (symbol) => {
  document.getElementById("search-box").value = symbol;
  console.log(symbol, 'symbol')
  let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}&datatype=csv`;
    fetch(url, {
        method: 'GET',
        mode: 'cors', 
        cache: 'no-cache', 
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer', 
      })
      .then(response =>  response.text())
      .then(data => {
        console.log(data, 'data initially')
        result = data
        console.log(result, 'result')
        createGraph()
      })
      .catch(error => console.log("Error: " + error))
    setTimeout(() => {
      const menu =  document.getElementById('dropdown-content')
      menu.innerHTML  = ''
    }, 1000)
}

// Debounced search box 
let timerId 
let searchBoxDom = document.getElementById('search-box')

const searchForSymbol = (value) => {
  const searchURL =  `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${apiKey}`
  const menu =  document.getElementById('dropdown-content')
  menu.innerHTML  = ''
  console.log( value)
  fetch(searchURL, {
    method: 'GET', 
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer', 
  })
  .then(response =>  response.json())
  .then(data => {
    console.log(data, 'data')
    const menu =  document.getElementById('dropdown-content')
    // const menu = document.createElement('div')
    // menu.classList.add('dropdown-content')
    data.bestMatches.map((item) => {
      const option = document.createElement('a')
      option.innerText = item['1. symbol']
      option.onclick = function() { handleClick(item['1. symbol']) };
      menu.appendChild(option)
    })
    // inputContainer.appendChild(menu)
  })
  .catch(error => console.log("Error: " + error))
}

function debounce(cb, time) {
  let timer
  return function(...args) {
    const context = this
     clearTimeout(timer)
    timer = setTimeout(() => {
      cb.apply(context, args)
    }, time)
  };
}

const handleInputChange = debounce((event) => searchForSymbol(event.target.value), 1000)


// testing the cat line chart
const createGraph = () => {
    let margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
      },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    let parseDate = d3.time.format("%Y%m%d").parse;

    let x = d3.time.scale()
      .range([0, width]);

    let y = d3.scale.linear()
      .range([height, 0]);

    let color = d3.scale.category10();

    let xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    let yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    let line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.price);
      });

    let svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let resultDataParsed = d3.csv.parse(result)
   
    
    let i;
    for(i = 0; i < resultDataParsed.length; i++){
      resultDataParsed[i].date = resultDataParsed[i]['timestamp'];
        delete resultDataParsed[i].timestamp;
        delete resultDataParsed[i].volume;
    }
    console.log( resultDataParsed, 'resultDataParsed2.0')
    let data = resultDataParsed



    color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "date";
    }));

    data.forEach(function(d) {
      console.log(d.date, 'before')
      d.date = new Date(d.date);
      console.log(d.date, 'after')
    });

    let category = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {
            date: d.date,
            price: +d[name]
          };
        })
      };
    });


    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));

    y.domain([
      d3.min(category, function(c) {
        return d3.min(c.values, function(v) {
          return v.price;
        });
      }),
      d3.max(category, function(c) {
        return d3.max(c.values, function(v) {
          return v.price;
        });
      })
    ]);

    let legend = svg.selectAll('g')
      .data(category)
      .enter()
      .append('g')
      .attr('class', 'legend');

    legend.append('rect')
      .attr('x', width - 20)
      .attr('y', function(d, i) {
        return i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return color(d.name);
      });

    legend.append('text')
      .attr('x', width - 8)
      .attr('y', function(d, i) {
        return (i * 20) + 9;
      })
      .text(function(d) {
        return d.name;
      });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("prices");

    let cat = svg.selectAll(".cat")
      .data(category)
      .enter().append("g")
      .attr("class", "cat");

    cat.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
        return line(d.values);
      })
      .style("stroke", function(d) {
        return color(d.name);
      });

    cat.append("text")
      .datum(function(d) {
        return {
          name: d.name,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function(d) {
        // return "translate(" + x(d.value.date) + "," + y(d.value.price) + ")";
        return "translate(" + 12 + "," + y(d.value.price) + ")";
      })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) {
        return d.name;
      });

    let mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    let lines = document.getElementsByClassName('line');

    let mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(category)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return color(d.name);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    // mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    //   .attr('width', width) // can't catch mouse events on a g element
    //   .attr('height', height)
    //   .attr('fill', 'none')
    //   .attr('pointer-events', 'all')
    //   .on('mouseout', function() { // on mouse out hide line, circles and text
    //     d3.select(".mouse-line")
    //       .style("opacity", "0");
    //     d3.selectAll(".mouse-per-line circle")
    //       .style("opacity", "0");
    //     d3.selectAll(".mouse-per-line text")
    //       .style("opacity", "0");
    //   })
    //   .on('mouseover', function() { // on mouse in show line, circles and text
    //     d3.select(".mouse-line")
    //       .style("opacity", "1");
    //     d3.selectAll(".mouse-per-line circle")
    //       .style("opacity", "1");
    //     d3.selectAll(".mouse-per-line text")
    //       .style("opacity", "1");
    //   })
      // under progress
      // .on('mousemove', function() { // mouse moving over canvas
      //   let mouse = d3.mouse(this);
      //   d3.select(".mouse-line")
      //     .attr("d", function() {
      //       let d = "M" + mouse[0] + "," + height;
      //       d += " " + mouse[0] + "," + 0;
      //       return d;
      //     });

      //   d3.selectAll(".mouse-per-line")
      //     .attr("transform", function(d, i) {
      //       console.log(width/mouse[0], d, i, 'd', 'i')
      //       let xDate = x.invert(mouse[0]),
      //           bisect = d3.bisector(function(d) { return d.date; }).right;
      //           idx = bisect(d.values, xDate);
            
      //       let beginning = 0,
      //           end = lines[i].getTotalLength(),
      //           target = null;

      //       while (true){
      //         target = Math.floor((beginning + end) / 2);
      //         pos = lines[i].getPointAtLength(target);
      //         console.log(pos, y, 'pos')
      //         if ((target === end || target === beginning) && pos.x !== mouse[0]) {
      //             break;
      //         }
      //         if (pos.x > mouse[0])      end = target;
      //         else if (pos.x < mouse[0]) beginning = target;
      //         else break; //position found
      //       }
            
      //       d3.select(this).select('text')
      //         .text(y.invert(pos.y).toFixed(2));
              
      //       return "translate(" + mouse[0] + "," + pos.y +")";
      //     });
      // });
    }
// original graph: https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91

