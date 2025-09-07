class Salav extends HTMLElement {
  constructor() {
    
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = ` 

    <style>
  /* ======== RESET Y BASE ======== */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ======== HEADER ======== */
header {
  background: #D9358C;
  color: #fff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  transition: opacity 0.3s;
}

nav a:hover {
  opacity: 0.8;
}

/* ======== BOTÓN HAMBURGUESA ======== */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 5px;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 3px;
  transition: 0.3s;
}

/* ======== MENU Y SUBMENU ======== */
#menu {
  align-items: end;
  gap: 15px;
  margin-top: 25px;
}

.menu-item {
  position: relative;
}

#menu a {
  text-decoration: none;
  padding: 8px 12px;
  text-align: center;
}

.submenu a :hover {
  cursor: pointer;
}




.submenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #923b8b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1000;
  flex-direction: column;
}

.submenu a {
  padding: 10px;
  display: block;
  white-space: nowrap;
}

/* 💻 Computadora */
@media (min-width: 1025px) {
  .page-jump {
    display: inline;
  }
  #menu a:hover {
    border-radius: 50px;
    background-color: #923b8b;
  }
  .submenu a:hover {
    background: #f2f2f2;
  }
}

/* Submenú activo en móvil */
.menu-item.active .submenu {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease forwards;
}

/* Mostrar submenú en escritorio */
@media (min-width: 769px) {
  .menu-item:hover .submenu {
    display: flex;
  }
}

/* ======== NAV MÓVIL ======== */
@media (max-width: 768px) {
  nav {
    display: none;
    flex-direction: column;
    background: #923b8b;
    position: absolute;
    top: 53px;
    right: 0%;
    width: 200px;
    height: 100vh;
    padding: 10px;
  }
  nav.show {
    display: flex;
  }
  .hamburger {
    display: flex;
  }
}

/* ======== OLAS ======== */
.olas,
.olas-2 {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 0;
}

.olas-2 {
  bottom: -10px;
}

/* ======== MAIN ======== */
main {
  background-size: cover;
  background-position: center;
  flex: 1;
  padding: 20px;
  z-index: 1;
  position: relative;
}


main h1 {
  color: #4b2363;
  text-align: center;
}

main p {
  color: #4b2363;
  text-align: center;
  font-size: 1.2rem;
}

/* ======== ANIMACIONES ======== */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px);}
  to { opacity: 1; transform: translateY(0);}
}

.footer {
    font-size: .8rem;
    width: 100%;
    bottom: 0px;
    position: fixed;
    z-index: 999;
    text-align: end;
    color: rgb(212, 157, 239);
}


  
  header {
  background: #D9358C;
  color: #fff;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
}
.slot-header {
      display: block;
    justify-content: space-between;
        width: 100%;
    }


.footer p {
    margin: 5px 10px;
}
    /* ======== NAV MÓVIL ======== */
@media (max-width: 768px) {
    .footer {
        display: none;
    }
  </style>
    <body>
    <header>
    <slot class="slot-header" name="header"></slot>
    </header>

      <main>
        <slot name="main"></slot>
      </main>

    <div class="footer">
        <p>© 2024 SALAV soluciones empresariales. Derechos reservados.</p>
    </div>

    <div class="olas">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 260">
            <defs>
                <linearGradient id="olaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#9F38B8" />
                    <stop offset="100%" stop-color="#D9358C" />
                </linearGradient>
            </defs>
            <path fill="url(#olaGradient)" fill-opacity=".5"
                d="M0,96L60,90.7C120,85,240,75,360,90.7C480,107,600,149,720,181.3C840,213,960,235,1080,202.7C1200,171,1320,85,1380,42.7L1440,0L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
            </path>
        </svg>
    </div>

    <div class="olas-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 260">
            <path fill="url(#olaGradient)" fill-opacity="1"
                d="M0,96L60,90.7C120,85,240,75,360,90.7C480,107,600,149,720,181.3C840,213,960,235,1080,202.7C1200,171,1320,85,1380,42.7L1440,0L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
            </path>
        </svg>
    </div>
</body> `;
  }

}
customElements.define('plantilla-salav', Salav);