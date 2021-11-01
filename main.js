import { productData } from "./products.js";
const productsBlock = document.querySelector(".products");
const cartBody = document.querySelector(".modal");
const counterProduct = document.querySelector(".counter-product");
const totalPrice = document.querySelector(".total-price");
const clearcartBtn = document.getElementById("clear-cart");
const cartContent = document.querySelector(".products-cart");

let buttonsDOM = []; // اینجا ما دکمه های داخل هر محصول در صفحه لصلی رو میریزیم  داخل این ارایه تا بعد باش کار داریم.
let cartProducts = []; //سبد خرید یعنی هر محصول با جزییاتش بره داخل ای ارایه ==>view in modal
// { id: 1,   title: "queen panel bed",  price: 10.99,   image: "./img/01.jpg", },==>یک محصول
// const product = [{},{},{},......] ==> کل محصولات ما که داخل ثابت پروداکت است.
// پس سبد خرید یه جز کوچک از تمام محصولات ماست.
///////////// note:::تمام اتفاقات(متدها) باید بر اساس ساخته شدن ابجکت از این کلاس ها باید بیوفته
///////////////
///////////////
//محصولات ما رو قراره بگیره

class Products {
  getProductData() {
    return productData;
  }
}

//محصولات را داخل دام به ما نشون بده
class View {
  disPlayProducts(data) {
    console.log(data);
    productsBlock.innerHTML = "";
    data.forEach((item) => {
      productsBlock.innerHTML += `
        <section class="product">
        <div class="div-pro">
          <img class="image" src=${item.image} />
        </div>
        <div>
          <p class="product-name">${item.title}</p>
          <p class="product-price">${item.price} $</p>
        </div>
        <div>
          <button data-id=${item.id} class="add-to-cart">Add To cart</button>
        </div>
      </section>
        `;
    });
  }
  addToCart() {
    //اضافه کردن به کارتی که اون بالا تعریف کردیم و برابر ارایه خالی قرار دادیم
    const btns = document.querySelectorAll(".add-to-cart");
    const allBtnsAddToCart = [...btns];
    buttonsDOM = allBtnsAddToCart;
    allBtnsAddToCart.forEach((item) => {
      item.addEventListener("click", (e) => {
        item.innerText = "In Cart";
        item.disabled = true;

        // console.log(e.target.dataset.id);
        const cartItem = {
          ...Storage.getDataToCart(e.target.dataset.id),
          quantity: 1,
        };
        cartProducts = [...cartProducts, cartItem];
        Storage.setMyProduct(cartProducts);
        this.addToCartBody(cartItem);
        this.setCartValue(cartProducts);
      });
    });
  }
  addToCartBody(cartItem) {
    console.log(cartItem);
    const productInCart = document.createElement("div");
    productInCart.classList.add("product-row");
    productInCart.innerHTML = `
    
<div class="pic-div">
    <img class="pic-img" src=${cartItem.image} />
</div>
<div class="disc-product">
    <p class="modal-product-name">${cartItem.title}</p>
    <p class="modal-product-price">${cartItem.price} $</p>
</div>
<div class="counter-product">
    <i data-id=${cartItem.id} class="fas fa-chevron-up"></i>
    <span>${cartItem.quantity}</span>
    <i data-id=${cartItem.id} class="fas fa-chevron-down"></i>
</div>

    <i  data-id=${cartItem.id} class="fa fa-trash trash" aria-hidden="true"></i>
    

`;
    cartContent.appendChild(productInCart);
    console.log(productInCart);
  }
  setCartValue(cartProducts) {
    let count = 0;
    console.log("salam", cartProducts);
    const total = cartProducts.reduce((acc, cur) => {
      count += cur.quantity;
      return acc + cur.price * cur.quantity;
    }, 0);
    totalPrice.innerText = `total price:${total.toFixed(2)} $`;
    console.log(total);
    counterProduct.innerText = count;
  }
  setUpApp() {
    cartProducts = Storage.getProductsInCart();

    cartProducts.forEach((item) => {
      this.addToCartBody(item);
    });
    this.setCartValue(cartProducts);
  }
  cartLogic() {
    clearcartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    cartContent.addEventListener("click", (e) => {
      if (e.target.classList.contains("trash")) {
        const id = e.target.dataset.id;
        console.log(id);
        cartContent.removeChild(e.target.parentElement);
        this.removeItem(id);
      } else if (e.target.classList.contains("fa-chevron-up")) {
        const findedCevronUp = cartProducts.find((item) => {
          return item.id == e.target.dataset.id;
        });
        findedCevronUp.quantity++;
        this.setCartValue(cartProducts);
        Storage.setMyProduct(cartProducts);
        e.target.nextElementSibling.innerText = findedCevronUp.quantity;
      } else if (e.target.classList.contains("fa-chevron-down")) {
        const findedCevronDown = cartProducts.find((item) => {
          return item.id == e.target.dataset.id;
        });
        if (findedCevronDown.quantity === 1) {
          this.removeItem(e.target.dataset.id);
          cartContent.removeChild(e.target.parentElement.parentElement);
          return;
        }
        findedCevronDown.quantity--;
        this.setCartValue(cartProducts);
        Storage.setMyProduct(cartProducts);
        e.target.previousElementSibling.innerText = findedCevronDown.quantity;
      }
    });
  }
  clearCart() {
    // loop on all the item and tigger remove for each one
    cartProducts.forEach((item) => this.removeItem(item.id));
    // console.log(cartContent.children[0]);
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    // closeModalFunction();
  }
  removeItem(id) {
    // resuable method for signle remove and clear all
    cartProducts = cartProducts.filter((cartItem) => cartItem.id != id);
    this.setCartValue(cartProducts);
    Storage.setMyProduct(cartProducts);
    const button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `add to cart`;
  }
  getSingleButton(id) {
    // should be parseInt to get correct result
    return buttonsDOM.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
  }
}

// ذخیره کردن و گرفتن اطلاعات از لوکال استوریج(مدیریت ذخیره اطلاعات)
class Storage {
  static saveData(data) {
    localStorage.setItem("myData", JSON.stringify(data));
  }
  static getDataToCart(id) {
    const product = JSON.parse(localStorage.getItem("myData"));
    console.log(product);
    return product.find((item) => {
      return item.id == id;
    });
  }
  static setMyProduct(cartProducts) {
    localStorage.setItem("myProduct", JSON.stringify(cartProducts));
  }
  static getProductsInCart() {
    return localStorage.getItem("myProduct")
      ? JSON.parse(localStorage.getItem("myProduct"))
      : [];
  }
}

//////نوشتن یک ایونت لیسینر دام کانتنت لود برای اینکه وقتی صفحه لود شد ابجکت های کلاس های بالا را برای ما بسازد.
///////میتونیم هم کف اسکریپت بنویسیم ولی اینجوری مرتب تر و مدیریتش بهتره
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const data = products.getProductData();
  //////
  const view = new View();
  view.disPlayProducts(data);
  view.addToCart();
  view.setUpApp();
  view.cartLogic();
  //////
  Storage.saveData(data);
});

document.querySelector("#cart-btn").addEventListener("click", () => {
  cartBody.style.display = "block";
});
document.querySelector(".modal__close-btn").addEventListener("click", () => {
  cartBody.style.display = "none";
});
