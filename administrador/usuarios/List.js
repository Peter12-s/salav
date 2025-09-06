const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmYWFiZTY0MS01YjQxLTQxNDgtODg3Ny04YjhlZDU5MjUzYTgiLCJ1c2VyX3R5cGUiOiJBRE1JTklTVFJBRE9SIiwiaWF0IjoxNzU3MTg1ODAxLCJleHAiOjE3NTcxODY3MDF9.yPjaQKjfhKLJJ9vNM1XjASNYP5cFlVgd06I-IxLqKLc";


let users = [];

axios.get(`${API_URL}users`, {
    headers: { Authorization: `Bearer ${token}` }
})
.then(response => {
    users = response.data;
    console.log("Usuarios obtenidos:", users);
})
.catch(error => {
    console.error("Error:", error.response ? error.response.data : error.message);
    alert("Error al iniciar sesión");
});