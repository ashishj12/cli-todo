const { MongoClient, ObjectId } = require('mongodb');
let connectionString = `mongodb://127.0.0.1:27017/`;

//handle help section
function printHelp() {
    console.log(`
        Usage: node [yourscript.js] [flag value]
        Flags:
          --add taskName    Add a new task with the given task name.
          --done taskId     Mark the task with the given ID as completed.
          --remove taskId  Remove the task with the given ID.
          --get taskId      Get the task with the given ID.
          --help              Show this help message.
        `);
}

//priority
function priorityValue(priority) {
    const priorities = {
        low: 0,
        medium: 1,
        high: 2
    };
    return priorities[priority];
}

//handle all tasks
async function handleAdd(flagValue, priority) {
    if (!flagValue) {
        printHelp()
        return
    }
    const client = new MongoClient(connectionString);
    try {
        await client.connect();
        console.log("Adding todo:", flagValue);
        const tasks = client.db().collection("tasks");
        const task = {
            taskName: flagValue,
            status: "in-progress",
            priority: priorityValue(priority)
        };
        const res = await tasks.insertOne(task);
        console.log("Inserted task with ID:", res.insertedId);
    } catch (err) {
        console.log("Error while creating task:", err);
    } finally {
        await client.close();
    }
}

//handle completed task
async function handleDone(id) {
    console.log("Entering handleDone function");
    const client = new MongoClient(connectionString);
    const query = { _id: ObjectId.createFromHexString(id) };

    try {
        await client.connect();

        const tasks = client.db().collection("tasks");
        const updateStatus = {
            $set: {
                status: "completed"
            }
        };
        const task = await tasks.findOneAndUpdate(query, updateStatus);
        console.log("Updated task:", task);
    } catch (err) {
        console.log("Error while updating task:", err);
    } finally {
        await client.close();
    }
    console.log("Marked todo as done:", id);
}

//handle remove task
async function handleRemove(id) {
    console.log("Removing todo:", id);
    const client = new MongoClient(connectionString);
    const query = { _id: ObjectId.createFromHexString(id) };
    try {
        await client.connect();
        const tasks = client.db().collection("tasks");
        const res = await tasks.deleteOne(query);
        console.log("Deleted count:", res.deletedCount);
    } catch (err) {
        console.log("Error while removing task:", err);
    } finally {
        await client.close();
    }
}

async function handleGet(id) {
    if (!id) {
        console.log("Getting all todos");
        await findAll();
        return;
    }
    await findOneTodo(id);
}

//get all task
async function findAll() {
    const client = new MongoClient(connectionString);
    const query = {};
    try {
        await client.connect();
        const tasks = client.db().collection("tasks");
        const cursor = tasks.find({ status: "in-progress" }).sort({priority:-1});
        let taskCount = 0;
        console.log("In-progress tasks:");
        await cursor.forEach(task => {
            taskCount++;
            console.log(`ID: ${task._id}, Task: ${task.taskName}`);
        });
        if (await cursor.count() === 0) {
            console.log("No todos found");
        }
        await cursor.forEach(console.dir);
    } catch (err) {
        console.log("Error while fetching all tasks:", err);
    } finally {
        await client.close();
    }
}

//handle one todo task
async function findOneTodo(id) {
    if (!ObjectId.isValid(id) || id.length !== 24) {
        console.error("Invalid ID");
        return;
    }
    const client = new MongoClient(connectionString);
    const query = { _id: ObjectId.createFromHexString(id) };
    try {
        await client.connect();
        const tasks = client.db().collection("tasks");
        const task = await tasks.findOne(query);
        console.log("Found task:", task);
    } catch (err) {
        console.log("Error while fetching task:", err);
    } finally {
        await client.close();
    }
}
module.exports = {
    printHelp,
    handleAdd,
    handleDone,
    handleRemove,
    handleGet,
    findAll,
    findOneTodo,
    priorityValue
};
