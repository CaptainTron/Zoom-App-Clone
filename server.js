let express = require('express')
let app = express();
const { v4:uuid }  = require('uuid')


// Socket Module 
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server); 

// This introduces peer stream so that two users can connect to each other synchronously
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug:true
})
// const server = require('http').Server(app);


app.set('view engine', 'ejs')

app.use(express.static('./public'))


app.use('/peerjs', peerServer);
app.get('/', (req, res)=>{
    console.log(uuid());
    res.redirect(`/${uuid()}`)
})

app.get('/:room', (req, res)=>{
    res.render('room' ,{roomId:req.params.room})
})

// Socket Module starts from here
io.on('connection', socket =>{
        socket.on('join-room', (roomId, userId)=>{
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);
            socket.on("NewMSg",(NewMSg)=>{
                socket.to(roomId).emit("newMsg", NewMSg);
            })
            socket.on('LeaveRoom',()=>{
                console.log(socket.id,"Left The Room");
                socket.to(roomId).emit("LeftTheRoom",userId);
                socket.leave(userId)
            })
            socket.on('disconnect',(userId)=>{
                console.log("User Disconnected");
                socket.to(roomId).emit("LeftTheRoom",userId);
            })
        })
})

server.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is Listening to port 3000......")
})
