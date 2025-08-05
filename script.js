
const products = [
  { id: 1, name: "Tie-Dye Lounge Set", price: 2404, img: "assets/product-1.jpg" },
  { id: 2, name: "Sunburst Tracksuit", price: 1449, img: "assets/product-2.jpg" },
  { id: 3, name: "Retro Red Streetwear", price: 1299, img: "assets/product-3.jpg" },
  { id: 4, name: "Urban Sportwear combo", price: 7991.50, img: "assets/product-4.jpg" },
  { id: 5, name: "Oversized Knit & Coat", price: 2995.25, img: "assets/product-5.jpg" },
  { id: 6, name: "Chic Monochrome Blazer", price: 1785, img: "assets/product-6.jpg" }
];

const productGrid = document.querySelector('.product-grid');
const selectedList = document.querySelector('.selected-products-list');
const progressBar = document.querySelector('.progress');
const progressText = document.querySelector('.progress-text');
const subtotalDiv = document.querySelector('.subtotal');
const discountDiv = document.querySelector('.discount');
const totalDiv = document.querySelector('.total');
const ctaBtn = document.querySelector('.cta-btn');
const MAX_BUNDLE = 3;
const BUNDLE_DISCOUNT = 0.30;

let selected = [];


products.forEach(p => {
  let card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <div class="product-info">
      <h3>${p.name}</h3>
      <p>₹${p.price.toFixed(2)}</p>
    </div>
    <button class="toggle-btn" data-id="${p.id}">Add to Bundle</button>
  `;
  productGrid.appendChild(card);
});

productGrid.addEventListener('click', e => {
  if (!e.target.classList.contains('toggle-btn')) return;
  const pid = Number(e.target.dataset.id);
  const idx = selected.indexOf(pid);

  if (idx > -1) {
 
    selected.splice(idx, 1);
  } else {
    
    if (selected.length < MAX_BUNDLE)
      selected.push(pid);
    else
      alert(`Only ${MAX_BUNDLE} products per bundle!`);
  }
  updateUI();
});

selectedList.addEventListener('click', e => {
  if (e.target.classList.contains('remove-btn')) {
    const pid = Number(e.target.dataset.id);
    selected = selected.filter(id => id !== pid);
    updateUI();
  }
});

// Update UI
function updateUI() {
  // Product cards toggle state
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    const pid = Number(btn.dataset.id);
    if (selected.includes(pid)) {
      btn.classList.add('added');
      btn.textContent = 'Added to Bundle';
    } else {
      btn.classList.remove('added');
      btn.textContent = 'Add to Bundle';
    }
  });


  progressBar.style.width = `${(selected.length / MAX_BUNDLE) * 100}%`;
  progressText.textContent = `${selected.length}/${MAX_BUNDLE} added`;

  selectedList.innerHTML = '';
  selected.forEach(pid => {
    const p = products.find(x => x.id === pid);
    selectedList.innerHTML += `
      <li>
        <img src="${p.img}" alt="${p.name}">
        <span>${p.name} - ₹${p.price.toFixed(2)}</span>
        <button class="remove-btn" data-id="${p.id}" title="Remove">✖</button>
      </li>
    `;
  });


  let subtotal = selected.map(pid => products.find(p => p.id === pid).price).reduce((a, b) => a + b, 0);
  subtotalDiv.textContent = `Subtotal: ₹${subtotal.toFixed(2)}`;
  
  let discount = 0, total = subtotal;
  if (selected.length >= 3) {
    discount = subtotal * BUNDLE_DISCOUNT;
    total = subtotal - discount;
    discountDiv.classList.remove('hidden');
    discountDiv.textContent = `Discount: -₹${discount.toFixed(2)}`;
  } else {
    discountDiv.classList.add('hidden');
    discountDiv.textContent = '';
  }

  totalDiv.textContent = `Total: ₹${total > 0 ? total.toFixed(2) : '0.00'}`;

  if (selected.length >= 3) {
    ctaBtn.disabled = false;
    ctaBtn.classList.add('active');
  } else {
    ctaBtn.disabled = true;
    ctaBtn.classList.remove('active');
  }
}

ctaBtn.addEventListener('click', () => {
  const selProducts = selected.map(pid => products.find(x => x.id === pid));
  console.log('Bundle added:', selProducts);
  alert('Bundle logged in console!');
});

updateUI();
