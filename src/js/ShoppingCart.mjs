import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img src="${item.Images?.PrimaryMedium || item.Image}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__remove" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart">&times;</button>
</li>`;
}

export default class ShoppingCart {
  constructor(listElement, footerElement) {
    this.listElement = listElement;
    this.footerElement = footerElement;
  }

  renderCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, "afterbegin", true);
    this.addRemoveListeners();
    this.updateCartFooter(cartItems);
  }

  updateCartFooter(cartItems) {
    if (!this.footerElement) return;

    if (cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
      this.footerElement.querySelector(".cart-total").textContent = `Total: $${total.toFixed(2)}`;
      this.footerElement.classList.remove("hide");
    } else {
      this.footerElement.classList.add("hide");
    }
  }

  addRemoveListeners() {
    this.listElement.querySelectorAll(".cart-card__remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this.removeFromCart(id);
      });
    });
  }

  removeFromCart(id) {
    const cartItems = getLocalStorage("so-cart") || [];
    const updated = cartItems.filter((item) => item.Id !== id);
    setLocalStorage("so-cart", updated);
    this.renderCart();
  }

  init() {
    this.renderCart();
  }
}
