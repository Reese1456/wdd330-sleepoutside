import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const percentOff = Math.round((1 - product.FinalPrice / product.SuggestedRetailPrice) * 100);
  const discountBadge = isDiscounted
    ? `<p class="product-card__discount">
        <span class="product-card__original-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>
        Save ${percentOff}%
      </p>`
    : "";
  return `<li class="product-card">
  <a href="/product_pages/index.html?product=${product.Id}&category=tents">
    <img src="${product.Image}" alt="${product.Name}" />
    ${discountBadge}
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.NameWithoutBrand}</h2>
    <p class="product-card__price">$${product.FinalPrice}</p>
  </a>
</li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}
