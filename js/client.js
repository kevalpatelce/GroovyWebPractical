var socket = io('http://localhost:8000', {transports: ['websocket']});

const form = document.getElementById('send_message_form');
const message_text = document.getElementById('message_text');
const message_container = document.querySelector('.container');

//audio for when user recceive message from other user
var audio = document.createElement("AUDIO")
document.body.appendChild(audio);
audio.src = "messageTone.mp3"

//right position for Sender
//left position for Receiver
const append = (message, position)=>{
	const messageElement = document.createElement('div');
	messageElement.innerText = message;
	messageElement.classList.add(`${position}`);
	messageElement.classList.add(position);
	if(position == 'right'){
		audio.play();
	}
	
	message_container.append(messageElement);
}

form.addEventListener('submit',(e)=>{
	e.preventDefault();
	const message = message_text.value;
	append(`You: ${message}`, 'right');
	socket.emit('send',message);
	message_text.value = '';
});

//user will be add his/her name for join the chat
let name = prompt('Enter your name');
if(name == null || name == ''){
	alert("name is required");
	socket.close();
	location.reload();
}

//message will send to all users when one user join the chat 
socket.emit('new-user-join', name);

//when user send message to other user
socket.on('user-joined', name =>{
	append(`${name} joined the chat`, 'right');
});

//When a user receives a message from another user
socket.on('receive', data =>{
	append(`${data.name}:${data.message}`, 'left');
});

//message will received to all users when user left the chat
socket.on('left', name =>{
	append(`${name}: left the chat`, 'left');
});