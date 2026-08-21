const filters = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll("[data-category]")];
const emptyMessage = document.querySelector(".no-results");

function applyFilter(category) {
  let visibleCount = 0;

  filters.forEach((button) => {
    const active = button.dataset.filter === category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  cards.forEach((card) => {
    const visible = category === "all" || card.dataset.category === category;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  emptyMessage.hidden = visibleCount > 0;
}

filters.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});
