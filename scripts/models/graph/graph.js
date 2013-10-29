define([
  
  // Libraries
  "jquery",
  
  // models
  "models/graph/size",
  //"models/graph/layout/degree",
  "models/graph/layout/circle"
],
       
function(jquery, degree, circle) {
  
  var graph = {
    
    initial: function(nodes, edges, options) {
      
      var i, node, edge, count = 0, length = nodes.length, radius = 200;
      
      this.sigInst = sigma.init(document.getElementById('canvas')).drawingProperties({
        defaultLabelColor: '#000',
        defaultLabelSize: 12,
        defaultLabelBGColor: '#fff',
        defaultLabelHoverColor: '#000',
        labelThreshold: attrs.max,
      }).mouseProperties({
        minRatio: .5,
        maxRatio: 30
      });
      
      // calculate degree
      size.applyDegree(nodes, edges);
      
      circle.initial(nodes);
      
      for (i = 0; i < nodes.length; i++) {
        
        node = nodes[i];
        
        this.sigInst.addNode(node.id, {
          label: node.id,
          //x: this.positionX(count++, length, radius),
          //y: this.positionY(count++, length, radius),
          x: node.x,
          y: node.y,
          size: node.size,
          color: node.color,
          forceLabel: node.forceLabel,
          degree: node["degree"],
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
     
      //this.initialForceAtlas2(nodes);
      
      this.startForceAtlas2();
    },
    
    updateNodes: function(nodes, attrs) {
      
      var i, item;
      
      this.sigInst.iterNodes(function(node) {
        
        var result = $.grep(nodes, function(item) {
          
          return item.id == node.label;
        });
        
        if (result.length !== 0) {
          
          for (i = 0; i < attrs.length; i++) {
            
            item = attrs[i];
            
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
      
      //this.hasStartedForceAtlas2 = undefined;
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
      
      if ([
        "ForceAtlas2", 
        "ForceAtlas2 (LinLin Mode)", 
        "ForceAtlas2 (Strong Gravity)"
      ].indexOf(attrs.layout) != -1)
        this.startForceAtlas2();
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
      }
    },
    
    stopForceAtlas2: function() {
      
      if (this.hasStartedForceAtlas2) {
        this.sigInst.stopForceAtlas2();
        this.hasStartedForceAtlas2 = false;
      }
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
  };
  
  return graph;
});