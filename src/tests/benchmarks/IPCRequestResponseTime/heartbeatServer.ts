import express from  "express"
const app = express()
app.use(express.urlencoded({extended:true}))
app.get("/", (req,res) => {
    console.log("heartbeat received")
    res.send("asd")
})
app.post("/", (req, res) => {
  console.log(JSON.stringify(req));
  res.send("asd");
});
app.listen(3000)
export const heartbeat = app