define([
  
],

function() {

  var attrs = {
    layout: "ForceAtlas2",
    color: "#339999",
    size: 4,
    min: 2,
    max: 10,
    stop: 0,
    strongGravityMode: false,
    gravity: 1,
    linLogMode: true,
    edgeWeightInfluence: 1,
    R: 200,
    counter: 0,
    exposed_period: 3,
    infectious_period: 5,
    interval: 1,
    probability: .2,
    showEdges: false,
    forceLabels: false
  };

  window.attrs = attrs;
  
  return attrs;
});