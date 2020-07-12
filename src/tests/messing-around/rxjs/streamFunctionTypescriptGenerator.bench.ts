import { Subject } from "rxjs";
import wait from "../../../functions/wait";

const stream = new Subject()
let count = 0;
function bindStream() {
   stream.subscribe({
     next: async message => {
       await wait(10);
           console.log(message, count++);
           await wait(10)
     }
   });
}


async function asyncLoop() {
    for (let i = 0; i<5000; i++){
        await wait(10)
        stream.next("asd")

    }

}
bindStream()
asyncLoop()