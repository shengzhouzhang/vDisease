function draw(nodes, edges, options) {
  
  var threshold = 2000;
  
  var sigInst = sigma.init(document.getElementById('canvas')).drawingProperties({
    defaultLabelColor: '#fff',
    defaultLabelSize: 14,
    defaultLabelBGColor: '#fff',
    defaultLabelHoverColor: '#000',
    labelThreshold: 7,
  }).mouseProperties({
    minRatio: .8,
    maxRatio: 30
  });
  
  if (attrs.layout === "ForceAtlas2 (LinLin Mode)") {
    
    attrs.linLogMode = false;
    attrs.layout = "ForceAtlas2";
    
  } else if (attrs.layout === "ForceAtlas2 (Strong Gravity)"){
    
    attrs.strongGravityMode = true;
    attrs.layout = "ForceAtlas2";
    
  } else if (attrs.layout === "ForceAtlas2") {
    
    attrs.strongGravityMode = false;
    attrs.linLogMode = true;
  }
  
  var i, R = 200, j = 0, L = nodes.length, l, d;
  
  attrs.counter = 0;
    
  for (i = 0; i < nodes.length; i++) {
    
    sigInst.addNode(nodes[i], {
      label: nodes[i],
      x: positionX(),
      y: positionY(),
      size: nodes.length >= 500 ? 3 : 5,
      color: "green",
      forceLabel: attrs.forceLables,
      l: attrs.l, 
      d: attrs.d, 
      timer: 0
    });
  }
  
  if (attrs.layout === "ForceAtlas2") {
    
    attrs.showEdges = false;
    $('#showEdge').bootstrapSwitch('setState', false);
  }
  
  for(i = 0; i < edges.length; i++) {
    
    sigInst.addEdge(i, edges[i][0], edges[i][1], {
      size: 2, 
      probability: edges[i][2], 
      weight: edges[i][2], 
      hidden: !attrs.showEdges
    });
  }
  
  attrs.sigInst = sigInst;
  
  if (attrs.layout === "ForceAtlas2") {
    
    sigInst.startForceAtlas2({
      strongGravityMode: attrs.strongGravityMode,
      linLogMode: attrs.linLogMode,
      edgeWeightInfluence: attrs.edgeWeightInfluence
    });
    attrs.forceAtlas2 = true;
    
  } else {
    
    sigInst.position(0,0,1).draw();
    attrs.forceAtlas2 = false;
  }
  
  updateInfo({nodes: nodes.length, edges: edges.length});
  
  //showNeighbor (sigInst)
};

function showNeighbor (sigInst) {
  
  sigInst.bind('overnodes', function(event){
    
    var nodes = event.content;
    
    var neighbors = {};
    
    sigInst.iterEdges(function(e) {
      
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
    
    sigInst.iterEdges(function(e) {
      
      e.hidden = 0;
      
    }).iterNodes(function(n) {
      
      n.hidden = 0;
      n.forceLabel = 0;
      
    }).draw(2, 2, 2);
  });

};

function positionX() {
  
  switch(attrs.layout) {
      
    case "Random":
      return Math.random();
    default:
      return Math.cos(Math.PI*(attrs.counter++)/attrs.nodes.length)*attrs.R;
  }
};

function positionY() {
  
  switch(attrs.layout) {
      
    case "Random":
      return Math.random();
    default:
      return Math.sin(Math.PI*(attrs.counter++)/attrs.nodes.length)*attrs.R;
  }
};

function randomColor() {
  
  return 'rgb('+Math.round(Math.random()*256)+','+
                      Math.round(Math.random()*256)+','+
                      Math.round(Math.random()*256)+')';
};

function isNumber(n) {
  
  return !isNaN(parseFloat(n)) && isFinite(n);
};