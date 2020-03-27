
const selectMenu1 = d3.select('#selectMenu1')
const selectMenu2 = d3.select('#selectMenu2')

const margin = {
    top: 30,
    right: 50,
    bottom: 30,
    left: 50
};
const width = 500 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const g1 = d3.select("#cloud1")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

const g2 = d3.select("#cloud2")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


d3.json("static/wordcloud.json").then(data => { 
    searchTerms = []
    searchTerms.push('...Select Text...')
    titles = Object.keys(data)
    titles.forEach(title => {
        searchTerms.push(title)
    })


    selectMenu1.selectAll("option")
                .data(searchTerms)
                .enter()
                    .append("option")
                    .attr("value", (d) => d)
                    .html((d) => d)
                .exit().remove();

    selectMenu1.on('change', function() {
        selectedText = d3.event.target.value;
        showText(selectedText,"menu1");
    })

    selectMenu2.selectAll("option")
    .data(searchTerms)
    .enter()
        .append("option")
        .attr("value", (d) => d)
        .html((d) => d)
    .exit().remove();

    selectMenu2.on('change', function() {
    selectedText = d3.event.target.value;
    showText(selectedText, "menu2");
    })
    
    wordCloudData = []

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    makeCloud1();
    makeCloud2();

    function showText(selectedText, menuNum) {
        if (selectedText !== '...Select Text...') {
            wordValues = data[selectedText]
            minVal = d3.min(wordValues, v=>+v.value)
            maxVal = d3.max(wordValues, v=>+v.value)

            let scaleType = d3.scaleLinear()
                .domain([minVal,maxVal])
                .range([10,55])

            wordCloudData.length = 0;
            wordValues.forEach(function(word) {
                word.text = word.text
                word.value = scaleType(word.value)
                wordCloudData.push(word) 
            })

            if (menuNum === 'menu1') {
                makeCloud1();
            } else {
                makeCloud2();
            }
        }
    }

    function makeCloud1() {
        let wordCloudlayout1 = d3.layout.cloud()
            .size([500, 400])
            .words(wordCloudData)
            .fontSize((d)=>d.value)
            .font("Gill Sans MT")
            .padding(5)
            .on("end", draw1);
    
        wordCloudlayout1.start();

        function draw1(words) {
            d3.select("#cloud1").html("")
            d3.select("#cloud1")
                .append("g")
                .attr("transform", "translate(" + wordCloudlayout1.size()[0] / 2 + "," + wordCloudlayout1.size()[1] / 2 + ")")
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

    function makeCloud2() {
        let wordCloudlayout2 = d3.layout.cloud()
            .size([500, 400])
            .words(wordCloudData)
            .fontSize((d)=>d.value)
            .font("Gill Sans MT")
            .padding(5)
            .on("end", draw2);
    
        wordCloudlayout2.start();

        function draw2(words) {
            d3.select("#cloud2").html("")
            d3.select("#cloud2")
                .append("g")
                .attr("transform", "translate(" + wordCloudlayout2.size()[0] / 2 + "," + wordCloudlayout2.size()[1] / 2 + ")")
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