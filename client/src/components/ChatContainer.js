import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import ChatBoxReceiver, { ChatBoxSender } from "./ChatBox";
import InputText from "./InputText";
import UserLogin from "./UserLogin";

export default function ChatContainer() {
  let socketio = socketIOClient("http://localhost:5001");
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar"));

  useEffect(() => {
    socketio.on("chat", (senderChats) => {
      setChats(senderChats);
    });
  });

  function senderChatToSocket(chat) {
    socketio.emit("chat", chat);
  }

  function addMessage(chat) {
    const newChat = { ...chat, user, avatar };
    setChats([...chats, newChat]);
    senderChatToSocket([...chats, newChat]);
  }
  function logout(){
    localStorage.removeItem("user")
    localStorage.removeItem("avatar")
    setUser("")   
}
  function ChatsList(){
    return chats.map((chat, index) => {
      if(chat.user === user) return <ChatBoxSender key={index} message={chat.message} avatar={chat.avatar} user={chat.user}/>
      return <ChatBoxReceiver key={index} message={chat.message} avatar={chat.avatar} user={chat.user}/>
    })
  }

  return (
    <div>
      {user ?
      <div>
      <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <h4>Username:{user}</h4>
        <p onClick={() => logout()} style={{color:"blue", cursor:"pointer"}}>Log Out</p>
      </div>
        <ChatsList />
        <InputText addMessage={addMessage}/>


      </div>
      :
      <UserLogin setUser={setUser} />
      }
    </div>
  );
}
