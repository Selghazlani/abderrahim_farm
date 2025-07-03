// panier local
let panier = JSON.parse(localStorage.getItem("panier")) || [];

// pour chaque bouton "أضف إلى السلة"
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const id = card.dataset.id;
    const nom = card.querySelector("h2").innerText;
    const prix = parseFloat(card.querySelector("p").innerText.replace(/[^\d.]/g, ''));
    const qty = parseInt(card.querySelector(".qty").value);

    const produitExistant = panier.find((item) => item.id === id);
    if (produitExistant) {
      produitExistant.qty += qty;
    } else {
      panier.push({ id, nom, prix, qty });
    }

    localStorage.setItem("panier", JSON.stringify(panier));
    alert("تمت إضافة المنتج إلى السلة ✅");
  });
});
