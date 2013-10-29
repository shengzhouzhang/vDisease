define([

  "jquery"
  
], function($) {

  var degree = {
    
    apply: function(nodes, edges, options) {
      
      var min, max, vmin, vmax;
      
      if (nodes.length === 0)
        console.log("error!");
      
      nodes.forEach(function(node) {

        node.degree = 0;
        node.vdegree = 0;
      });
      
      // calculate degree for each node
      nodes.forEach(function(node) {
        
        if (node.degree == undefined)
          node.degree = 0;
        
        if (node.neighbor == undefined)
          node.neighbor = [];
        
        var result = $.grep(edges, function(edge) {
        
          if (node.id == edge.source)
            node.neighbor.push(edge.target);
          
          if (node.id == edge.target)
            node.neighbor.push(edge.source);
          
          return node.id == edge.source;
        });
        
        node.degree += result.length;
      });
      
      // calculate degree with neighbor
      nodes.forEach(function(node) {
        
        var sum = 0;

        node.neighbor.forEach(function(nodeId) {
          
          var result = $.grep(nodes, function(node) {
            
            return node.id == nodeId;
          });
          
          if (result.length !== 1)
            console.log(result);
          
          sum += result[0].degree;
        });
        
        node.vdegree = node.degree == 0 ? 0 : node.degree + sum / node.degree;
        
        // find min and max degree
        if (min === undefined ||
            min > node.degree)
          min = node.degree;
        
        if (max === undefined ||
            max < node.degree)
          max = node.degree;
        
        if (vmin === undefined ||
            vmin > node.vdegree)
          vmin = node.vdegree;
        
        if (vmax === undefined ||
            vmax < node.vdegree)
          vmax = node.vdegree;
        
        /*
        node.size = node[options.type] < options.min ? 
          options.min : node[options.type] > options.max ? 
            options.max : node[options.type];
        */
        
        /*
        if (options.type == "degree")
          node.size = options.min + (options.max - options.min) * (node["degree"] - min) / (max - min);
        else
          node.size = options.min + (options.max - options.min) * (node["vdegree"] - vmin) / (vmax - vmin);
        */
      });
      
      this.min = min;
      this.max = max;
      this.sum = max + min;
      this.avg = (max + min) / 2;
      this.def = max - min;
      
      this.vmin = vmin;
      this.vmax = vmax;
      this.vsum = vmax + vmin;
      this.vavg = (vmax + vmin) / 2;
      this.vdef = vmax - vmin;
      
      /*
      edges.forEach(function(edge) {
        
        var result = $.grep(nodes, function(node) {
          
          return node.id == edge.source;
        });
        
        if (result.length !== 1)
          console.log(result);
        
        edge.weight = options.type == "degree" ? 
          degree.max * (result[0][options.type] / degree.max) : 
          degree.max * (result[0][options.type] / degree.vmax);
      });
      */
    },
  };
  
  return degree;
});