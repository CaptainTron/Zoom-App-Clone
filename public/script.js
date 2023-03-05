const socket = io()

let msg = document.querySelector(".msg")

const video_grid = document.getElementById('video-grid')
const myvideo = document.createElement('video');
myvideo.muted = true;

var peer = new Peer(undefined, {
    path:'/peerjs',
    host:'/',
    port: '443'
});


let myVideoStream
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myvideo,stream);

    peer.on('call', call=>{
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream=>{
        addVideoStream(video, userVideoStream);
     })
 })
 
 socket.on("user-connected",(userId)=>{
    NewUserConneted(userId, stream);
    let msgs = document.createElement('li')
    msgs.textContent = `A User Joined the Room `;
    msg.appendChild(msgs);
    MessageSection.scrollTop = MessageSection.scrollHeight;
 })
})

// Show When User Is Disconnected From the Room
socket.on("LeftTheRoom",(userId)=>{
    let msgs = document.createElement('li')
    msgs.textContent = `A User Left the Room `;
    msg.appendChild(msgs);
    MessageSection.scrollTop = MessageSection.scrollHeight;
})

// console.log(ROOM_ID);
// socket module
peer.on('open', id=>{
    socket.emit('join-room', ROOM_ID, id);
})



const NewUserConneted = (userId, stream)=>{
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream=>{
        addVideoStream(video, userVideoStream);
    })
}


const addVideoStream = (video, stream) =>{
    video.srcObject  = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    })
    video_grid.append(video)
}

// Enter Message IN the field
let MessageSection = document.querySelector(".MessageSection");

let NewMsg = document.getElementById("EnterMsg")
NewMsg.addEventListener('keypress',(e)=>{
    if(e.key==="Enter"){
        let msgs = document.createElement('li')
        msgs.textContent = `ME: ` + NewMsg.value;
        msg.appendChild(msgs)
        socket.emit("NewMSg",NewMsg.value);
        MessageSection.scrollTop = MessageSection.scrollHeight
        NewMsg.value = '';
    }
})
socket.on("newMsg",(NewMsg)=>{
    let msgs = document.createElement('li')
        msgs.textContent = `User: ` + NewMsg;
        msg.appendChild(msgs)
        MessageSection.scrollTop = MessageSection.scrollHeight
})

// Mute unMute Goes Here
let microphone = document.querySelector('.microphone')
const MuteUnmute = ()=>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        microphone.innerHTML = `<i class="fa-solid fa-microphone-slash"></i><div>Unmute</div>`
        microphone.style.color = 'red';
        
    }else{
        microphone.style.color = 'white';
        myVideoStream.getAudioTracks()[0].enabled = true;
        microphone.innerHTML = `<i class="fa-solid fa-microphone"></i><div>Mute</div>`
    }
}

// this one for Video
let video = document.querySelector(".video")
let grid = document.querySelector("#video-grid"); 
const playstop = ()=>{
    let enabled = myVideoStream.getVideoTracks()[0].enabled
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        video.style.color = 'red';
        video.innerHTML = `<i class="fa-solid fa-video-slash"></i><div>Start Video</div>`;
    }else{
        // grid.innerHTML = "";
        video.style.color = 'white';
        myVideoStream.getVideoTracks()[0].enabled = true;
        video.innerHTML = `<i class="fa-solid fa-video"></i><div>Stop Video</div>`;
    }

}

// Leave the room 
const Leave = document.querySelector('.Leave')
Leave.addEventListener('click',()=>{
    socket.emit("LeaveRoom")
    grid.style.color = 'white';
    grid.innerHTML = `You Left The Room :(`;
    
})

// Shield Button 
let Shield = document.querySelector(".Shield")
let Message = document.querySelector(".Message")
let showpopup = document.querySelector(".showpopup");
let ShieldColor = document.querySelector(".Shield i")
Shield.addEventListener('click',()=>{
    Message.innerHTML = `You are Not Protected 👿`
    Message.style.color = 'red';
    showpopup.classList.toggle("Display")
    ShieldColor.classList.toggle("DisplayColor")
})

let About = document.querySelector(".About");
About.addEventListener("click",()=>{
    Message.style.color = 'white';
    showpopup.classList.toggle("Display")
    Message.innerHTML = `App build by Vaibhav Yadav`;
})