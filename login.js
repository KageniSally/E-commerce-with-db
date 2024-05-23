const baseURLUsers = "http://localhost:3000/users/"
const btnLogin = document.getElementById("loginButton")
btnLogin.addEventListener('click', handleLogin)

async function handleLogin(event) {
    event.preventDefault()

    const username = document.getElementById('usernameLogin').value
    const password = document.getElementById('passwordLogin').value

    if (!username || !password) {
        alert("All fields should be filled")
        return
    }
    const response = await fetch(baseURLUsers)
    const users = await response.json()

    const user = users.find(user => user.username === username)

    if (!user) {
        alert("User not found")
        return
    }


    //session to store username so that it can be displayed in home page
    sessionStorage.setItem("username", username);

    if (user.password === password) {
        alert("Login successful")
        window.location.href = "index.html"
    } else {
        alert("Incorrect password")
    }
}


