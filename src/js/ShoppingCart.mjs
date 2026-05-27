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
  constructor(listElement) {
    this.listElement = listElement;
  }

  renderCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, "afterbegin", true);
    this.addRemoveListeners();
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
