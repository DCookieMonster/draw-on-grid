var byYear;
var byInstitutaion;
var byInstitutaionAndYear;

var degree = ["Bachelor", "Master", "PhD", "Diploma"]
var select_order;
var labelArea = 160;
var legendRectSize = 100;
var legendRectSizeWidth = 300;

var legendSpacing = 5;
var chart,
    width = $('#block_svg').width() / 2.5,
    bar_height = 30,
    height = bar_height * 20;
var rightOffset = width + labelArea + 10;

var div = d3.select("#main_div").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
var legend_div;
var lCol = "men_1";
var rCol = "women_1";
var max = 1;
var normal = 17
var xFrom = d3.scale.linear()
    .range([0, width]);
var xTo = d3.scale.linear()
    .range([0, width]);
var y = d3.scale.ordinal()
    .rangeBands([20, height]);

function tooltop_render(data) {
    side = data.split('_')[0];
    number = +data.split('_')[1];
    return degree[number - 1]
}

var legendY = d3.scale.ordinal()
    .rangeBands([15, legendRectSizeWidth]);


var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y1 = d3.scaleLinear()
    .rangeRound([height, 0]);


var z = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3'].reverse());

var color = d3.scale.ordinal()
    .domain(["1450"])
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3'].reverse());

function render(data) {
    // console.log(data);

    var keys = data.columns.slice(6);
    var keys_men = data.columns.slice(2, 6);

    var e = document.getElementById("select_id");
    var selected_value = e.options[e.selectedIndex].value;
    var tmpData = []
    data.forEach(function(entry) {
        // console.log(entry);
        if (entry.Year == selected_value) {
            tmpData.push(entry)
        }
    });
    data = tmpData

    var chart = d3.select("#main_svg")
        .append('svg')
        .attr('class', 'chart')
        .attr('width', labelArea + width + width)
        .attr('height', height);

    xFrom.domain(d3.extent(data, function(d) {
        // console.log(d);
        return d[lCol];
    }));
    xTo.domain(d3.extent(data, function(d) {

        return d[rCol];
    }));

    y.domain(data.map(function(d) {
        return d.Institutaion;
    }));

    legendY.domain(degree.map(function(d) {
        return d;
    }));

    var yPosByIndex = function(d) {
        return y(d.Institutaion);
    };
    var yPosByIndexPrint = function(d) {
        return y(d.Institutaion) + keys.indexOf(d.key) * 18;
    };
    var yPosByIndexMen = function(d) {
        // console.log(y(d.Institutaion)+keys_men.indexOf(d.key)*18);
        return y(d.Institutaion) + keys_men.indexOf(d.key) * 18;
    };

    var leftBars = chart.selectAll("rect.left")
        .data(data)
        .enter()
        .selectAll("rect.left")
        .data(function(d) {
            return keys.map(function(key) {;
                return {
                    key: key,
                    value: d[key],
                    Institutaion: d.Institutaion
                };
            });
        })
        .enter().append("rect")
        .attr("class", "left")
        .attr("x", function(d) {
            // console.log((width - xFrom((d.value/max)*(width*normal)+50)));
            return (width - (d.value / max) * (width))
            // return (width - xFrom((d.value/max)*(width*normal)+50));
        })

        .attr("y", yPosByIndexPrint)
        .attr("height", y.rangeBand() / 6)
        .attr("fill", function(d) {
            return z(d.key);
        })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(tooltop_render(d.key) + " : " + d.value)
                .style("left", d3.select(this).attr("x") + "px")
                .style("top", (d3.select(this).attr("y") - 8) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });


    leftBars.transition()
        .duration(1000)
        .delay(100)
        .attr("width", function(d) {
            return (d.value / max) * (width)
            //  return xFrom((d.value/max)*width*normal);
        })

    chart.selectAll("text.leftscore")
        .data(data)
        .enter()
        .selectAll("text.leftscore")
        .data(function(d) {
            return keys.map(function(key) {;
                return {
                    key: key,
                    value: d[key],
                    Institutaion: d.Institutaion
                };
            });
        })
        .enter().append("text")
        .attr("x", function(d) {
            return width - (d.value / max) * width - 40
            // return (width - xFrom((d.value/max)*(width*normal)))-30;
        })
        .attr("y", function(d) {
            return y(d.Institutaion) + keys.indexOf(d.key) * 18 + 6;
        })
        .attr("dx", "20")
        .attr("dy", ".36em")
        .attr("text-anchor", "end")
        .attr('class', 'leftscore')
        .text(function(d) {
            if (+d.value > 0) {
                return d.value;
            }
            return ''
        });

    // Middle
    chart.selectAll("text.name")
        .data(data)
        .enter().append("text")
        .attr("x", (labelArea / 2) + width)
        .attr("y", function(d) {
            return y(d.Institutaion) + y.rangeBand() / 3;
        })
        .attr("dy", ".20em")
        .attr("text-anchor", "middle")
        .attr('class', 'name')
        .text(function(d) {
            return d.Institutaion;
        });
    // Right Bars
    var rightBars = chart.selectAll("rect.right")
        .data(data)
        .enter()
        .selectAll("rect.right")
        .data(function(d) {
            return keys_men.map(function(key) {;
                return {
                    key: key,
                    value: d[key],
                    Institutaion: d.Institutaion
                };
            });
        })
        .enter().append("rect")
        .attr("class", "right")
        .attr("x", rightOffset)
        .attr("y", yPosByIndexMen)
        // .attr("height", y.rangeBand())
        .attr("height", y.rangeBand() / 6)
        .attr("fill", function(d) {
            return z(d.key);
        })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(tooltop_render(d.key) + " : " + d.value)
                .style("left", (d3.select(this).attr("x")) + "px")
                .style("top", (d3.select(this).attr("y")-8) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });



    rightBars.transition()
        .duration(1000)
        .delay(100)
        .attr("width", function(d) {
            return (d.value / max) * width

            //  return xFrom((d.value/max)*width*normal);
        });

    chart.selectAll("text.score")
        .data(data)
        .enter()
        .selectAll("text.score")
        .data(function(d) {
            return keys_men.map(function(key) {;
                return {
                    key: key,
                    value: d[key],
                    Institutaion: d.Institutaion
                };
            });
        })
        .enter().append("text")
        .attr("x", function(d) {
            return rightOffset + ((d.value / max) * width) + 40;
        })
        .attr("y", function(d) {
            return y(d.Institutaion) + keys_men.indexOf(d.key) * 18 + 6;
        })
        .attr("dx", -5)
        .attr("dy", ".36em")
        .attr("text-anchor", "end")
        .attr('class', 'score')
        .text(function(d) {
            if (+d.value > 0) {
                return d.value;
            }
            return ''
        });


    chart.append("text").attr("x",width  + labelArea/4 - 105).attr("y", 10).attr("class", "title").text("Women");
    chart.append("text").attr("x", width + labelArea +10 ).attr("y", 10).attr("class", "title").text("Men");
    // chart.append("text").attr("x", width + labelArea / 2 - select_order.length * 3).attr("y", 10).attr("class", "title").text(select_order);

    legend_div = d3.select("#legend_div")
        .append('svg')
        .attr('id', "legend_svg")
        .attr('width', legendRectSizeWidth * 2)
        .attr('height', legendRectSize);

    legend = legend_div.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(0,15)")
        .style("font-size", "12px")

    legend.selectAll('text.legend')
        // .attr('y', )
        .data(degree)
        .enter().append("text")
        // .attr("x", (labelArea / 2) + width)
        .attr('y', 3)

        .attr("x", function(d) {
            return legendY(d) + legendSpacing + 20;
        })
        .attr("dy", ".20em")
        .attr("text-anchor", "middle")
        .attr('class', 'name')
        .text(function(d) {
            return d;
        })
    // .attr("fill", function(d) { return z(d.key); })


    legend.selectAll('circle.legend')
        // .attr('y', )
        .data(degree)
        .enter().append("circle")
        // .attr("x", (labelArea / 2) + width)
        .attr('cy', 0)

        .attr("cx", function(d) {
            return legendY(d) - legendSpacing * 5 + 20;
        })
        .attr("r", "0.4em")
        .style('fill', function(d) {
            return z(d);
        })

    // .text(function(d){return d;})
    // .attr("fill", function(d) { return z(d.key); })
}


