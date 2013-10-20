define([
  
  // Libraries
  "jquery",
  
  // models
  "models/degree",
  //"models/graph/layout/degree",
  "models/graph/layout/circle"
],
       
function(jquery, degree, circle) {
  
  var graph = {
    
    initial: function(nodes, edges, options) {
      
      var i, node, edge, count = 0, length = nodes.length, radius = 200, min = 2, max = 10, type = "degree";
      
      this.sigInst = sigma.init(document.getElementById('canvas')).drawingProperties({
        defaultLabelColor: '#000',
        defaultLabelSize: 12,
        defaultLabelBGColor: '#fff',
        defaultLabelHoverColor: '#000',
        labelThreshold: max,
      }).mouseProperties({
        minRatio: .5,
        maxRatio: 30
      });
      
      // calculate degree
      degree.apply(nodes, edges, {type: "degree", min: min, max: max});
      
      for (i = 0; i < nodes.length; i++) {
        
        node = nodes[i];
        
        this.sigInst.addNode(node.id, {
          label: node.id,
          //x: this.positionX(count++, length, radius),
          //y: this.positionY(count++, length, radius),
          x: node.x,
          y: nodex.y,
          size: node.size,
          color: node.color,
          forceLabel: node.forceLabel,
          degree: node[type],
          l: attrs.l, 
          d: attrs.d, 
          timer: 0
        });
      }
      
      for(i = 0; i < edges.length; i++) {
        
        edge = edges[i];
        
        this.sigInst.addEdge(edge.id, edge.source, edge.target, {
          size: 2, 
          probability: edge.probability,
          weight: edge.weight,
          hidden: edge.hidden
        });
      }
     
      this.initialForceAtlas2(nodes);
      
      this.startForceAtlas2();
    },
    
    updateNodes: function(nodes) {
      
      this.sigInst.iterNodes(function(node) {
        
        var result = $.grep(nodes, function(item) {
          
          return item.id == node.label;
        });
        
        if (result.length !== 0) {
          
          for (var item in result[0]) {
            
            node[item] = result[0][item];
          } 
        }
      });
    },
    
    updateEdges: function(edges) {
      
      this.sigInst.iterEdges(function(edge) {
        
        var result = $.grep(edges, function(item) {
          
          return item.id == edge.id;
        });
        
        if (result.length !== 0) {
          
          for (var item in result[0]) {
            
            edge[item] = result[0][item];
          } 
        }
      });
    },
    
    draw: function() {
      
      this.sigInst.draw();
    },
    
    showEdges: function() {
      
      this.sigInst.iterEdges(function(edge) {
        
        edge.hidden = false;
      });
      
      if (this.hasStartedForceAtlas2)
        this.stopForceAtlas2();
    },
    
    hideEdges: function() {
      
      this.sigInst.iterEdges(function(edge) {
        
        edge.hidden = true;
      });
    },
    
    showLabels: function() {
      
      this.sigInst.iterNodes(function(node) {
        
        node.forceLabel = true;
      });
    },
    
    hideLabels: function() {
      
      this.sigInst.iterNodes(function(node) {
        
        node.forceLabel = false;
      });
    },
    
    initialForceAtlas2: function(nodes) {
      
      this.hasStartedForceAtlas2 = false;
    },
    
    startForceAtlas2: function() {
      
      if (!this.hasStartedForceAtlas2) {
        
        this.sigInst.startForceAtlas2({
          strongGravityMode: attrs.strongGravityMode,
          gravity: attrs.gravity,
          linLogMode: attrs.linLogMode,
          edgeWeightInfluence: attrs.edgeWeightInfluence
        });
        
        this.hasStartedForceAtlas2 = true;
        
      } else {
        
        this.sigInst.changeSettings({
          strongGravityMode: attrs.strongGravityMode,
          gravity: attrs.gravity,
          linLogMode: attrs.linLogMode,
          edgeWeightInfluence: attrs.edgeWeightInfluence
        });
        
        this.hasStartedForceAtlas2 = false;
      }
    },
    
    stopForceAtlas2: function() {
      
      this.sigInst.stopForceAtlas2();
      this.hasStartedForceAtlas2 = false;
    },
    
    showNeighbor: function(sigInst) {
      
      var graph = this;
      
      this.sigInst.bind('overnodes', function(event){
        
        var nodes = event.content;
        
        var neighbors = {};
        
        graph.sigInst.iterEdges(function(e) {
          
          if(nodes.indexOf(e.source) >= 0 || nodes.indexOf(e.target) >= 0) {
            
            neighbors[e.source] = 1;
            neighbors[e.target] = 1;
            
            e.hidden = 0;
          } else {
            
            e.hidden = 1;
          }
          
        }).iterNodes(function(n){
          
          if (!neighbors[n.id]) {
            
            n.hidden = 1;
            n.forceLabel = 0;
            
          } else {
            
            n.hidden = 0;
            n.forceLabel = 1;
          }
          
        }).draw(2, 2, 2);
        
        
      }).bind('outnodes',function() {
        
        graph.sigInst.iterEdges(function(e) {
          
          e.hidden = 0;
          
        }).iterNodes(function(n) {
          
          n.hidden = 0;
          n.forceLabel = 0;
          
        }).draw(2, 2, 2);
      });
    },
    
    positionX: function(count, length, radius) {
      
      return Math.cos(Math.PI * count / length) * radius;
    },
    
    positionY: function(count, length, radius) {
      
      return Math.sin(Math.PI * count / length) * radius;
    },
  };
  
  return graph;
});