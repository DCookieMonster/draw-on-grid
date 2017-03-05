var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 1300 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;
var legend_div;
var legendRectSize = 100;
var legendRectSizeWidth = 300;
var byInstitutaionAndYear;
var legendSpacing = 5;
var leftpadding = 120;
var x = d3.scale.linear()
    .range([0, width]);

var xt = d3.scale.linear()
    .range([0, width / 1.5]);

var y1 = d3.scale.ordinal();

var legendY = d3.scale.ordinal()
    .rangeBands([15, legendRectSizeWidth]);


var y0 = d3.scale.ordinal()
    .rangeRoundBands([height, 0], 0.1);

var div = d3.select("#main_div").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format(".2s"));

function tooltop_render(data) {
    side = data.split('_')[0];
    number = +data.split('_')[1];
    return degree[number - 1] + " - " + side
}

var yAxis = d3.svg.axis()
    .scale(y0)
    .orient("left");
var degree = ["Bachelor", "Master", "PhD", "Diploma"]

var color = d3.scale.ordinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3'].reverse());

function findColor(value) {
    colors =['#e41a1c','#377eb8','#4daf4a','#984ea3'].reverse();
    return colors[value - 1]
}

var yBegin;

var innerColumns = {
    // "column1" : ["Engineering and Architecture_1","Engineering and Architecture_2","Engineering and Architecture_3",'Engineering and Architecture_4'],
    // "column2" : ["Agriculture_1","Agriculture_2","Agriculture_3",'Agriculture_4'],
    // "column3" : ["Biological Sciences_1","Biological Sciences_2","Biological Sciences_3",'Biological Sciences_4'],
    "column1": ['Humanities_1', 'Humanities_2', 'Humanities_3', 'Humanities_4'],
    "column2": ['Exact Sciences_1','Exact Sciences_2','Exact Sciences_3','Exact Sciences_4'],
    "column6": ['Engineering and Architecture_1','Engineering and Architecture_2','Engineering and Architecture_3','Engineering and Architecture_4'],
    "column7": ['Arts and Special Programs_1', 'Arts and Special Programs_2', 'Arts and Special Programs_3', 'Arts and Special Programs_4'],
    "column5": ['Medicine and Health Sciences_1','Medicine and Health Sciences_2','Medicine and Health Sciences_3','Medicine and Health Sciences_4'],
    "column4": ['Social Sciences*_1', 'Social Sciences*_2', 'Social Sciences*_3', 'Social Sciences*_4'],
    "column3": ['Natural Sciences_1','Natural Sciences_2','Natural Sciences_3','Natural Sciences_4'],
    "column8" : ['Law_1','Law_2','Law_3','Law_4']
    // "column12" : ['Medicine _1','Medicine _2','Medicine _3','Medicine _4'],
    // "column13" : ['Paramedical Sciences_1','Paramedical Sciences_2','Paramedical Sciences_3','Paramedical Sciences_4'],
    // "column14" : ['Mathematics, Statistics and Computer Sciences_1','Mathematics, Statistics and Computer Sciences_2','Mathematics, Statistics and Computer Sciences_3','Mathematics, Statistics and Computer Sciences_4'],
    // "column15" : ['Physical Sciences_1','Physical Sciences_2','Physical Sciences_3','Physical Sciences_4'],
};