function type(d) {
    d["men_1"] = +d["men_1"];
    d["women_1"] = +d["women_1"];
    d["men_2"] = +d["men_2"];
    d["women_2"] = +d["women_2"];
    d["men_3"] = +d["men_3"];
    d["women_3"] = +d["women_3"];
    d["men_4"] = +d["men_4"];
    d["women_4"] = +d["women_4"];
    return d;
}



var years = []

function options(data) {
    byYear = d3.nest()
        .key(function(d) {
            return d.Year
        })
        .rollup(function(d) {
            return {
                men_1: d3.max(d, function(g) {
                    return +g.men_1;
                }),
                men_2: d3.max(d, function(g) {
                    return +g.men_2;
                }),
                men_3: d3.max(d, function(g) {
                    return +g.men_3;
                }),
                men_4: d3.max(d, function(g) {
                    return +g.men_4;
                }),
                women_1: d3.max(d, function(g) {
                    return +g.women_1;
                }),
                women_2: d3.max(d, function(g) {
                    return +g.women_2;
                }),
                women_3: d3.max(d, function(g) {
                    return +g.women_3;
                }),
                women_4: d3.max(d, function(g) {
                    return +g.women_4;
                }),

            }
        }).entries(data);
    // console.log(byYear);
    //


    byInstitutaionAndYear = jQuery.extend(true, [], data);

    draw_bar_chart()

}

