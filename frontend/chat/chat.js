const input=document.getElementById('message');
async function takingMessage(event){
    try {
        event.preventDefault();
        const message=event.target.message.value;
        const token =localStorage.getItem('token');
    
        const response=await axios.post('http://localhost:4000/message/usermessage',{message},{headers:{Authorization:token}});
        if(response.status===201){
           // console.log(response.data);
            input.value='';
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        document.body.innerHTML += `<div style="color:red;">${errorMessage}</div>`;
    } 
}

window.addEventListener('DOMContentLoaded', ()=>{
    const token=localStorage.getItem('token');
    const container = document.querySelector('.message-container');
    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:4000/message/getmessage', {
                headers: { Authorization: token }
            });

            if (response.status === 200) {
                showingMessage(response.data.messages);
            } else {
                console.error(`Failed to fetch messages. Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching messages: ${error}`);
        }
    };

    container.innerHTML = ''; // Clear previous messages

    const updateMessages = (messages) => {
        
        container.innerHTML = ''; // Clear previous messages
        
        messages.forEach(message => {
            const listItem = document.createElement('li');
            listItem.textContent = message;
            container.appendChild(listItem);
        });
    };

    fetchMessages();
    setInterval(fetchMessages,1000)
});
