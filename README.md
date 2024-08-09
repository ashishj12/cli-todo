# Todo List CLI Application

This is a simple command-line interface (CLI) application for managing a todo list using MongoDB.

## Prerequisites

* You have installed Node.js and npm (Node Package Manager)
* You have a MongoDB instance running locally on the default port (27017)

## Installing Todo List CLI Application

To install the Todo List CLI Application, follow these steps:

1. Clone the repository:
   git clone https://github.com/ashishj12/cli-todo.git
   
2. Navigate to the project directory:
    cd cli-todo
   
3. Install the dependencies:
    npm install
   
4. Connect your local mongodb in index.js file

5. for help section of todo
    node index.js --help
   
6. Add todo task
   node index.js --add "your Task"
   
7. get all task
   node index.js --get

8. mark done to task
   node index.js --done "id of your task"
