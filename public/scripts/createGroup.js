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

			for (let i = 0; i < response.data.users.length; i++) {
				displayUsersforGroup(response.data.users[i]);
			}
		} catch (error) {
			console.log("error in fetching users for group creation", error);
		}
	});

function displayUsersforGroup(user) {
	const userDiv = document.createElement("div");
    userDiv.className = 'user-div'

	const userCheckbox = document.createElement("input");
	userCheckbox.type = "checkbox";
	userCheckbox.id = user.id;
	userCheckbox.name = "users";
	userCheckbox.value = user.id;

	const userLabel = document.createElement("label");
	userLabel.htmlFor = `user-${user.id}`;
	userLabel.textContent = user.name;

	const adminCheckbox = document.createElement("input");
	adminCheckbox.type = "checkbox";
	adminCheckbox.id = user.id;
	adminCheckbox.name = "admins";
	adminCheckbox.value = user.id;

	const adminLabel = document.createElement("label");
	adminLabel.htmlFor = `admin-${user.id}`;
	adminLabel.textContent = "Admin";

	userDiv.appendChild(userCheckbox);
	userDiv.appendChild(userLabel);
	userDiv.appendChild(adminCheckbox);
	userDiv.appendChild(adminLabel);

	users.appendChild(userDiv);
}

const createGroupForm = document.getElementById("creategroup-form");
createGroupForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	// Get the text input value
	const groupName = document.getElementById("group-name").value;
	const groupDescription = document.getElementById("group-description").value || "";

	// Get the IDs of the checked checkboxes
	const selectedUsers = document.querySelectorAll('input[name="users"]:checked');
    const selectedAdmins = document.querySelectorAll('input[name="admins"]:checked');

    const userData = Array.from(selectedUsers).map(user => {
        return {
            id: parseInt(user.value),
            isAdmin: Array.from(selectedAdmins).some(admin => admin.value === user.value)
        };
    });

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
		const createGroupUsersResponse = await axios.post(
			`http://localhost:4000/group/create-group-users/${groupId}`,
			{ usersIds: userData },
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
