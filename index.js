const { MongoClient, ObjectId } = require('mongodb');
const db = require("./db.js");
//connect mongodb
let connectionString = `mongodb://127.0.0.1:27017`;
const flag = process.argv[2];
const value = process.argv[3];
const pFlag = process.argv[4];
var priority = 'medium'

//create flags
const addFlag = "--add";
const doneFlag = "--done";
const removeFlag = "--remove";
const getFlag = "--get";
const priorityFlag = "--p";
const helpFlag = '--help';

//length condition for helpflag
if (process.argv.length < 2 || flag === helpFlag) {
  db.printHelp();
  process.exit(1);
}

switch (flag) {
  case addFlag:
    handlePriorityFlag()
    db.handleAdd(value, priority);
    break;
  case doneFlag:
    db.handleDone(value);
    break;
  case removeFlag:
    db.handleRemove(value);
    break;
  case getFlag:
    db.handleGet(value);
    break;
  default:
    console.log("Invalid flag. Use --help to see all flags.");
    db.printHelp();
    break;
}

//function for handling priority
function handlePriorityFlag() { 
  if (priorityFlag) {
    priority = process.argv[5] || 'medium'
  }
}