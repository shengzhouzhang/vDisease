function generateTestCase() {
  
  var i, N = 3000, E = 9000, C = 5, d = .75, clusters = [], nodes = [], edges = [];
  
  for(i = 0; i < C; i++) {
    
    clusters.push({
      nodes: [],
      color: 'rgb('+Math.round(Math.random()*256)+','+
      Math.round(Math.random()*256)+','+
      Math.round(Math.random()*256)+')'
    });
  }
  
  for(i = 0; i < N; i++) {

    var cluster = clusters[(Math.random()*C)|0];
    
    nodes.push({
      id: i,
      color: cluster.color
    });
    
    cluster.nodes.push(i);
  }
  
  var node1;
  var node2;
  
  for (i = 0; i < E; i++){
    
    if(Math.random() < 1-d) {
      
      node1 = (Math.random()*N|0);
      node2 = (Math.random()*N|0);
      
       edges.push([node1, node2, 0.6, nodes[node1].color, nodes[node2].color].join("\t"));
      
    } else {
      
      var cluster = clusters[(Math.random()*C)|0], n = cluster.nodes.length;
      
      node1 = Math.random()*n|0;
      node2 = Math.random()*n|0;
      
      edges.push([cluster.nodes[node1], cluster.nodes[node2], 0.6, cluster.color, cluster.color].join("\t"));

    }
  }
  
  var stream = edges.join("\r\n");
  
  $("<a>").attr("href", "data:application/octet-stream," + encodeURIComponent(stream)).text("Test Data").appendTo($("body"));
  
  
  //console.log(stream);
};