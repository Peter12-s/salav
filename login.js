document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.getElementById("preloader").style.opacity = "0";
        setTimeout(function () {
            document.getElementById("preloader").style.display = "none";
            document.querySelector(".login-container").style.display = "block";
        }, 500);
    }, 1000);

    const form = document.querySelector("form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = form.querySelector("input[type='text']").value.trim();
        const password = form.querySelector("input[type='password']").value.trim();

        if (!username || !password) {
            alert("Por favor, completa todos los campos");
            return;
        }

        axios.post("https://nest-api-855316206046.us-central1.run.app/api/auth/login", {
            username: username,
            password: password
        })
        .then(response => {
            console.log("Respuesta del servidor:", response.data);
            localStorage.setItem("loginResponse", JSON.stringify(response.data));
            alert("Inicio de sesión exitoso");
            // window.location.href = "dashboard.html";
        })
        .catch(error => {
            console.error("Error en la petición:", error);
            alert("Error al iniciar sesión");
        });
    });
});