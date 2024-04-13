const chats = document.getElementById("chats");
const welcomeMsg = document.getElementById("welcome-msg");
const formMessage = document.getElementById("message");
const chatForm = document.getElementById("chat-form");
const chatSection = document.getElementById("chat-section");

let chatType;
let chatId;

window.addEventListener("DOMContentLoaded", async () => {
	try {
		//hiding create-group form
		document.querySelector(".createGroup-container").style.display = "none";
		document.querySelector(".groupInfo-container").style.display = " none";
		document.querySelector(".groupEdit-container").style.display = " none";
		document.querySelector(".addNewUserToGroup-container").style.display =
			" none";

		//fetching all individual users
		const users = await axios.get(`http://localhost:4000/chat/get-users`, {
			headers: {
				Authorization: localStorage.getItem("accessToken"),
			},
		});

		for (let i = 0; i < users.data.users.length; i++) {
			displayUserAndGroup(users.data.users[i], "user");
		}

		//fetching all groups
		const userGroup = await axios.get(
			`http://localhost:4000/group/get-usergroups`,
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);

		for (let j = 0; j < userGroup.data.usergroups.length; j++) {
			const group = await axios.get(
				`http://localhost:4000/group/get-groups/${userGroup.data.usergroups[j].groupId}`,
				{
					headers: {
						Authorization: localStorage.getItem("accessToken"),
					},
				}
			);

			displayUserAndGroup(group.data.groups[0], "group");
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

function displayUserAndGroup(data, type) {
	let chat = document.createElement("div");
	chat.className = "chat";
	chat.setAttribute("id", data.id);
	chat.setAttribute("data-chat-type", type); // 'user' or 'group'

	let img = document.createElement("img");
	img.className = "user-profile";
	img.src = `https://avatar.iran.liara.run/public`;

	let name_lastMsg = document.createElement("div");
	name_lastMsg.className = "name-lastMessage";

	let userName = document.createElement("h3");
	userName.setAttribute("id", data.id);
	userName.innerText = data.name;

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
	let clickedElement = e.target.closest(".chat"); // Ensure we're getting the .chat div regardless of where the user clicks
	if (!clickedElement) return; // If for some reason the clicked element isn't what we expect, exit

	chatType = clickedElement.getAttribute("data-chat-type");
	chatId = parseInt(clickedElement.getAttribute("id"));

	// console.log(e.target.id);
	document.getElementById("welcome-right-container").style.display = "none";
	document.getElementById("message-right-container").style.display = "block";
	chatSection.innerHTML = "";

	if (chatType == "user") {
		try {
			document.getElementById("edit-button").style.display = "none";
			const response = await axios.get(
				`http://localhost:4000/chat/get-message/${chatId}`,
				{
					headers: {
						Authorization: localStorage.getItem("accessToken"),
					},
				}
			);

			const { chats, reciepientUser } = response.data;
			document.getElementById("chat-username").innerHTML = reciepientUser.name;

			for (let i = 0; i < chats.length; i++) {
				displayMessages(chats[i], chatType);
			}
		} catch (error) {
			console.log("Error in fetching chats", error);
		}
	} else if (chatType == "group") {
		document.getElementById("edit-button").style.display = "block";
		localStorage.setItem("groupId", chatId);
		try {
			const isAdmin = await axios.get(
				`http://localhost:4000/group/isAdmin/${localStorage.getItem(
					"userId"
				)}/${chatId}`,
				{
					headers: {
						Authorization: localStorage.getItem("accessToken"),
					},
				}
			);

			if (isAdmin.data.isAdmin.length > 0) {
				document.getElementById("if-admin").style.display = "block";
			} else {
				document.getElementById("if-admin").style.display = "none";
			}

			const response = await axios.get(
				`http://localhost:4000/group/get-messages/${chatId}`,
				{
					headers: {
						Authorization: localStorage.getItem("accessToken"),
					},
				}
			);

			const { chats, reciepientGroup } = response.data;
			document.getElementById("chat-username").innerHTML = reciepientGroup.name;
			localStorage.setItem("groupName", reciepientGroup.name);

			for (let i = 0; i < chats.length; i++) {
				displayMessages(chats[i], chatType);
			}
		} catch (error) {
			console.log("Error in fetching chats", error);
		}
	}
});

function displayMessages(chats, chatType) {
	if (chats.sentFrom === localStorage.getItem("userName")) {
		const ul = document.createElement("ul");
		ul.className = "messages-sender";

		if (chatType == "group") {
			const message = document.createElement("div");
			message.className = "singleMessage-sender";

			const sentFrom = document.createElement("h6");
			sentFrom.className = "message-name";
			sentFrom.innerText = chats.sentFrom;

			const li = document.createElement("li");
			li.className = "messages-style-sender-group";
			li.innerText = chats.message;

			const span = document.createElement("div");
			span.className = "message-time";
			span.innerText = chats.messageTime;

			message.appendChild(sentFrom);
			message.appendChild(li);
			message.appendChild(span);
			ul.appendChild(message);
		} else {
			const li = document.createElement("li");
			li.className = "messages-style-sender";
			li.innerText = chats.message;

			const span = document.createElement("span");
			span.className = "message-time";
			span.innerText = chats.messageTime;

			li.appendChild(span);
			ul.appendChild(li);
		}

		chatSection.appendChild(ul);
	} else {
		const ul = document.createElement("ul");
		ul.className = "messages-receiver";
		if (chatType == "group") {
			const message = document.createElement("div");
			message.className = "singleMessage-receiver";

			const sentFrom = document.createElement("h6");
			sentFrom.className = "message-name";
			sentFrom.innerText = chats.sentFrom;

			const li = document.createElement("li");
			li.className = "messages-style-receiver-group";
			li.innerText = chats.message;

			const span = document.createElement("div");
			span.className = "message-time";
			span.innerText = chats.messageTime;

			message.appendChild(sentFrom);
			message.appendChild(li);
			message.appendChild(span);
			ul.appendChild(message);
		} else {
			const li = document.createElement("li");
			li.className = "messages-style-receiver";
			li.innerText = chats.message;

			const span = document.createElement("span");
			span.className = "message-time";
			span.innerText = chats.messageTime;

			li.appendChild(span);
			ul.appendChild(li);
		}

		chatSection.appendChild(ul);
	}
}

//function to send message
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

		let endpoint;
		let messageInfo;
		if (chatType == "user") {
			endpoint = `http://localhost:4000/chat/send-message/${chatId}`;
			messageInfo = {
				userName: localStorage.getItem("userName"),
				message: formMessage.value,
				messageTime: timeOnly,
			};
		} else if (chatType == "group") {
			endpoint = `http://localhost:4000/group/send-message/${chatId}`;
			messageInfo = {
				userName: localStorage.getItem("userName"),
				message: formMessage.value,
				messageTime: timeOnly,
				groupId: chatId,
			};
		}

		const response = await axios.post(endpoint, messageInfo, {
			headers: {
				Authorization: localStorage.getItem("accessToken"),
			},
		});

		// if (response.status == "200") {
		// 	location.reload();
		// }

		formMessage.value = "";
	} catch (error) {
		console.log("Error in sending message", error);
	}
});

//user logout
document.getElementById("logOut").addEventListener("click", (e) => {
	localStorage.clear();
	window.location.href = "http://localhost:4000/views/landing.html";
});
