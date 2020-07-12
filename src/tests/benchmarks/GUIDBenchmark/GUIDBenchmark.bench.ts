import generateGUID from "../../../functions/generateGUID"
import { v4 } from "uuid"

const interations = 1000000

const startGenerateGUIDTime = process.hrtime()

for (let i = 0; i < interations; i++){
    generateGUID()
}

const generateGUIDTime = process.hrtime(startGenerateGUIDTime)

const startV4Time = process.hrtime()

for (let i = 0; i < interations; i++) {
    v4()
}

const v4Time = process.hrtime(startV4Time)


console.log(`generateGUID time: ${generateGUIDTime}\nv4 time: ${v4Time}`)