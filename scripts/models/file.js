define([
  
  // Libraries
  "jquery",
  
  "models/attrs"
],

function($, attrs) {
  
  var File = {};
  
  File.parseFile = function (data) {
    
    var nodes_raw = attrs.nodes;
    var edges_raw = attrs.edges;
    
    var spliter = "\t";
    
    var lines = data.split(/\r\n|\r|\n/g);
    
    var nodes = [];
    var edges = [];
    
    lines.forEach(function(line) {
      
      var values = line.split(spliter);
      
      if (values.length < 2)
        console.log("parse error");
      
      if ($.grep(nodes, 
                 function(node) { return node.id == values[0];})
          .length === 0) {
        
        nodes.push({
          id: values[0],
          x: 0,
          y: 0,
          size: 2,
          color: attrs.nodeColor,
          forceLables: false,
        });
      }
      
      if ($.grep(nodes, 
                 function(node) { return node.id == values[1];})
          .length === 0) {
        
        nodes.push({
          id: values[1],
          x: 0,
          y: 0,
          size: 2,
          color: attrs.nodeColor,
          forceLabel: false,
        });
      }
      
      edges.push({
        id: edges.length.toString(),
        source: values[0],
        target: values[1],
        probability: values[2],
        color: attrs.edgeColor,
        hidden: true
      });
      
    });
    
    return {nodes: nodes, edges: edges};
  };
  
  File.parseIDs = function(data) {
    
    var values = data.split(",");
    
    var result = [];
    
    values.forEach(function(value) {
      
      value = value.trim();
      
      result.push(value);
    });
    
    return result;
  };

  
  return File;
});