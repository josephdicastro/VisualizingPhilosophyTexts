
const selectMenu = d3.select('#searchMenu')

const margin = {
    top: 30,
    right: 50,
    bottom: 30,
    left: 50
};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const g = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style('border', '1px solid black');

d3.json("static/kant.json").then(data => { 
    searchTerms = []
    searchTerms.push('...Select Text...')
    titles = Object.keys(data)
    titles.forEach(title => {
        searchTerms.push(title)
    })

    console.log(searchTerms)

    selectMenu.selectAll("option")
                .data(searchTerms)
                .enter()
                    .append("option")
                    .attr("value", (d) => d)
                    .html((d) => d)
                .exit().remove();

    selectMenu.on('change', function() {
        selectedText = d3.event.target.value;
        showText(selectedText);
    })
    
    wordCloudData = []

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    makeCloud();

    function showText(selectedText) {



        if (selectedText !== '...Select Text...') {
            wordValues = data[selectedText]
            minVal = d3.min(wordValues, v=>+v.value)
            maxVal = d3.max(wordValues, v=>+v.value)

            let scaleType = d3.scaleLinear()
                .domain([minVal,maxVal])
                .range([10,50])

            console.log(minVal,maxVal)
            wordCloudData.length = 0;
            wordValues.forEach(function(word) {
                word.text = word.text
                word.value = scaleType(word.value)
                wordCloudData.push(word)
                console.log(word)
            })
            
            makeCloud();
        
        }
    }

    function makeCloud() {
        let wordCloudlayout = d3.layout.cloud()
            .size([700, 450])
            .words(wordCloudData)
            .fontSize((d)=>d.value)
            .font("Gill Sans MT")
            .padding(5)
            .on("end", draw);
    
        wordCloudlayout.start();

        function draw(words) {
            d3.select("svg").html("")
            d3.select("svg")
                .append("g")
                .attr("transform", "translate(" + wordCloudlayout.size()[0] / 2 + "," + wordCloudlayout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter()
                    .append("text")
                    .text((d) => d.text)
                    .style("font-size", (d) => (d.value)  + "px")
                    .style("font-family", (d) => d.font)
                    .style("fill", (d, i) => color(i))
                    .attr("text-anchor", "middle")
                    .attr("transform", (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                .exit()
                    .remove()
        }
    }
    

   
        


});