function render(data) {


    var columnHeaders = d3.keys(data[0]).filter(function(key) {
        return key !== "Institutaion" && key !== "Year";
    });
    color.domain(d3.keys(data[0]).filter(function(key) {
        return key !== "Institutaion" && key !== "Year";
    }));

    var e = document.getElementById("select_id");
    var selected_value = e.options[e.selectedIndex].value;
    var tmpData = [];
    data.forEach(function(entry) {
        // console.log(entry);
        if (entry.Year == selected_value) {
            tmpData.push(entry)
        }
    });
    data = tmpData;
    console.log(data)
    data.forEach(function(d) {
        var yColumn = new Array();
        d.columnDetails = columnHeaders.map(function(name) {
            for (ic in innerColumns) {
                if ($.inArray(name, innerColumns[ic]) >= 0) {
                    if (!yColumn[ic]) {
                        yColumn[ic] = 0;
                    }
                    yBegin = yColumn[ic];
                    yColumn[ic] += +d[name];
                    return {
                        name: name,
                        value: d[name],
                        Institutaion: d.Institutaion,
                        Year: d.Year,
                        column: ic,
                        yBegin: yBegin,
                        yEnd: +d[name] + yBegin
                    };
                }
            }
        });
        d.total = d3.max(d.columnDetails, function(d) {
            return d.yEnd;
        });
    });
    legendY.domain(degree.map(function(d) {
        return d;
    }));

    y0.domain(data.map(function(d) {
        return d.Institutaion;
    }));
    y1.domain(d3.keys(innerColumns)).rangeRoundBands([0, y0.rangeBand()]);

    x.domain([0, d3.max(data, function(d) {
        return d.total;
    })]);
    var svg = d3.select("#main_svg").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+leftpadding+"," + height + ")");
    // .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+leftpadding+",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("");
    var project_stackedbar = svg.selectAll(".project_stackedbar")
        .data(data)
        .enter().append("g")
        .attr("class", "g mix")
        .attr("transform", function(d) {
            var x = y0(d.Institutaion);
            var res = x -  (y0.rangeBand() / (Object.keys(innerColumns).length+1));
            return "translate(0, " + res+ ")";
        });
    var lines = svg.selectAll(".lines")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", leftpadding)
        .attr("y1", function(d) {
            return y0(d.Institutaion) - y0.rangeBand() / (Object.keys(innerColumns).length+1)
        })
        .attr("x2", 150)
        .attr("y2", function(d) {
            return y0(d.Institutaion) - y0.rangeBand() / (Object.keys(innerColumns).length+1)
        })
        .attr("stroke-width", 2)
        .style("stroke-dasharray", ("3, 3")) // <== This line here!!
        .attr("stroke", "black");

    var bars = project_stackedbar.selectAll("rect")
        .data(function(d) {
            return d.columnDetails;
        })
        .enter().append("rect")
        .attr('class', 'rect_')
        .attr("height", y0.rangeBand() / (Object.keys(innerColumns).length+1))
        .attr("x", function(d) {
            return x(d.yBegin) / 1.5 + leftpadding+1;
        })
        .attr("y", function(d) {
            return y1(d.column);
        })
        .attr("width", function(d) {
            return (x(d.yEnd) - x(d.yBegin)) / 1.5;
        })
        .style("fill", function(d) {
            var deg = d.name.split('_')[1];
            return findColor(deg);
        })
        .on("mouseover", function(d) {
            if ((r = $(this).css("fill").match(/(\d+),\s*(\d+),\s*(\d+)/i))) {
                for (var i = 1; i < 4; i++) {
                    r[i] = Math.round(r[i] * .5);
                }
                $(this).attr("fill-old", $(this).css("fill"));
                $(this).css("fill", 'rgb(' + r[1] + ',' + r[2] + ',' + r[3] + ')');
            }
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("<b>" + d.Institutaion + "</b>, " + tooltop_render(d.name) + " : " + d.value + " Studends")
                .style("left", x(d.yBegin) / 1.5 + leftpadding+1 + "px")
                .style("top", (y0(d.Institutaion)+y1(d.column) - 28) + "px");
        })
        .on("mouseout", function(d) {
            if ($(this).attr("fill-old")) $(this).css("fill", $(this).attr("fill-old"));

            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    project_stackedbar.selectAll("text.score")
        .data(function(d) {
            return d.columnDetails;
        })
        .enter()
        .append("text")
        .attr("x", function(d) {
            return x(d.yBegin) / 1.5 + leftpadding+ (x(d.yEnd) - x(d.yBegin)) / 1.5 + 5*d.name.length
        })
        .attr("y", function(d) {
            return y1(d.column)+5;
        })
        .attr("dx", -5)
        .attr("dy", ".36em")
        .attr("text-anchor", "end")
        .attr('class', 'score')
        .text(function(d) {
            name =  d.name.split('_')[0];
            level = d.name.split('_')[1];
            if (+level < 4 ){
                return ''
            }
            return name
        });


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
            return findColor(degree.indexOf(d) + 1);
        })
};

function options(data) {
    byInstitutaionAndYear = jQuery.extend(true, [], data);
    draw_bar_chart()

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

$("#radioBtn").click(function() {
    draw_bar_chart()
});

function draw_bar_chart() {

    select_order = document.querySelector('input[name="order_by"]:checked').value;
    data = jQuery.extend(true, [], byInstitutaionAndYear);

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

    filter(data)
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
    data = newData
    render(data)
}

$('input[name="by"]').on('change', function(e) {
    page = document.querySelector('input[name="by"]:checked').value;
    window.location.href = page+".html";
});


function clearDiv() {
    $('#main_svg').remove(); // this is my <div> element
    $('#main_div').append(' <div class="col-lg-12" id="main_svg"></div>');
    $('#legend_svg').remove(); // this is my <div> element
}


function is_choosen_degree(key, value) {
    if (key == 'Year' || key == 'Institutaion')
        return value;
    arr_key = key.split('_');
    degree_level = degree[arr_key[1]-1];
    if (degree_remove.indexOf(degree_level) > -1)
        return "0";
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

d3.csv("asset/vis2Data.csv", options);
