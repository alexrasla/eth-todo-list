//updates the actual state of the blockchain
//whenever deploying contact, updating the actual state of the blockchain

// const { artifacts } = require("truffle");

//truffle creates artifact from TodoList.json (abstraction of smart contract that truffle understands)
var TodoList = artifacts.require("TodoList");

module.exports = function(deployer) {
  deployer.deploy(TodoList);
};
