import React, { useEffect, useMemo, useState } from 'react';
import {io} from "socket.io-client";

import { Box, Button, Container, Stack, TextField, Typography, getMobileStepperUtilityClass } from '@mui/material';

const App=()=> {
  const socket=useMemo(()=>io("http://localhost:3000",{withCredentials:true,}),[]);
  const [message,setmessage]=useState("");
  const [room,setRoom]=useState("");
  const [socketID,setSocketId]=useState("");
const [roomname,setRoomname]=useState("");
  const [messages,setMessages]=useState([]);


  console.log(messages);
const handleSubmit=(e)=>{
e.preventDefault();

socket.emit("message",{message,room});
setmessage("");
}
const joinroomhandler=(e)=>{
  e.preventDefault();
  socket.emit('join-room',roomname);
  setRoomname("");
}
  


  useEffect(()=>{
socket.on("connect",()=>{

  setSocketId(socket.id);
  console.log("connected",socket.id);


});
socket.on("receive-message",(data)=>{
  console.log(data);
  setMessages((messages)=>[...messages,data]);
})
socket.on("welcome",(s)=>{
console.log(s);
});

return ()=>{
  socket.disconnect();
};
  },[]);
  return (
  
  <Container maxWidth="sm">
  <Box sx={{height:200}}/>
    <Typography variant="h6" component="div" gutterBottom>
{socketID}

    </Typography>

    <form onSubmit={joinroomhandler}>
      <h5>Join Room</h5>
      <TextField id="outlined-basic"  value={roomname} onChange={e=>setRoomname(e.target.value)}label="Room Name" variant="outlined"/>
      <Button  type="submit" variant="contained" color="primary">JOIN</Button>
    </form>
    <form onSubmit={handleSubmit}>

      <TextField id="outlined-basic"  value={message} onChange={e=>setmessage(e.target.value)}label="Message" variant="outlined"/>
      <TextField id="outlined-basic"  value={room} onChange={e=>setRoom(e.target.value)}label="Room" variant="outlined"/>
      <Button  type="submit" variant="contained" color="primary">Send</Button>
    </form>

    <Stack>
      {
        messages.map((m,i)=>(
          <Typography key={i} variant="h6" component="div" gutterBottom>
{m}

    </Typography>
        ))
      }
    </Stack>
  </Container>
  
);


    
  
};

export default App;
