const users = document.getElementById("users");

document
	.getElementById("showCreateGroupBtn")
	.addEventListener("click", async function () {
		document.querySelector(".createGroup-container").style.display = "block";
		try {
			const response = await axios.get(`http://localhost:4000/chat/get-users`, {
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			});
			// console.log(response.data.users);

			for (let i = 0; i < response.data.users.length; i++) {
				displayUsersforGroup(response.data.users[i]);
			}
		} catch (error) {
			console.log("error in fetching users for group creation", error);
		}
	});

function displayUsersforGroup(user) {
	let label = document.createElement("label");
	label.innerHTML = user.name;

	let input = document.createElement("input");
	input.type = "checkbox";
	input.setAttribute("id", user.id);

	label.appendChild(input);
	users.appendChild(label);
}

const groupName = document.getElementById("group-name");
const createGroupForm = document.getElementById("creategroup-form");
createGroupForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	// Get the text input value
	const groupName = document.getElementById("group-name").value;
	const groupDescription =
		document.getElementById("group-description").value || "";

	// Get the IDs of the checked checkboxes
	const checkedCheckboxes = document.querySelectorAll("input:checked");

	const checkedIds = Array.from(checkedCheckboxes).map(
		(checkbox) => checkbox.id
	);

	try {
		const createGroupResponse = await axios.post(
			`http://localhost:4000/group/create-group`,
			{ groupName: groupName, groupDescription: groupDescription },
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);
		var groupId = createGroupResponse.data.group.id;
	} catch (error) {
		console.log("Error in createGroup FrontEnd", error);
	}

	try {
		console.log("11111", checkedIds, typeof checkedIds);
		const createGroupUsersResponse = await axios.post(
			`http://localhost:4000/group/create-group-users/${groupId}`,
			{ usersIds: checkedIds },
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);
	} catch (error) {
		console.log("Error in group users creation FrontEnd", error);
	}

	document.querySelector(".createGroup-container").style.display = "none";
});

document.getElementById("cancelBtn").addEventListener("click", function () {
	document.querySelector(".createGroup-container").style.display = "none";
    location.reload();
});
