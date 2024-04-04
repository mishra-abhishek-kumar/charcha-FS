const chats = document.getElementById("chats");
const welcomeMsg = document.getElementById("welcome-msg");
const formMessage = document.getElementById("message");
const chatForm = document.getElementById("chat-form");
const chatSection = document.getElementById('chat-section');

let reciepientId = 0;

window.addEventListener("DOMContentLoaded", async () => {
	try {
		const users = await axios.get(`http://localhost:4000/chat/get-users`, {
			headers: {
				Authorization: localStorage.getItem("accessToken"),
			},
		});

		for (let i = 0; i < users.data.users.length; i++) {
			displayUsers(users.data.users[i]);
		}

		//Events to change selected chat background color
		const allChats = document.querySelectorAll(".chat");
		allChats.forEach((chat) => {
			chat.addEventListener("click", changeChatColor);
		});

		function changeChatColor(event) {
			allChats.forEach((chat) => {
				chat.classList.remove("changed-color");
			});
			event.target.classList.add("changed-color");
		}

		welcomeMsg.innerText = `Hi ${localStorage.getItem(
			"userName"
		)}, select a chat to start conversation`;

		document.getElementById("message-right-container").style.display = "none";
	} catch (error) {
		console.log("Error in chat window reload", error);
	}
});

function displayUsers(userData) {
	let chat = document.createElement("div");
	chat.className = "chat";
	chat.setAttribute("id", userData.id);

	let img = document.createElement("img");
	img.className = "user-profile";
	img.src = `https://avatar.iran.liara.run/public`;

	let name_lastMsg = document.createElement("div");
	name_lastMsg.className = "name-lastMessage";

	let userName = document.createElement("h3");
	userName.setAttribute("id", userData.id);
	userName.innerText = userData.name;

	let lastMessage = document.createElement("p");
	lastMessage.className = "last-message";

	//appending childs to parent
	name_lastMsg.appendChild(userName);
	name_lastMsg.appendChild(lastMessage);
	chat.appendChild(img);
	chat.appendChild(name_lastMsg);

	chats.appendChild(chat);
}

chats.addEventListener("click", async (e) => {
	// console.log(e.target.id);
	document.getElementById("welcome-right-container").style.display = "none";
	document.getElementById("message-right-container").style.display = "block";
	chatSection.innerHTML = "";

	reciepientId = parseInt(e.target.id);
	console.log(reciepientId);
	try {
		// console.log("11111111");
		const response = await axios.get(
			`http://localhost:4000/chat/get-message/${reciepientId}`,
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);
		// console.log(response.data);
		const { chats, reciepientUser } = response.data;
		console.log("Chats:", chats);
		// console.log("Recipient User:", reciepientUser.name);
		document.getElementById("chat-username").innerHTML = reciepientUser.name;

		for (let i = 0; i < chats.length; i++) {
			displayMessages(chats[i]);
		}
	} catch (error) {
		console.log("Error in fetching chats", error);
	}
});


function displayMessages(chats) {
    if(chats.sentFrom === localStorage.getItem('userName')) {
        const ul = document.createElement('ul');
        ul.className = 'messages-sender';

        const li = document.createElement('li');
        li.className = 'messages-style-sender';
        li.innerText = chats.message;

        const span = document.createElement('span');
        span.className = 'message-time';
        span.innerText = chats.messageTime;

        li.appendChild(span);
        ul.appendChild(li);

        chatSection.appendChild(ul);
    } else {
        const ul = document.createElement('ul');
        ul.className = 'messages-receiver';

        const li = document.createElement('li');
        li.className = 'messages-style-receiver';
        li.innerText = chats.message;

        const span = document.createElement('span');
        span.className = 'message-time';
        span.innerText = chats.messageTime;

        li.appendChild(span);
        ul.appendChild(li);

        chatSection.appendChild(ul);
    }

}

chatForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	try {
		let currentDate = new Date();
		let hours = currentDate.getHours();
		let minutes = currentDate.getMinutes();
		// Ensure minutes and hours are displayed with leading zeroes if necessary
		hours = hours < 10 ? "0" + hours : hours;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		let timeOnly = hours + ":" + minutes;

		const response = await axios.post(
			`http://localhost:4000/chat/send-message/${reciepientId}`,
			{
				userName: localStorage.getItem("userName"),
				message: formMessage.value,
				messageTime: timeOnly,
			},
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);

		// if (response.status == "200") {
		// 	location.reload();
		// }

		formMessage.value = "";
	} catch (error) {
		console.log("Error in sending message", error);
	}
});
