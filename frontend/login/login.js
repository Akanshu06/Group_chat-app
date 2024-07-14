async function login(event) {
    try {
        event.preventDefault();
        const loginDetails = {
            email: event.target.username.value,
            password: event.target.password.value
        }

        const response = await axios.post('http://localhost:4000/user/login', loginDetails)
        alert(response.data.message);
        const token = response.data.token;
        localStorage.setItem('token', token);
        window.location.href = `../chat/chat.html`;
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        document.body.innerHTML += `<div style="color:red;">${errorMessage}</div>`;
    }

}