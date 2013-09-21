

function fileSelection(event) {
  
  var files = event.target.files; // FileList object
  
  var spliter = "\t";
  
  if (files.length !== 0) {
    
    var file = files[0];
    
    var reader = new FileReader();
    
    reader.onload = function(event) {
      
      var nodes = attrs.nodes;
      var edges = attrs.edges;
      
      var contents = event.target.result;
      
      var lines = contents.split("\r\n");
      
      lines.forEach(function(line) {
        
        var values = line.split(spliter);
        
        if (values.length < 2)
          console.log("parse error");
        
        if (nodes.indexOf(values[0]) === -1) {
          
          nodes.push(values[0]);
        }
        
        if (nodes.indexOf(values[1]) === -1) {
          
          nodes.push(values[1]);
        }
        
        edges.push([values[0], values[1], 0.7]);
      });
      
      // initial graph
      draw(nodes, edges, {});
    };
    
    // Read in the image file as a data URL.
    reader.readAsText(file);
  }
}

