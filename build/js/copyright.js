function copyright() {
  const el = document.getElementById("copyright");
  if (!el) return;

  el.innerHTML = `Copyright © ${new Date().getFullYear()} Locamex - Todos os Direitos Reservados`
}

addEventListener("load", copyright);