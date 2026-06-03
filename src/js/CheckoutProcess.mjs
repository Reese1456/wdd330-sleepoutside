import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelectors) {
    this.key = key;
    this.outputSelectors = outputSelectors;
    this.itemTotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
    this.cartItems = [];
    this.services = new ExternalServices();
  }

  calculateItemSubtotal() {
    this.cartItems = getLocalStorage(this.key) || [];
    this.itemTotal = this.cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    document.querySelector(this.outputSelectors.subtotal).textContent =
      `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.cartItems.length > 0
      ? 10 + (this.cartItems.length - 1) * 2
      : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    document.querySelector(this.outputSelectors.tax).textContent =
      `$${this.tax.toFixed(2)}`;
    document.querySelector(this.outputSelectors.shipping).textContent =
      `$${this.shipping.toFixed(2)}`;
    document.querySelector(this.outputSelectors.total).textContent =
      `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const formData = new FormData(form);
    const order = Object.fromEntries(formData);
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.items = packageItems(this.cartItems);

    try {
      await this.services.checkout(order);
      localStorage.removeItem(this.key);
      window.location.href = '/checkout/success.html';
    } catch (err) {
      alertMessage(err.message);
    }
  }
}
