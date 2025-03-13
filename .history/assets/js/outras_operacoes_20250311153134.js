const a = window.document.getElementById('apagar');
a.addEventListener('click', apagar);
const response = await fetch("/outars_", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
});