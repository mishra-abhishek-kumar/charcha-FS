const form = document.getElementById("form");
const formName = document.getElementById("form-name");
const formEmail = document.getElementById("form-email");
const formPhone = document.getElementById("form-phone");
const formPassword = document.getElementById("form-password");
const alert = document.querySelector(".alert");
const checkbox = document.getElementById("show-password");

form.addEventListener("submit", createUser);
checkbox.addEventListener("change", togglePassword);

async function createUser(e) {
	e.preventDefault();

	const userInfo = {
		name: `${formName.value}`,
		email: `${formEmail.value}`,
		phone: `${formPhone.value}`,
		password: `${formPassword.value}`,
	};

	try {
		const response = await axios.post(
			"http://localhost:4000/user/signup",
			userInfo
		);
		if (response.status == "201") {
			localStorage.setItem("accessToken", response.data.accessToken);
			localStorage.setItem("userName", response.data.user.name);
			localStorage.setItem("userId", response.data.user.id);
			window.location.href = `http://localhost:4000/views/chat.html`;
		}
	} catch (error) {
		if (error.response.status == "409") {
			alert.classList.add("error");
			alert.innerHTML = "User is already registered. Try Login!";
			setTimeout(() => {
				alert.classList.remove("error");
				alert.innerHTML = "";
			}, 5000);
		}
		console.log(error);
	}

	formName.value = "";
	formEmail.value = "";
	formPhone.value = "";
	formPassword.value = "";
}

function togglePassword() {
	if (checkbox.checked) {
		formPassword.type = "text";
	} else {
		formPassword.type = "password";
	}
}
