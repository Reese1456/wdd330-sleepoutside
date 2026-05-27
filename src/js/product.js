import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

loadHeaderFooter();

const params = new URLSearchParams(window.location.search);
const productId = params.get("product");
const category = params.get("category") || "tents";

const dataSource = new ProductData();

function addProductToCart(product) {
  const stored = getLocalStorage("so-cart");
  const cart = Array.isArray(stored) ? stored : [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

function renderProductDetails(product) {
  document.querySelector(".product__brand").textContent = product.Brand.Name;
  document.querySelector(".product__name").textContent = product.NameWithoutBrand;
  const img = document.querySelector(".product__image");
  img.src = product.Images.PrimaryLarge;
  img.alt = product.Name;
  document.querySelector(".product-card__price").textContent = `$${product.FinalPrice}`;
  document.querySelector(".product__color").textContent = product.Colors[0].ColorName;
  document.querySelector(".product__description").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = product.Id;
  document.title = `Sleep Outside | ${product.Name}`;
}

async function init() {
  const product = await dataSource.findProductById(productId);
  renderProductDetails(product);
  document.getElementById("addToCart").addEventListener("click", addToCartHandler);
}

init();
