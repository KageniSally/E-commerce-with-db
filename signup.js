const baseURLUsers = "http://localhost:3000/users/"

const btnReg = document.getElementById('btn-reg')

btnReg.addEventListener('click', handleRegister)

async function handleRegister(p) {
    p.preventDefault()

    const username = document.getElementById('usn').value
    const email = document.getElementById('eml').value
    const password = document.getElementById('pwd').value
    const confirmPassword = document.getElementById('cpwd').value
    let validation = validate(username, email, password, confirmPassword)

    console.log(validation)

    if (validation) {

        const user = {
            username: username,
            email: email,
            role: "customer",
            password: password,
            
        }

        const usersResponse = await fetch(baseURLUsers);
        const users = await usersResponse.json();

        if (users.some(user => user.username === username)) {
            alert('Username already exists');
            return;
        }

        sessionStorage.setItem("username", username);
        const postResponse = await fetch(baseURLUsers, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })



        if (postResponse.ok) {
            // alert("Registration successful")
            location.assign("http://127.0.0.1:5500/login.html")
            // window.location.href = "login.html"
            console.log("here")
        } else {
            alert("failed to sign up")
        }

    } else {
        alert("failed to sign up")
    }

}
function validate(username, email, password, confirmPassword) {

    if (password !== confirmPassword) {
        alert("Password do not match")

        return false
    }
    if (password.length < 8) {
        alert("Password should be more than 8 characters")
        return false


    }
    if (!username.length || !email.length || !password.length || !confirmPassword.length) {
        alert("field cannot be empty")
        return false


    }
    if (username.length < 8) {
        alert("username should be at least 8 characters")
        return false
    }
    return true
}
