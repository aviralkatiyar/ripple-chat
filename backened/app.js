import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const secretkey="fstrsdtsjxuayvyacauk";
const port=3000;
const app=express();

const server=createServer(app);

const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    },
});
app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.get("/login",(req,res)=>{
   const token= jwt.sign({_id:"ftfhghvhjvhjvjhvjhtyvyjuy"},secretkey);
   res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"}).json({message:"Login success",

   });
});


io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
      if (err) return next(err);
  
      const token = socket.request.cookies.token;
      if (!token) return next(new Error("Authentication Error"));
  
      const decoded = jwt.verify(token, secretkey);
      next();
    });
  });


io.on("connection",(socket)=>{
console.log("User Connected",socket.id);

socket.on("message",(data)=>{
    console.log(data);
io.to(data.room).emit("receive-message",data.message);
})
socket.on("disconnect",()=>{
    console.log("user disconnected",socket.id);
})

socket.on("join-room",(room)=>{
    socket.join(room);
    console.log(`User joined room ${room}`);
})
})



server.listen(port,()=>{
    console.log(`server is running on ${port}`);
})