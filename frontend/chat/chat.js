// References to HTML elements
const input = document.getElementById('message');
const messageContainer = document.querySelector('.message-container');
const token = localStorage.getItem('token');
const groupContainer = document.querySelector('.groupList');
const onlineUser = document.querySelector('.online-users');
const groupheading = document.createElement('h4');

// Send message to the group
const sendMessage = async (event) => {
    event.preventDefault();
    const groupId = groupheading.id;
    const message = input.value.trim();
    if (!message || !groupId) return;

    try {
        const response = await axios.post('http://localhost:4000/message/groupmessage', { message, groupId }, {
            headers: { Authorization: token }
        });

        if (response.status === 201) {
            console.log('Message sent successfully:', response.data);
            input.value = '';
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        document.getElementById('error-container').innerHTML = `<div style="color:red;">${errorMessage}</div>`;
    }
};

// Fetch messages for the selected group
const fetchMessages = async () => {
    const groupId = groupheading.id;
    if (!groupId) {
        console.error('Group ID is not defined.');
        return;
    }

    try {
        if (!token) {
            alert('Please log in to continue.');
            document.location.href = '../login/login.html';
            return;
        }

        let lastMsgId = 0;
        const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        if (storedMessages.length > 0) {
            lastMsgId = storedMessages[storedMessages.length - 1].id;
        }

        const response = await axios.get(`http://localhost:4000/message/getmessage?lastMsgId=${lastMsgId}&groupId=${groupId}`, {
            headers: { Authorization: token }
        });

        if (response.status === 200) {
            const newMessages = response.data.messages;

            if (Array.isArray(newMessages) && newMessages.length > 0) {
                let allMessages = [...storedMessages, ...newMessages];
                if (allMessages.length > 10) {
                    allMessages = allMessages.slice(-10); // Keep only the latest 10 messages
                }
                localStorage.setItem('messages', JSON.stringify(allMessages));
                showMessages(allMessages);
            }
        } else {
            console.error(`Failed to fetch messages. Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching messages: ${error.message}`);
    }
};

// Fetch all groups the user belongs to
const getAllGroups = async () => {
    try {
        const response = await axios.get('http://localhost:4000/group/getAllGroup', {
            headers: { Authorization: token }
        });

        if (response.status === 200) {
            const groups = response.data.groups;

            if (Array.isArray(groups)) {
                groupContainer.innerHTML = ''; // Clear previous groups
                groups.forEach(groupObj => {
                    const groupListItem = document.createElement('li');
                    groupListItem.id = groupObj.id;
                    groupListItem.textContent = groupObj.groupName;
                    groupContainer.appendChild(groupListItem);
                });
            } else {
                console.error('Unexpected data format:', groups);
            }
        }
    } catch (error) {
        console.error(`Error getting groups: ${error.message}`);
    }
};

// Fetch users who are not in the selected group
const fetchUsersNotInGroup = async () => {
    try {
        const groupId = groupheading.id;
        if (!groupId) {
            console.error('Group ID is not defined.');
            return;
        }

        const response = await axios.get(`http://localhost:4000/user/getUsersNotInGroup?groupId=${groupId}`, {
           // const response = await axios.get(`http://localhost:4000/user/getUsersNotInGroup`, {
            headers: { Authorization: token }
        });

        if (response.status === 200) {
            const users = response.data.users;

            if (Array.isArray(users) && users.length > 0) {
                onlineUser.innerHTML = ''; // Clear previous user list
                users.forEach(user => {
                    const li = document.createElement('li');
                    li.textContent = user.name;
                    onlineUser.appendChild(li);

                    const button = document.createElement('button');
                    button.id = user.id;
                    button.textContent = 'Add';
                    onlineUser.appendChild(button);
                });
            } else {
                alert('No users available to add.');
            }
        }
    } catch (error) {
        console.error('Error fetching users:', error.message);
        alert('Failed to get users. Please try again.');
    }
};

// Event listeners
window.addEventListener('DOMContentLoaded', getAllGroups);


groupContainer.addEventListener('click', async (e) => {
    const groupId = e.target.id;
    groupheading.textContent = e.target.textContent;
    groupheading.id = groupId;
    messageContainer.innerHTML = ''; 
    messageContainer.appendChild(groupheading);
    await fetchUsersNotInGroup(); 
    setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
    // Fetch users who are not in the group
});

onlineUser.addEventListener('click', async (e) => {
    const userId = e.target.id;
    const groupId = groupheading.id;

    try {
        const response = await axios.post('http://localhost:4000/user/addtogroup', {
            userId,
            groupId
        }, {
            headers: { Authorization: token }
        });

        if (response.status === 200) {
            console.log('User added to group');
            await fetchUsersNotInGroup(); // Refresh the list after adding
        }
    } catch (error) {
        console.error(`Error adding user to group: ${error.message}`);
    }
});

const createGroup = async () => {
    try {
        const groupName = document.getElementById('groupName').value.trim();
        const response = await axios.post('http://localhost:4000/group/createGroup', { groupName }, {
            headers: { Authorization: token }
        });

        if (response.status === 201) {
            document.location.href = '../chat/chat.html';
        }
    } catch (error) {
        console.error('Error creating group:', error.message);
        alert('Failed to create group. Please try again.');
    }
};

const showMessages = (messages) => {
    messageContainer.innerHTML = ''; // Clear previous messages
    messages.forEach(data => {
        const listItem = document.createElement('li');
        listItem.textContent = `${data.User.name}: ${data.message}`;
        messageContainer.appendChild(listItem);
    });
};

// Handle logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token'); // Clear the token on logout
    document.location.href = '../login/login.html';
});
