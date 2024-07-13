async function login(event){
    try {
        event.preventDefault();
    const loginDetails={
        email:event.target.email.value,
        password:event.target.password.value
    }
    const response =await axios.post('http://localhost:4000/user/login',loginDetails)
    if(response.status==200){
        window.location.href='../chat/chat.html';
    }else{
        throw new Error('login failed')
    }
        
    } catch (error) {
        console.error('Error at login:', error.message);
        alert('Login failed. Please try again.')
    }
    
}