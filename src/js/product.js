import { getLocalStorage, setLocalStorage, loadHeaderFooter, showToast } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

loadHeaderFooter();

const params = new URLSearchParams(window.location.search);
const productId = params.get("product");
const category = params.get("category") || "tents";

const dataSource = new ExternalServices();

function addProductToCart(product) {
  const stored = getLocalStorage("so-cart");
  const cart = Array.isArray(stored) ? stored : [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
  showToast(`${product.NameWithoutBrand} added to cart!`);
}

function buildCarousel(images, altText) {
  const extraImages = images.ExtraImages;
  const container = document.querySelector(".product__image-container");

  if (!extraImages || extraImages.length === 0) {
    container.innerHTML = `<img class="product__image" src="${images.PrimaryLarge}" alt="${altText}" />`;
    return;
  }

  const thumbs = [
    `<img class="product__carousel-thumb active" src="${images.PrimaryMedium}" data-large="${images.PrimaryLarge}" alt="${altText}" />`,
    ...extraImages.map(
      (img) =>
        `<img class="product__carousel-thumb" src="${img.Src}" data-large="${img.Src}" alt="${img.Title}" />`
    ),
  ].join("");

  container.innerHTML = `
    <div class="product__carousel">
      <img class="product__carousel-main" src="${images.PrimaryLarge}" alt="${altText}" />
      <div class="product__carousel-thumbs">${thumbs}</div>
    </div>`;

  container.querySelector(".product__carousel-thumbs").addEventListener("click", (e) => {
    const thumb = e.target.closest(".product__carousel-thumb");
    if (!thumb) return;
    container.querySelector(".product__carousel-main").src = thumb.dataset.large;
    container.querySelectorAll(".product__carousel-thumb").forEach((t) => t.classList.remove("active"));
    thumb.classList.add("active");
  });
}

function renderProductDetails(product) {
  document.querySelector(".product__brand").textContent = product.Brand.Name;
  document.querySelector(".product__name").textContent = product.NameWithoutBrand;
  buildCarousel(product.Images, product.Name);
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
