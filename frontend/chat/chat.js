async function takingMessage(event){
    try {
        event.preventDefault();
        const message=event.target.message.value;
        const response=await axios.post('http://localhost:4000/message/usermessage',{message})
        if(response.status===201){
            console.log(response.data);
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        document.body.innerHTML += `<div style="color:red;">${errorMessage}</div>`;
    } 
}