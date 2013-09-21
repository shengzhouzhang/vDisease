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
  
  var i, R = 200, j = 0, L = nodes.length, l, d;
  
  attrs.counter = 0;
    
  for (i = 0; i < nodes.length; i++) {
    
    sigInst.addNode(nodes[i], {
      label: nodes[i],
      x: positionX(),
      y: positionY(),
      size: nodes.length >= 500 ? 3 : 5,
      color: "green",
      l: attrs.l, 
      d: attrs.d, 
      timer: 0
    });
  }
  
  for(i = 0; i < edges.length; i++) {
    
    sigInst.addEdge(i, edges[i][0], edges[i][1], {size: 2, probability: edges[i][2], hidden: true});
  }
  
  updateInfo({nodes: nodes.length, edges: edges.length});
  
  attrs.sigInst = sigInst;
  
  if (attrs.layout === "ForceAtlas2") {
    
    sigInst.startForceAtlas2();
    attrs.forceAtlas2 = true;
  } else {
    
    sigInst.position(0,0,1).draw();
    attrs.forceAtlas2 = false;
  }
  
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
      
    case "ForceAtlas2":
      return Math.cos(Math.PI*(attrs.counter++)/attrs.nodes.length)*attrs.R;
    case "Circle":
      return Math.cos(Math.PI*(attrs.counter++)/attrs.nodes.length)*attrs.R;
    default:
      return Math.random();
  }
};

function positionY() {
  
  switch(attrs.layout) {
      
    case "ForceAtlas2":
      return Math.sin(Math.PI*(attrs.counter++)/attrs.nodes.length)*attrs.R;
    case "Circle":
      return Math.sin(Math.PI*(attrs.counter++)/attrs.nodes.length)*attrs.R;
    default:
      return Math.random();
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