const editGroupBtn = document.getElementById("edit-button");
const editMenu = document.getElementById("edit-menu");

// Function to toggle menu visibility
const toggleMenu = (event) => {
	if (editMenu.classList.contains("hidden")) {
		editMenu.classList.remove("hidden");
		event.stopPropagation(); // Prevent immediate hiding
	} else {
		editMenu.classList.add("hidden");
	}
};

// Click event to toggle the menu
editGroupBtn.addEventListener("click", toggleMenu);

// Global click event to hide the menu
document.addEventListener("click", (e) => {
	if (!editMenu.contains(e.target) && e.target !== editGroupBtn) {
		editMenu.classList.add("hidden");
	}
});

// Stop propagation for menu clicks to prevent it from closing when interacting with it
editMenu.addEventListener("click", (e) => {
	e.stopPropagation();
});

//to fetch groupInfo
const groupInfoBtn = document.getElementById("groupInfoBtn");
const closeGroupInfoBtn = document.getElementById("close-groupInfo");

groupInfoBtn.addEventListener("click", async (e) => {
	document.getElementById("message-right-container").style.width = "40vw";
	document.getElementById("message").style.width = "29vw";
	editMenu.classList.add("hidden");
	document.querySelector(".groupInfo-container").style.display = "block";

	//appending paragaprah for group member
	const p = document.createElement("p");
	p.innerHTML = "group members";
	document.getElementById("group-members").appendChild(p);

	try {
		const fetchingGroupUsers = await axios.get(
			`http://localhost:4000/group/group-users/${localStorage.getItem(
				"groupId"
			)}`,
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);

		const { groupUsers } = fetchingGroupUsers.data;

		displayGroupInformation(
			groupUsers.length,
			localStorage.getItem("groupName")
		);

		for (let i = 0; i < groupUsers.length; i++) {
			const user = await axios.get(
				`http://localhost:4000/group/get-single-user/${groupUsers[i].userId}`,
				{
					headers: {
						Authorization: localStorage.getItem("accessToken"),
					},
				}
			);

			displayGroupUsers(user.data.user, groupUsers[i].isAdmin);
		}
	} catch (error) {
		console.log("Error in fetching group users", error);
	}
});

function displayGroupInformation(length, groupName) {
	let img = document.createElement("img");
	img.src = "https://avatar.iran.liara.run/public";

	let h2 = document.createElement("h2");
	h2.innerText = groupName;

	let p = document.createElement("p");
	p.innerText = `Group . ${length} members`;

	document.getElementById("groupImg-Name").appendChild(img);
	document.getElementById("groupImg-Name").appendChild(h2);
	document.getElementById("groupImg-Name").appendChild(p);
}

function displayGroupUsers(data, isAdmin) {
	let member = document.createElement("div");
	member.className = "member";

	let img = document.createElement("img");
	img.src = `https://avatar.iran.liara.run/public`;

	let h3 = document.createElement("h3");
	h3.innerText = data.name;

	member.appendChild(img);
	member.appendChild(h3);

	if (isAdmin) {
		let span = document.createElement("span");
		span.innerText = "Group admin";
		span.className = "isAdmin";
		member.appendChild(span);
	}

	document.getElementById("group-members").appendChild(member);
}

closeGroupInfoBtn.addEventListener("click", (e) => {
	document.querySelector(".groupInfo-container").style.display = " none";
	document.getElementById("message-right-container").style.width = "70vw";
	document.getElementById("message").style.width = "59vw";
	document.getElementById("group-members").innerHTML = "";
	document.getElementById("groupImg-Name").innerHTML = "";
});

//Edit group functions

const closeGroupEditBtn = document.getElementById("close-groupEdit");

document.getElementById("groupEditBtn").addEventListener("click", async (e) => {
	document.getElementById("message-right-container").style.width = "40vw";
	document.getElementById("message").style.width = "29vw";
	editMenu.classList.add("hidden");
	document.querySelector(".groupEdit-container").style.display = "block";

	//appending paragaprah for group member
	const p = document.createElement("p");
	p.innerHTML = "group members";
	document.getElementById("group-members1").appendChild(p);

	try {
		const fetchingGroupUsers = await axios.get(
			`http://localhost:4000/group/group-users/${localStorage.getItem(
				"groupId"
			)}`,
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);

		const { groupUsers } = fetchingGroupUsers.data;

		console.log(groupUsers);

		displayGroupInformation1(
			groupUsers.length,
			localStorage.getItem("groupName")
		);

		for (let i = 0; i < groupUsers.length; i++) {
			const user = await axios.get(
				`http://localhost:4000/group/get-single-user/${groupUsers[i].userId}`,
				{
					headers: {
						Authorization: localStorage.getItem("accessToken"),
					},
				}
			);
			console.log(user);

			displayGroupUsers1(user.data.user, groupUsers[i].isAdmin);
		}
	} catch (error) {
		console.log("Error in fetching group users", error);
	}
});

function displayGroupInformation1(length, groupName) {
	let img = document.createElement("img");
	img.src = "https://avatar.iran.liara.run/public";

	let h2 = document.createElement("h2");
	h2.innerText = groupName;

	let p = document.createElement("p");
	p.innerText = `Group . ${length} members`;

	document.getElementById("groupImg-Name1").appendChild(img);
	document.getElementById("groupImg-Name1").appendChild(h2);
	document.getElementById("groupImg-Name1").appendChild(p);
}

function displayGroupUsers1(data, isAdmin) {
	let member = document.createElement("div");
	member.className = "member";

	let img = document.createElement("img");
	img.src = `https://avatar.iran.liara.run/public`;

	let h3 = document.createElement("h3");
	h3.innerText = data.name;

	member.appendChild(img);
	member.appendChild(h3);

	if(isAdmin) {
		let span = document.createElement("span");
		span.innerText = "Group admin";
		span.className = "isAdmin";
		member.appendChild(span);
	} else {
        let edit = document.createElement('i');
        edit.className = "fa-solid fa-chevron-up edit-icons";
        member.appendChild(edit);
    }

	document.getElementById("group-members1").appendChild(member);
}

closeGroupEditBtn.addEventListener("click", (e) => {
	document.querySelector(".groupEdit-container").style.display = " none";
	document.getElementById("message-right-container").style.width = "70vw";
	document.getElementById("message").style.width = "59vw";
	document.getElementById("group-members1").innerHTML = "";
	document.getElementById("groupImg-Name1").innerHTML = "";
});
