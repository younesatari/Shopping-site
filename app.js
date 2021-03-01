/* Getting Elements and Asign Them To Variables */
const openCartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.fa-times');
const cartContainer = document.querySelector('.cart-container');
const cart = document.querySelector('.cart');
const cartProducts = document.querySelector('.cart-products');
const totalPrice = document.querySelector('.total-amount');
const countNum = document.querySelector('#count');
const clearCartBtn = document.querySelector('.clear-cart-btn');
const products = document.querySelector('.products');
const storeBtns = document.querySelector('.store-btns');
const watches = document.querySelectorAll('.watch');
const searchFilter = document.querySelector('#searchFilter');

/* Total */
let total = 0;
/* Count */
let count = 0;

/* Show Cart */
function showCart(){
   cart.classList.toggle('show-cart');
   cartContainer.classList.toggle('show-visibility');
}

/* Close Cart */
function closeCart(){
   cart.classList.remove('show-cart');
   cartContainer.classList.remove('show-visibility');
}

/* Add Product to Cart */
function addProductToCart(e){
   if(e.target.classList.contains('fa-cart-arrow-down')){
      /* Product Items */
      let items = {};

      /* Getting Product Source Image */
      let fullSource = e.target.parentElement.previousElementSibling.children[0].src;
      let indexNum = fullSource.indexOf('images');
      let productImage = fullSource.slice(indexNum);
      
      /* Getting Product Name */
      let productName = e.target.parentElement.parentElement.nextElementSibling.children[0].innerHTML;

      /* Getting Product Price */
      let productPrice = +e.target.parentElement.parentElement.nextElementSibling.childNodes[3].childNodes[1].innerHTML;

      /* Getting Product Id */
      let productId = e.target.parentElement.dataset.id;

      /* Pushing Product Infos to The Items Object */
      items.image = productImage;
      items.name = productName;
      items.price = productPrice;
      items.id = productId;

      /* Adding the Product Infos to the Cart */
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
      <div class="cart-img">
         <img src=${items.image}>
      </div>
      <div class="cart-title-price">
         <div class="cart-name">${items.name}</div>
         <div class="cart-price">$<span class="cart-price-amount">${items.price}</span></div>
      </div>
      <i data-id="${items.id}" class="fas fa-trash-alt"></i>
      `
      cartProducts.appendChild(div);

      /* Update Count */
      count++;
      countNum.innerHTML = count;

      /* Update Total */
      total += items.price;
      totalPrice.innerHTML = total;

      /* Show Cart */
      showCart();

      /* Add To Local Storage */
      addToLocalStorage(items);
   }
}

/* Clear Cart */
function clearCart(){
   /* Update Total */
   total = 0;
   totalPrice.innerHTML = total;
   cartProducts.innerHTML = ``;

   /* Update Count */
   count = 0;
   countNum.innerHTML = count;

   /* Close Cart */
   closeCart();
} 

/* Delete Cart Product */
function deleteCartProduct(e){
   if(e.target.classList.contains('fa-trash-alt')){
      
      let cartProductPrice = +e.target.parentElement.children[1].children[1].children[0].innerHTML;

      /* Update Price */
      total -= cartProductPrice;
      totalPrice.innerHTML = total;

      /* Remove Cart Product */
      e.target.parentElement.remove();

      /* Update Count */
      count--;
      countNum.innerHTML = count;

      /* Clear Single */
      clearSingle(e.target);
   }
}

/* Filter Button */
function filterBtn(e){
   if(e.target.classList.contains('btn')){
      let buttonCategory = e.target.dataset.filter.toUpperCase().trim();

      watches.forEach(watch=>{
         let watchCategory = watch.classList[1].toUpperCase().trim();

         if(buttonCategory === 'ALL'){
            watch.style.display = 'block';
         } else {
            if(buttonCategory === watchCategory){
               watch.style.display = 'block';
            } else {
               watch.style.display = 'none';
            }
         }
      })
   }
}

/* Filter Input */
function filterInput(e){
   let inputValue = e.target.value.toUpperCase().trim();
   watches.forEach(watch=>{
      let watchCategory = watch.classList[1].toUpperCase().trim();

      if(watchCategory.includes(inputValue)){
         watch.style.display = 'block';
      } else {
         watch.style.display = 'none';
      }
   })
}

/* Add To Local Storage */
function addToLocalStorage(items){
   let itemsArr;
   if(localStorage.getItem('products')){
      itemsArr = JSON.parse(localStorage.getItem('products'));
   } else {
      itemsArr = [];
   }
   itemsArr.push(items);
   localStorage.setItem('products', JSON.stringify(itemsArr));
}

/* Clear Single from Local Storage */
function clearSingle(target){
   let id = target.dataset.id;
   let myitems = JSON.parse(localStorage.getItem('products'));

   let newItems = myitems.filter(item=>{
      if(item.id !== id){
         return item;
      }
   })

   localStorage.removeItem('products');
   localStorage.setItem('products', JSON.stringify(newItems));
}

/* Event Listeners */
openCartBtn.addEventListener('click', showCart);
closeCartBtn.addEventListener('click',closeCart);
products.addEventListener('click',e=>addProductToCart(e));
clearCartBtn.addEventListener('click', clearCart);
cartProducts.addEventListener('click', e=>deleteCartProduct(e));
storeBtns.addEventListener('click', e=>filterBtn(e));
searchFilter.addEventListener('keyup',e=>filterInput(e));

/* Dom Content Loaded */
document.addEventListener('DOMContentLoaded', ()=>{

   let itemsArr = JSON.parse(localStorage.getItem('products'));
   itemsArr.forEach(itemArr=>{

      // Add Items to The Cart
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
         <div class="cart-img">
            <img src=${itemArr.image}>
         </div>
         <div class="cart-title-price">
            <div class="cart-name">${itemArr.name}</div>
            <div class="cart-price">$<span class="cart-price-amount">${itemArr.price}</span></div>
         </div>
         <i data-id=${itemArr.id} class="fas fa-trash-alt"></i>
      `
      cartProducts.appendChild(div);

      // Update TOTAL
      total+= itemArr.price;
      totalPrice.innerHTML = total;

      // Update COUNT
      count+=1;
      countNum.innerHTML = count;
   });
})