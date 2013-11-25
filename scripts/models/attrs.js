define([
  
],

function() {

  var attrs = {
    layout: "ForceAtlas2",
    nodeColor: "rgba(15,125,160,1)",
    edgeColor: "rgba(15,125,160,.5)",
    size: 3,
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
    forceLabels: false,
    save: function() {

        if(typeof(localStorage) !== undefined) {

            localStorage.clear();
            localStorage.exposed_period = this.exposed_period;
            localStorage.infectious_period = this.infectious_period;
            localStorage.interval_value = this.interval;
            localStorage.probability = this.probability;
        }
    },
    load: function() {

        if(typeof(localStorage) !== 'undefined') {

            if (localStorage.exposed_period !== 'undefined')
                this.exposed_period = Number(localStorage.exposed_period);

            if (localStorage.infectious_period !== 'undefined') {
                this.infectious_period = Number(localStorage.infectious_period);
            }

            if (localStorage.interval_value !== 'undefined') {
                this.interval = Number(localStorage.interval_value);
                console.log(this.interval);
            }


            if (localStorage.probability !== 'undefined') {
                this.probability = Number(localStorage.probability);
            }
        }
    }
  };

  attrs.load();

  window.attrs = attrs;
  
  return attrs;
});