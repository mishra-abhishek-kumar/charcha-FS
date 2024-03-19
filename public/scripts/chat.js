const formMessage = document.getElementById("message");
const chatContainer = document.getElementById("chat-container");
const form = document.getElementById("form");

let count = 0;
window.addEventListener("DOMContentLoaded", async () => {
	if (count == 0) {
		chatContainer.append(`${localStorage.getItem("userName")} joined`);
	}
	const chats = await axios.get("http://localhost:4000/chat/get-message", {
        headers: {
            Authorization: localStorage.getItem("accessToken"),
        },
    });
	chatContainer.append(chats.data);
});

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
			console.log(response.data);
		}

		formMessage.value = "";
	} catch (error) {
		console.log(error);
	}
});
