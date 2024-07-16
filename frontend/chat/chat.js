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
            window.location.reload();
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        document.body.innerHTML += `<div style="color:red;">${errorMessage}</div>`;
    } 
}

window.addEventListener('DOMContentLoaded',async ()=>{
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:4000/message/getmessage',{headers:{Authorization:token}});
    try {
       if(response.status === 200){
        //console.log(response.data.messages);
        showingMessage(response.data.messages);
       } 
    } catch (error) {
        console.error(`Error fatching message ${error}`);
    }
});



function showingMessage(messages) {
    const container = document.querySelector('.message-container');
    container.innerHTML = ''; // Clear previous content

    messages.forEach(message => {
        const listItem = document.createElement('li');
        listItem.textContent = `${message.message}`;
        container.appendChild(listItem);
    });
}