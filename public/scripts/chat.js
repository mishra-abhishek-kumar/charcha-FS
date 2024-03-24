const formMessage = document.getElementById("message");
const chatContainer = document.getElementById("chat-container");
const form = document.getElementById("form");
const user = document.getElementById("user");

let lastmsgId =
	localStorage.getItem("lastmsgId") !== null
		? Number(localStorage.getItem("lastmsgId"))
		: 0;

window.addEventListener("DOMContentLoaded", async () => {
	user.append(`${localStorage.getItem("userName")} joined`);

	try {
		const response = await axios.get(
			`http://localhost:4000/chat/get-message/${lastmsgId}`,
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);

		const messages = response.data;
		const storedMessages = JSON.parse(localStorage.getItem("chats")) || [];
		const allMessages = [...storedMessages, ...messages];
		localStorage.setItem("chats", JSON.stringify(allMessages));
		displayMessages(allMessages);
		localStorage.setItem("lastmsgId", allMessages.length);
	} catch (error) {
		console.log("Error fetching messages: ", error);
	}
});

function displayMessages(messages) {
	messages.forEach((message) => {
		chatContainer.append(`${message.sentFrom}: ${message.message}`);
	});
}

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	try {
		const response = await axios.post(
			"http://localhost:4000/chat/send-message",
			{
				userName: (document.getElementById("userName").value =
					localStorage.getItem("userName")),
				message: formMessage.value,
			},
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);

		if (response.status == "200") {
			location.reload();
		}

		formMessage.value = "";
	} catch (error) {
		console.log(error);
	}
});

//to run the page again n agaon to get the messages
// setInterval(() => {
// 	location.reload();
// }, 5000);
