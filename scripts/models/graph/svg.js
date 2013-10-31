define([
  
],

function() {

  return {
    
    margin: 20,
    hash: {},
    
    adjustOffset: function(sigInst) {
      
      var svg = this;
      
      sigInst.iterNodes(function(node) {
        
        if (svg.minX == undefined || svg.minX > node.x)
          svg.minX = node.x;
        
        if (svg.minY == undefined || svg.minY > node.y)
          svg.minY = node.y;
        
        if (svg.maxX == undefined || svg.maxX < node.x)
          svg.maxX = node.x;
        
        if (svg.maxY == undefined || svg.maxY < node.y)
          svg.maxY = node.y;
        
        svg.hash[node.id] = node;
      });
    },
    
    snapshot: function(sigInst) {
      
      var svg = this;
      
      svg.adjustOffset(sigInst);
      
      var stream = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + 
                    [svg.minX, svg.minY, (svg.maxX - svg.minX), (svg.maxY - svg.minY)].join(" ") + '">'];
      
      // draw edges
      sigInst.iterEdges(function(edge) {
      
        stream.push(svg.drawEdge(svg.hash[edge.source].x, svg.hash[edge.source].y, svg.hash[edge.target].x,svg.hash[edge.target].y, edge.color));
      });
      
      // draw nodes
      sigInst.iterNodes(function(node) {
        
        stream.push(svg.drawNode(node.x, node.y, node.size, node.color));
      });
      
      stream.push('</svg>');
      
      return stream.join("\n");
    },
    
    drawNode: function(cx, cy, size, color) {
      
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + size + '" fill="' + color + '"/>';
    },
    
    drawEdge: function(x1, y1, x2, y2, color) {
      
      return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '"/>';
    }
  };
});