function filter(data) {
    clearDiv();
    newData =[]
    data.forEach(function(entry) {
        newEntry = {}
       for (k in entry){
                newEntry[k]=is_choosen_degree(k, entry[k])
       }
       newData.push(newEntry)
    });
    console.log(newData)
    newData.columns= data.columns
    render(newData)
}

$('input[name="order_by"]').on('change', function(e) {
    select_order = document.querySelector('input[name="order_by"]:checked').value;
    if (select_order == 'Year') {
        $("#filter_by").text("Choose Institution")

    }
    else{
        $("#filter_by").text("Choose Year")

    }
    draw_bar_chart()
});

$('input[name="by"]').on('change', function(e) {
    page = document.querySelector('input[name="by"]:checked').value;
    window.location.href = page+".html";
});

$( "#radioBtn" ).click(function() {
  draw_bar_chart()
});

function draw_bar_chart() {

    select_order = document.querySelector('input[name="order_by"]:checked').value;
    // $('#select_id').val(select_order)
    data = jQuery.extend(true, [], byInstitutaionAndYear);

    // console.log(byInstitutaionAndYear);
    data.forEach(function(entry) {
        if (select_order == 'Year') {
            var tmp = entry.Year
            entry.Year = entry.Institutaion
            entry.Institutaion = tmp
        }
    })
    years = []
    data.forEach(function(entry) {
        if ((years.includes(entry.Year)) == false) {
            years.push(entry.Year)
        }
    });
    select = document.getElementById('select_id');
    selected_value = select.value
    $('#select_id').empty();
    for (var i = 0; i < years.length; i++) {
        var opt = document.createElement('option');
        opt.value = years[i];
        opt.innerHTML = years[i];
        select.appendChild(opt);
    }
    if ($("#select_id option[value='" + selected_value + "']").length > 0) {
        $('#select_id').val(selected_value)

    }
    $('#select_id').selectpicker('refresh')

    byInstitutaion = d3.nest()
        .key(function(d) {
            return d.Institutaion
        })
        .rollup(function(d) {
            return {
                men_1: d3.max(d, function(g) {
                    return +g.men_1;
                }),
                men_2: d3.max(d, function(g) {
                    return +g.men_2;
                }),
                men_3: d3.max(d, function(g) {
                    return +g.men_3;
                }),
                men_4: d3.max(d, function(g) {
                    return +g.men_4;
                }),
                women_1: d3.max(d, function(g) {
                    return +g.women_1;
                }),
                women_2: d3.max(d, function(g) {
                    return +g.women_2;
                }),
                women_3: d3.max(d, function(g) {
                    return +g.women_3;
                }),
                women_4: d3.max(d, function(g) {
                    return +g.women_4;
                }),

            }
        }).entries(data);
        max = 1;
    byInstitutaion.forEach(function(entry) {
        for (value in entry.value) {
            if (max < entry.value[value])
                max = entry.value[value];
        }

    })
    max += 2000
    // console.log("MAX => " +max);


    filter(data)
}

function clearDiv() {
    $('#main_svg').remove(); // this is my <div> element
    $('#main_div').append(' <div class="col-lg-12" id="main_svg"></div>');
    $('#legend_svg').remove(); // this is my <div> element

}

function is_choosen_degree(key, value) {
    if (key == 'Year' || key == 'Institutaion')
        return value
    arr_key = key.split('_')
    degree_level = degree[arr_key[1]-1]
    if (degree_remove.indexOf(degree_level) > -1)
        return 0;
    return value

}

var degree_remove = [];

$('input[type="checkbox"]').click(function(){
    if($(this).is(":checked")){
        var index = degree_remove.indexOf(this.value)
        if (index > -1){
            degree_remove.splice(index,1)
        }
    }
    else if($(this).is(":not(:checked)")){
        degree_remove.push(this.value);
    }
    draw_bar_chart()
});

d3.csv("asset/vis1Data.csv", options);
