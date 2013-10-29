define([
  
  // Libraries
  "jquery",
  
  // models
  "models/attrs",
  "models/degree"
],

function($, attrs, degree) {
  
  return size = {
  
    applyDegree: function(nodes, edges) {
      
      degree.apply(nodes, edges, {type: "degree", min: attrs.min, max: attrs.max});
      
      var i;
      
      for (i = 0; i < nodes.length; i++) {
        
        nodes[i].size = attrs.min + 
          (attrs.max - attrs.min) * 
          (nodes[i]["degree"] - degree["min"]) / (degree["max"] - degree["min"]);
      }
    },
    
    applyDegree2: function(nodes, edges) {
      
      degree.apply(nodes, edges, {type: "vdegree", min: attrs.min, max: attrs.max});
      
      var i;
      
      for (i = 0; i < nodes.length; i++) {
        
        nodes[i].size = attrs.min + 
          (attrs.max - attrs.min) * 
          (nodes[i]["vdegree"] - degree["vmin"]) / (degree["vmax"] - degree["vmin"]);
      }
    },
    
    applyDefaultSize: function(nodes) {
      
      for (i = 0; i < nodes.length; i++) {
        
        nodes[i].size = attrs.size; 
      }
    }
  };
});