async function takingMessage(event){
    try {
        event.preventDefault();
        const message=document.getElementById('message');
        const response=axios.post('http://localhost/message/usermessage',message)
        if(response.status===200){
            console.log(response.data);
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        document.body.innerHTML += `<div style="color:red;">${errorMessage}</div>`;
    } 
}