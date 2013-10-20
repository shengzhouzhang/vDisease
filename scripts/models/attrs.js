define([
  
],

function() {

  var attrs = {
    layout: "ForceAtlas2",
    stop: 0,
    strongGravityMode: false,
    gravity: 1,
    linLogMode: true,
    edgeWeightInfluence: 1,
    R: 200,
    counter: 0,
    l: 3,
    d: 5,
    interval: 2000,
    showEdges: false,
    forceLabels: false
  };

  window.attrs = attrs;
  
  return attrs;
});