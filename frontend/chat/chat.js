const input = document.getElementById('message');

async function takingMessage(event) {
    try {
        event.preventDefault();
        const message = input.value.trim(); // Get message from input and trim whitespace
        if (!message) return; // Do nothing if message is empty or only whitespace

        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:4000/message/usermessage', { message }, {
            headers: { Authorization: token }
        });

        if (response.status === 201) {
            console.log('Message sent successfully:', response.data);
            input.value = ''; // Clear the input field after sending
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        document.body.innerHTML += `<div style="color:red;">${errorMessage}</div>`;
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const container = document.querySelector('.message-container');

    const fetchMessages = async () => {
        try {
            let lastMsgId = 0;
            const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];

            if (storedMessages.length > 0) {
                lastMsgId = storedMessages[storedMessages.length - 1].id;
            }

            const response = await axios.get(`http://localhost:4000/message/getmessage?lastid=${lastMsgId}`, {
                headers: { Authorization: token }
            });

            if (response.status === 200) {
                const newMessages = response.data.messages;
                if (newMessages.length > 0) {
                    const allMessages = [...storedMessages, ...newMessages]; // Combine stored and new messages
                    localStorage.setItem('messages', JSON.stringify(allMessages));
                    updateMessages(allMessages);
                 }
            } else {
                console.error(`Failed to fetch messages. Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching messages: ${error}`);
        }
    };

    // Set interval to fetch messages every 5 seconds
    setInterval(fetchMessages, 5000);

    const updateMessages = (messages) => {
        container.innerHTML = ''; // Clear previous messages
        messages.forEach(message => {
            const listItem = document.createElement('li');
            listItem.textContent = `${message.id}:${message.message}`;
            container.appendChild(listItem);
        });
    };

    // Load initial messages from localStorage
     const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
     updateMessages(storedMessages);
});
