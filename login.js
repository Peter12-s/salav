//animacion del preloader 
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.getElementById("preloader").style.opacity = "0";
        setTimeout(function () {
            document.getElementById("preloader").style.display = "none";
            document.querySelector(".login-container").style.display = "block";
        }, 500);
    }, 1000);
});

let User="";
//peticion al servidor login guardar en localstorage el token
const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = form.querySelector("input[type='text']").value.trim();
    const password = form.querySelector("input[type='password']").value.trim();

    if (!username || !password) {
        alert("Por favor, completa todos los campos");
        return;
    }

    axios.post(`${API_URL}auth/login`, { username, password })
        .then(response => {
            // console.log("Respuesta del servidor:", response.data);
            localStorage.setItem("loginResponse", JSON.stringify(response.data));
            User = response.data.full_name.name;
            alert("Inicio de sesión exitoso", User);
        })
        .catch(error => {
            // console.error("Error en la petición:", error);
            alert("Error al iniciar sesión", error);
            console.log(error);
            
        });
});
