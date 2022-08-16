pragma solidity ^0.5.0; //define version of solidity

//creates actual todolist contract, same name as file name 
contract TodoList { 

 //updates and written on actual blockchain, state variable (represents states on blockchain)
 uint public taskCount = 0; 

 //content of an actual Task
 struct Task {
    uint id;
    string content;
    bool completed;
 }
 // hash that maps an unique id to a Task
 //     can be used to list tasks, add to tasks
 mapping(uint => Task) public tasks;
 
 event TaskCreated(
    uint id, 
    string content,
    bool completed
 );

 event TaskCompleted(
    uint id, 
    bool completed
 );

 constructor() public {
    createTask("Create tasks!!!");
 }

 //everytime new task, increment task count, and add task to mapping
 function createTask(string memory _content) public {
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false);

    //triggers event that notifies people of change on blockchain
    emit TaskCreated(taskCount, _content, false);
 }

 function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    
    emit TaskCompleted(_id, _task.completed);
}
}