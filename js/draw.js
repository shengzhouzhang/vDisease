function draw(nodes, edges, options) {
  
  var threshold = 2000;
  var renderTime = 7000;
  
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
  
  var i, R = 200, j = 0, L = nodes.length;
    
  for (i = 0; i < nodes.length; i++) {
    
    sigInst.addNode(nodes[i], {
      label: nodes[i],
      x: Math.cos(Math.PI*(j++)/L)*R,
      y: Math.sin(Math.PI*(j++)/L)*R,
      //x: Math.random(),
      //y: Math.random(),
      size: nodes.length >= 500 ? 3 : 5,
      color: options.colors.length === nodes.length ? options.colors[i] : "green",
      l: 3, 
      d: 5, 
      timer: 0
    });
  }
  
  for(i = 0; i < edges.length; i++) {
    
    sigInst.addEdge(i, edges[i][0], edges[i][1], {size: 2, probability: edges[i][2]});
  }
  
  //sigInst.position(0,0,1).draw();
  
  if (nodes.length > threshold) {
    
    /*
    sigInst.iterNodes(function(n) {
      
      n.hidden = true;
    });
    */
    
    renderTime = renderTime * (nodes.length / threshold);
  }
  
  sigInst.startForceAtlas2();
    
  setTimeout(function(){
    
    if (nodes.length > threshold)
      sigInst.iterNodes(function(n) {
        
        n.hidden = false;
      });
    
    sigInst.stopForceAtlas2();
    
    affect(sigInst, {inits: ["81"]});
    
  }, renderTime);
  
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

function randomColor() {
  
  return 'rgb('+Math.round(Math.random()*256)+','+
                      Math.round(Math.random()*256)+','+
                      Math.round(Math.random()*256)+')';
};