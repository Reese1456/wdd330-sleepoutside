import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

const listElement = document.querySelector(".product-list");
const footerElement = document.querySelector(".cart-footer");
const cart = new ShoppingCart(listElement, footerElement);
cart.init();
