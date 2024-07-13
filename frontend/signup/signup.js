function signup(e){
    try {
        e.preventDefault();
        const signupDetails={
            name:e.target.username.value,
            email:e.target.email.value,
            phone:e.target.phone.value,
            password:e.target.password.value,
        }
        console.log(signupDetails);
        axios.post('http://localhost:4000/user/signup',signupDetails)
        .then((response)=>{
            if(response.status===201){
                window.location.href='../login/login.html'
            }

            else if(response.status===200){
                alert('Email already exists. Please Login.'); 
                window.location.href='../login/login.html'           
            }
        
        }).catch((error)=>{
            throw new Error('somthing went wrong');
        });
        
    } catch (error) {
        document.body.innerHTML=`<div style=color:red>${error}</dev>`
    }
   
}