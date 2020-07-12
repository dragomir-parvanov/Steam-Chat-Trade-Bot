/* eslint-disable @typescript-eslint/no-var-requires */

const { fork } = require("child_process")
const {filter,first} = require("rxjs/operators")
const {Subject} = require("rxjs")

const {EventEmitter} = require("events")
const forkOptions = {
  stdio: ["pipe", "pipe", "pipe", "ipc"]
};

const child = fork("child.js", [], forkOptions)
child.stdout.on("data", (data) => {
    console.log(`Stoud ${data} end`)
})
const event = new EventEmitter()

const requestStream = new Subject()


child.on("message", (message) => {
    console.log("received message in parent")
    requestStream.next(message)
})

function waitForTransaction(id) {
    return new Promise(resolve => {
        requestStream.pipe(first(), filter(m => m.transactionId === id)).subscribe({next: (message) => resolve(message)})
    })
}

let currentId = 0
function createId() {
    return ++currentId;
}

function wait(time) {
    return new Promise((resolve) => {
        setTimeout(resolve,time)
    })
}

async function asyncScope() {
    for (let i = 0; i < 100000000; i++){
        console.log("init")
        const id = createId()
        child.send({ body: i, transactionId: id })
        const result = await waitForTransaction(id)
        console.log(`iteration ${i+1} result ${JSON.stringify(result)}`)
    }
}

wait(5000).then(asyncScope)