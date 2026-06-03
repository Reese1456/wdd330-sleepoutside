import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", {
  subtotal: "#summary-subtotal",
  tax: "#summary-tax",
  shipping: "#summary-shipping",
  total: "#summary-total",
});

checkout.calculateItemSubtotal();

document.getElementById("zip").addEventListener("blur", () => {
  if (document.getElementById("zip").value) {
    checkout.calculateOrderTotal();
  }
});

document.getElementById("checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  checkout.checkout(e.target);
});
