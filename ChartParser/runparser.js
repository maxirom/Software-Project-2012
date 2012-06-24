//
//  runparser.js
//
/*
  The author or authors of this code dedicate any and all 
  copyright interest in this code to the public domain.
*/


// helper functions for the parser demo


var resultsArray = [];

function getElement(id) {
    return document.getElementById(id);
}

function appendElement(parent, element, text) {
    var elem = document.createElement(element);
    if (text) {
        elem.appendChild(document.createTextNode(text));
    }
    parent.appendChild(elem);
    return elem
}

function treeString(tree) {
    if (typeof(tree) == 'object' && tree.label) {
        str = "(" + tree.label
        if (tree.children) {
            for (var i in tree.children) {
                str += " " + treeString(tree.children[i])
            }
        }
        return str + ")"
    } else {
        return stringRepr(tree)
    }
}

// remember the original makeTree function, since runParser() redefines it:
var originalMakeTree = makeTree;

function runParser(input) {
    var resultsDiv = getElement("results");
    //appendElement(resultsDiv, "hr");
    //appendElement(resultsDiv, "h3", '"' + input.join(" ") + '"');
    
    if (getElement("parsetrees") && getElement("parsetrees").checked) {
        makeTree = originalMakeTree;
        //appendElement(resultsDiv, "em", "[building parsetrees] ");
    } else {
        makeTree = false;
    }
    
    var maybeFilter;
    if (getElement("usefilter") && getElement("usefilter").checked) {
        maybeFilter = filter;
        //appendElement(resultsDiv, "em", "[using left-corner filter] ");
    }
    
    var startTime = new Date();
    var parseChart = parse(input, grammar, grammar.$root, maybeFilter);
    var parseTime = new Date() - startTime;
    
    var statistics = parseChart.statistics()
    //appendElement(resultsDiv, "p", "Chart size: " + statistics.nrEdges + " edges" + " (" + statistics.nrPassiveEdges + " passive)");
    //resultsArray.push("Chart size: " + statistics.nrEdges + " edges" + " (" + statistics.nrPassiveEdges + " passive)");
    //appendElement(resultsDiv, "p", "Parse time: " + parseTime + " ms" + " (" + (parseTime / statistics.nrEdges).toFixed(2) + " ms/edge)");
    //resultsArray.push("Parse time: " + parseTime + " ms" + " (" + (parseTime / statistics.nrEdges).toFixed(2) + " ms/edge)");
    
    var parseTrees = parseChart.treesForRule(grammar.$root);
    if (parseTrees) { 
        //appendElement(resultsDiv, "p", "Parse trees: " + parseTrees.length);
        resultsArray.push(parseTrees.length + "");
        var resultList = appendElement(resultsDiv, "ol");
        for (var i in parseTrees) {
            var tree = parseTrees[i];
            if (tree.data) {
                //var listItem = appendElement(resultList, "li", stringRepr(tree.data));
                resultsArray.push(stringRepr(tree.data));
                //appendElement(listItem, "p", treeString(tree));
                resultsArray.push(treeString(tree));
            } else {
                //appendElement(resultList, "li", treeString(tree));
                resultsArray.push(treeString(tree));
            }
        }
    } else {
        //appendElement(resultsDiv, "p", "No results found!");
        resultsArray.push("nothing found");
    }
    
var results = resultsArray;
resultsArray = [];    
return results;
}

function runWordParser() {
    runParser(getElement("input").value.split(/\s+/));
}

function runCharacterParser() {
    runParser(getElement("input").value.split(""));
}
