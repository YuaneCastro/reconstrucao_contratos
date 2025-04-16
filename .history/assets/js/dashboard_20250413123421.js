<script>
  function toggleAccordion(button) {
    const content = button.nextElementSibling;
    const isOpen = content.classList.contains("open");

    // Fecha todos os outros
    document.querySelectorAll(".accordion-content").forEach(el => {
      el.style.maxHeight = null;
      el.classList.remove("open");
      el.previousElementSibling.classList.remove("active");
    });

    if (!isOpen) {
      content.style.maxHeight = content.scrollHeight + "px";
      content.classList.add("open");
      button.classList.add("active");
    }
  }

  // Ajusta maxHeight ao redimensionar
  window.addEventListener("resize", () => {
    document.querySelectorAll(".accordion-content.open").forEach(el => {
      el.style.maxHeight = el.scrollHeight + "px";
    });
  });
</script>


