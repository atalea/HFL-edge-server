var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
const app = express();
const tf = require('@tensorflow/tfjs');
const fs = require('fs/promises')
const PORT = 3000;
const axios = require('axios')
const formidable = require("formidable")
require("dotenv").config()
const token = process.env.TOKEN
const { createServer } = require('http')
const { Server } = require("socket.io")
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    allowedHeaders: ["Authorization"],
    credentials: false
  }
})
const { NetworkCount, callApi } = require("./util")
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// console.log(process);
io.on('connection', (sock)=>{
  sock.on('disconnect', () =>{
    console.log(`${sock.handshake.address} disconnected`);
  })
  sock.on('register', async () => {
    const jsonData = await fs.readFile('./.clients.json')
    const {clients} = JSON.parse(jsonData)
    console.log(clients)
    const new_ip = sock.handshake.address.startsWith('::ffff:') ? sock.handshake.address.slice(7) : sock.handshake.address
  
    if (!clients.filter((ip) => new_ip == ip).length) {
      clients.push(new_ip)
      await fs.writeFile("./.clients.json", JSON.stringify({ clients }))
      sock.send('message', {msg : "ip added"})
    } else {
      sock.send('message', {msg : "ip not added"})
    }
  });
});

const setup = async () => {
  
  try {
    const files = await fs.readdir(process.cwd())
    if(files.filter(f=>f===".clients.json").length === 0) {
      fs.writeFile("./.clients.json", JSON.stringify({ clients:[] }))
    }
    //register itself with the central server
    const response = axios({
      url:"http://" + process.env.CENTRAL_SERVER + ":3001/register/edge-server",
      headers:{
        Authorization:"Bearer " + process.env.TOKEN
      },
      method:'PUT'
    })
    .then(function (response){
      console.log(response?.data);
    })
  } catch (error) {
    console.log(error);
  }
}  

setup();
//require token
app.use("*", (req, res, next) => {
  console.log("HERE");
  const prefix = "Bearer "
  const auth = req.header("Authorization")
  if (!auth || auth.slice(prefix.length) != token) {
    next({ error: "unauthorized user", message: "no access" })
  }
  next()
})

io.use((socket, next) => {
  const prefix = "Bearer "
  const auth = socket.handshake.headers.authorization
  if (!auth || auth.slice(prefix.length) != token) {
    next({ error: "unauthorized user", message: "no access" })
  }
  next()
})

/**
 * entrypoint for testing.
 */
app.post("/recieve/train-clients", async (req, res, next) => {
  const { iterations } = req.body
  console.log(iterations)
  //get viable edge-servers and clients
  const viableClients = 0
  for (let i = 0; i < clients.length; i++) {
    const ip = clients[i]
    try {
      const res = await callApi({
        url: `${ip}/send/viable`,
        token,
      })
      const data = await res.json()
      console.log(data)
      viableClients++
    } catch (error) {
      console.error(error)
    }
  }

  //send a request to each client for it to train its model n times.
  // send the data & model
  const results = []
  for (let i = 0; i < iterations.edge_server; i++) {
    try {
      const response = await callApi({
        url: `${ip}/receive/train-clients`,
        token,
        body: {
          iterations,
        },
      })
      const form = formidable({ multiples: true })

      form.parse(response, (err, fields, files) => {
        if (err) {
          next(err)
          return
        }
        //parse the models that come back
        console.log('fields :>> ', fields);
        console.log('files :>> ', files);
      })
      //parse res into TF model
      //determine if a client has dropped oreq.ipt
      results.push({id:i,fields,files})
      //aggregate current model with new model
    } catch (error) {
      console.error(error)
    }
  }
});

app.post("/upload", (req, res, next) => {
  const form = formidable({ multiples: true })

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err)
      return
    }
    res.json({ fields, files })
  })
})

app.get('/',(req,res,next)=>{
    res.send("server is running!")
})

app.use("*", (req, res, next) => {
    res.status(404);
    res.send({ error: "Request not found." });
    console.error("request not found");
});
  
app.use((error, req, res, next) => {
    res.status(500);
    res.send({ error });
    console.error(error);
});

httpServer.listen(PORT,()=>{
    //on startup try to register with the central server
    // callApi("central server ip and port" + "/register/edge-server" )
  console.log("listening on port: ", PORT);
});
