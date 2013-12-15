define([
  
  // Libraries
  "jquery",
  
  // models
  "models/attrs",
  "models/log",
  "models/graph/graph"
],

function($, attrs, log, graph) {
  
  var SEIR = {};
  
  SEIR.start = function() {
    
    this.interval();
  };
  
  SEIR.colors = {
    susceptible: "rgba(15,125,160,.2)",
    exposed: "rgba(255,200,0,1)",
    infectious: "rgba(180,50,10,1)",
    recovered: "rgba(220,220,220,1)"
  };
  
  SEIR.remove = function(type, id) {
    
    this[type][id] = undefined;
    this[type]["length"]--;
  };
  
  SEIR.add = function(type, id) {
    
    this[type][id] = true;
    this[type]["length"]++;
  };
  
  SEIR.initial = function (graph, options) {
    
    this.exposed = {length: 0};
    this.infectious = {length: 0};
    this.recovered = {length: 0};
    this.susceptible = {length: 0};
    this.edgesBySource = {};
    
    this.graph = graph;
    
    this.timer = 0;
    this.nodes = options.nodes;
    this.edges = options.edges;
    
    this.inits = options.inits;
    
    var seir = this;
    
    for (var item in this.inits) {
      
      this.inits[item].forEach(function(node) {
        
        if (node !== "") {
          
          switch(item) {
              
            case "susceptible":
              seir.add("susceptible", node);
              break;
            case "exposed":
              seir.add("exposed", node);
              break;
            case "infectious":
              seir.add("infectious", node);
              break;
            case "recovered":
              seir.add("recovered", node);
              break;
            default:
              break;
          }
        }
      });
    }
    
    // if no infectious nodes given, choose a random node
    if (seir.infectious["length"] == 0) {
      
      var node = Math.round(Math.random() * this.nodes.length);
      seir.add("infectious", node.toString());
    }
    
    // push every nodes that is not an infectious into susceptible nodes
    this.nodes.forEach(function(node) {
      
      node.timer = 0;
      
      if (!seir.exposed[node.id] &&
          !seir.infectious[node.id] &&
          !seir.recovered[node.id]) {
        
        seir.add("susceptible", node.id);
      }
    });
    
    // set edges visable and give a light color
    seir.edges.forEach(function(edge) {
      
      edge.color = seir.colors.susceptible;
      edge.hidden = false;
      
      // create a hash table for edges
      if (!seir.edgesBySource[edge.source])
        seir.edgesBySource[edge.source] = [edge];
      else
        seir.edgesBySource[edge.source].push(edge);
    });
    
    attrs.showEdges = true;
  };
  
  SEIR.interval = function() {
    
    var index, seir = this;
    
    seir.update();
    // take a initial snapshot
    graph.snapshot(seir.timer);
    
    attrs.interval = setInterval(function() {
      
      if (attrs.isRun === true) {
        
        seir.checkLive();
        
        seir.edges.forEach(function(edge) {
          
          // get infection
          if(seir.infectious[edge.source] && 
             seir.susceptible[edge.target] &&
             Math.random() < (attrs.probability == 0.0 ? edge.probability : attrs.probability)) {
            
            //console.log(1);
            log.write(seir.timer + " " + edge.source + " " + edge.target);
            
            // remove from susceptible nodes
            seir.remove("susceptible", edge.target);
            
            // push to exposed nodes, edge.target is only the id of the node
            seir.add("exposed", edge.target);
            
            // change edge color
            edge.color = seir.colors.infectious;
          };
        });
        
        // day +1
        seir.timer++;
        // infection
        seir.update();
        
        // take a snapshot
        graph.snapshot(seir.timer);
      }
      
    }, attrs.interval * 1000);
  };
  
  SEIR.checkLive = function() {
  
    var seir = this;
    
    if (seir.infectious["length"] == 0 && 
        seir.exposed["length"] == 0) {
    
      attrs.isRun = false;
      delete attrs.interval;
    }
  };
  
  SEIR.update = function() {
    
    var index, seir = this;
    
    seir.updateInfo({
        s: seir.susceptible["length"]+ " (" + Math.round(seir.susceptible["length"] / seir.nodes.length * 100) + "%)",
        e: seir.exposed["length"] + " (" + Math.round(seir.exposed["length"] / seir.nodes.length * 100) + "%)",
        i: seir.infectious["length"] + " (" + Math.round(seir.infectious["length"] / seir.nodes.length * 100) + "%)",
        r: seir.recovered["length"] + " (" + Math.round(seir.recovered["length"] / seir.nodes.length * 100) + "%)",
        nodes: seir.nodes.length,
        days: seir.timer});
    
    seir.nodes.forEach(function(node){
      
      if (seir.susceptible[node.id]) {
        
        node.timer = 0;
        
      } else if (seir.exposed[node.id]) {
        
        node.color = seir.colors.exposed;
        node.timer++;
        
        if (node.timer >= attrs.exposed_period) {
          
          // remove from exposed nodes, and push into infectious nodes
          seir.remove("exposed", node.id);
          seir.add("infectious", node.id);
          node.timer = 0;
        }
        
      } else if (seir.infectious[node.id]) {
        
        node.color = seir.colors.infectious;
        node.timer++;
        
        if (node.timer >= attrs.infectious_period) {
          
          // remove from infectious nodes, and push into recovered nodes
          seir.remove("infectious", node.id);
          seir.add("recovered", node.id);
          
          node.timer = 0;
        }
        
      } else if (seir.recovered[node.id]) {
        
        node.color = seir.colors.recovered;
        node.timer = 0;
        
        // change edge's color if the node is recovered
        if (seir.edgesBySource[node.id])
          seir.edgesBySource[node.id].forEach(function(edge) {
            
            edge.color = seir.colors.recovered;
          });
      }
    });
    
    // update graph
    this.graph.updateNodes(seir.nodes, ["color"]);
    this.graph.updateEdges(seir.edges);
    this.graph.draw();
  };
  
  SEIR.updateInfo = function(options) {
    
    if (options.days !== undefined)
      $("#days").html(options.days);

    if (options.s !== undefined)
      $("#nodes").html(options.nodes);
    
    if (options.s !== undefined)
      $("#susceptible").html(options.s);
    
    if (options.e !== undefined)
      $("#exposed").html(options.e);
    
    if (options.i !== undefined)
      $("#infectious").html(options.i);
    
    if (options.r !== undefined)
      $("#recovered").html(options.r);
  };
  
  return SEIR;
});