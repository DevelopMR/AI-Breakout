class Node {

  constructor(no) {
    this.number = no;
    this.inputSum = 0; //current sum i.e. before activation
    this.outputValue = 0; //after activation function is applied
    this.outputConnections = []; //new ArrayList<connectionGene>();
    this.layer = 0;
    this.drawPos = createVector();
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //the node sends its output to the inputs of the nodes its connected to
  engage() {

      //if((this.layer != 0)) { //no sigmoid for the inputs and bias
      if((this.layer != 0)) { //no sigmoid for the inputs and bias

        

          // this.outputValue = this.sigmoid(this.inputSum, 1); // 4.9
      
        
        // this.outputValue = Math.tanh(this.inputSum);
      

         if (this.layer != 2){ 
          this.outputValue = this.sigmoid(this.inputSum, 5); // 4.9
        } else 
        {
          this.outputValue = this.inputSum; 
        } 
        
/*         // try tanh
        if(this.layer == 4){
          this.outputValue = this.sigmoid(this.inputSum);
        }
        else{
          this.outputValue = Math.tanh(this.inputSum);
        } */
        
      }

      // hacky
      //if(this.layer != 3) {
        for(var i = 0; i < this.outputConnections.length; i++) { //for each connection
          
            this.outputConnections[i].toNode.inputSum += this.outputConnections[i].weight * this.outputValue; //add the weighted output to the sum of the inputs of whatever node this node is connected to
          
        }
      //}
    }

  engageNoSigmoid() {

    for(var i = 0; i < this.outputConnections.length; i++) { 
      //if(this.outputConnections[i].enabled) { 
        this.outputConnections[i].toNode.inputSum += this.outputConnections[i].weight * this.outputValue;
      //}
    }
  }

    //----------------------------------------------------------------------------------------------------------------------------------------
    //not used
   stepFunction(x) {
      if(x < 0) {
        return 0;
      } else {
        return 1;
      }
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //sigmoid activation function
  sigmoid(x, bias) {
      //return 1.0 / (1.0 + pow(Math.E, -4.9 * x)); //todo check pow

      return 1.0 / (1.0 + pow(Math.E, -bias*x)); // 1 = no gain ; higher gain approaches -1, 1 faster
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns whether this node connected to the parameter node
    //used when adding a new connection
  isConnectedTo(node) {
      if(node.layer == this.layer) { //nodes in the same this.layer cannot be connected
        return false;
      }

      //you get it
      if(node.layer < this.layer) {
        for(var i = 0; i < node.outputConnections.length; i++) {
          if(node.outputConnections[i].toNode == this) {
            return true;
          }
        }
      } else {
        for(var i = 0; i < this.outputConnections.length; i++) {
          if(this.outputConnections[i].toNode == node) {
            return true;
          }
        }
      }

      return false;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns a copy of this node
  clone() {
    var clone = new Node(this.number);
    clone.layer = this.layer;
    return clone;
  }
}
