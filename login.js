//animacion del preloader 
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.getElementById("preloader").style.opacity = "0";
        setTimeout(function () {
            document.getElementById("preloader").style.display = "none";
            document.querySelector(".login-container").style.display = "block";
        }, 500);
    }, 800);
});


const mensajeWhatsApp = encodeURIComponent("Hola, quisiera más información");

// Evento para llamar
document.getElementById("btnLlamar").addEventListener("click", () => {
    window.location.href = `tel:${numeroLlamada}`;
});

// Evento para WhatsApp
document.getElementById("btnWhatsApp").addEventListener("click", () => {
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`, "_blank");
});



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
            console.log(response);
        
            // Guardar el id del usuario en localStorage
            localStorage.setItem("user_id", response.data.user_id);
            // Guardar el access_token en localStorage
            localStorage.setItem("access_token", response.data.access_token);
            // localStorage.setItem("access_token", response.data.);
            localStorage.setItem("user_type", response.data.user_type);
            if (response.data.user_type === "EMPRESA") {
                localStorage.setItem("company_name", response.data.company_name);
            } else {

                localStorage.setItem("user_name", response.data.full_name.name);
            }
            // Crear overlay de transición
            const transitionDiv = document.createElement("div");
            transitionDiv.style.position = "fixed";
            transitionDiv.style.top = "0";
            transitionDiv.style.left = "0";
            transitionDiv.style.width = "100vw";
            transitionDiv.style.height = "100vh";
            transitionDiv.style.background = "#fff";
            transitionDiv.style.opacity = "0";
            transitionDiv.style.transition = "opacity 0.6s";
            transitionDiv.style.zIndex = "99999";
            document.body.appendChild(transitionDiv);

            // Iniciar transición
            setTimeout(() => {
                transitionDiv.style.opacity = "1";
            }, 50);

            // Redirigir después de la transición
            setTimeout(() => {
                const userType = response.data.user_type;
                if (userType === "ADMINISTRADOR") {
                    window.location.href = "administrador/inicioAdmin.html";
                } else if (userType === "FREELANCE") {
                    window.location.href = "freelancers/inicioFreelancer.html";
                } else if (userType === "EMPRESA") {
                    window.location.href = "empresas/inicioEmpresa.html";
                } else {
                    alert("Tipo de usuario no reconocido");
                }
            }, 650);
        })
        .catch(error => {
            alert("Error al iniciar sesión");
        });
});
