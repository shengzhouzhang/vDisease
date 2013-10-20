function Worker() {
  
  this.workers = [];
};

Worker.prototype.start = function(script) {
  
  var worker = new Worker(script);
  
  worker.addEventListener("message", function (event) {
    
    console.log(event.data);
    
  }, false);
  
};