// --- 1. SUPABASE SETUP ---
const SUPABASE_URL = 'https://alfmvdyuufhtxkgquldx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bA4xUBIwGyUfpSYWwlqL5Q_-u5HtO_p';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// --- 2. SVGS ILUSTRADOS SOFT (4 FLORES AMARILLAS) ---
// --- SVGS EN PIXEL ART CUTE ₊˚⊹♡ ---
const SPRITES = {
  // 1. Sakura
  sakura: `<svg viewBox="0 0 16 16" style="image-rendering: pixelated;">
    <path fill="#553a26" d="M7 10h2v6H7z"/>
    <path fill="#fef08a" d="M6 1h4v2H6zM1 6h2v4H1zM13 6h2v4h-2zM6 13h4v2H6z"/>
    <path fill="#fde047" d="M3 3h3v3H3zM10 3h3v3h-3zM3 10h3v3H3zM10 10h3v3h-3z"/>
    <path fill="#f59e0b" d="M6 6h4v4H6z"/>
  </svg>`,

  // 2. Girasol
  girasol: `<svg viewBox="0 0 16 16" style="image-rendering: pixelated;">
    <path fill="#553a26" d="M7 10h2v6H7z"/>
    <path fill="#facc15" d="M5 1h6v2H5zM1 5h2v6H1zM13 5h2v6h-2zM5 13h6v2H5zM3 3h2v2H3zM11 3h2v2h-2zM3 11h2v2H3zM11 11h2v2h-2z"/>
    <path fill="#78350f" d="M5 5h6v6H5z"/>
  </svg>`,

  // 3. Margarita
  margarita: `<svg viewBox="0 0 16 16" style="image-rendering: pixelated;">
    <path fill="#553a26" d="M7 10h2v6H7z"/>
    <path fill="#fef9c3" d="M6 1h4v3H6zM1 6h3v4H1zM12 6h3v4h-3zM6 12h4v3H6zM3 3h2v2H3zM11 3h2v2h-2zM3 11h2v2H3zM11 11h2v2h-2z"/>
    <path fill="#f59e0b" d="M5 5h6v6H5z"/>
  </svg>`,

  // 4. Tulipán
  tulipan: `<svg viewBox="0 0 16 16" style="image-rendering: pixelated;">
    <path fill="#553a26" d="M7 10h2v6H7z"/>
    <path fill="#fde047" d="M4 2h8v8H4z"/>
    <path fill="#fef08a" d="M6 2h4v6H6z"/>
    <path fill="#f59e0b" d="M4 2h2v3H4zM10 2h2v3h-2z"/>
  </svg>`,

  // 5. Mariposa ʚɞ
  mariposa: `<svg viewBox="0 0 16 16" style="image-rendering: pixelated;">
    <path fill="#bae6fd" d="M2 3h4v4H2zM10 3h4v4h-4zM3 8h3v3H3zM10 8h3v3h-3z"/>
    <path fill="#7dd3fc" d="M4 4h2v2H4zM10 4h2v2h-2z"/>
    <path fill="#475569" d="M7 2h2v10H7z"/>
  </svg>`,

  // 6. Abejita 𐞋𐞋
  abeja: `<svg viewBox="0 0 16 16" style="image-rendering: pixelated;">
    <path fill="#fde047" d="M3 5h10v6H3z"/>
    <path fill="#475569" d="M6 5h2v6H6zM10 5h2v6h-2z"/>
    <path fill="#f0f9ff" d="M5 2h3v3H5zM8 2h3v3H8z"/>
  </svg>`,

  // 7. Brillitos ✧.*
  brillos: `<svg viewBox="0 0 16 16" style="image-rendering: pixelated;">
    <path fill="#fef08a" d="M7 1h2v14H7zM1 7h14v2H1zM4 4h2v2H4zM10 10h2v2h-2z"/>
  </svg>`
};

// --- 3. ESTADO Y LÓGICA ---
let flowersData = [];
let selectedType = 'sakura';
let selectedDeco = 'none';

// Flor por defecto
const CREATOR_FLOWER = {
  id: 'creator',
  name: 'Nati',
  flower_type: 'sakura',
  decoration: 'brillos',
  message: '¡Bienvenidos a nuestro jardín colectivo! 🌼✨',
  pos_x: 50, 
  pos_y: 55
};

function nextScreen(num) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${num}`).classList.add('active');
}

function openGarden() {
  nextScreen(3);
  loadGarden();
  listenRealtime();
}

async function loadGarden() {
  const { data, error } = await _supabase.from('flowers').select('*');
  flowersData = error || !data || !data.length ? [CREATOR_FLOWER] : [CREATOR_FLOWER, ...data];
  renderGarden();
}

function renderGarden() {
  const canvas = document.getElementById('garden-canvas');
  canvas.innerHTML = '';

  flowersData.forEach(flower => {
    const item = document.createElement('div');
    item.className = 'flower-item';
    item.style.left = `${flower.pos_x}%`;
    item.style.top = `${flower.pos_y}%`;
    item.style.zIndex = Math.floor(flower.pos_y);

    const decoHtml = (flower.decoration && flower.decoration !== 'none') 
      ? `<div class="deco-sprite">${SPRITES[flower.decoration]}</div>` : '';

    item.innerHTML = `
      <div class="flower-sprite">${SPRITES[flower.flower_type] || SPRITES.sakura}</div>
      ${decoHtml}
      <div class="flower-tag">${flower.name}</div>
    `;

    item.onclick = () => openViewModal(flower);
    canvas.appendChild(item);
  });

  document.getElementById('counter').innerText = `${flowersData.length} flores plantadas 🌼`;
}

function listenRealtime() {
  _supabase
    .channel('public:flowers')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'flowers' }, payload => {
      flowersData.push(payload.new);
      renderGarden();
      showToast(`🌱 ${payload.new.name} acaba de plantar una flor`);
    })
    .subscribe();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Modal Formulario
function openPlantModal() {
  showStep(1);
  document.getElementById('plant-modal').classList.add('active');
}

function nextStep(step) {
  if (step === 2 && !document.getElementById('input-name').value.trim()) return;
  showStep(step);
}

function showStep(step) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${step}`).classList.add('active');
}

function selectFlower(type, el) {
  selectedType = type;
  el.parentNode.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function selectDeco(deco, el) {
  selectedDeco = deco;
  el.parentNode.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

async function submitFlower() {
  const name = document.getElementById('input-name').value.trim() || 'Anónimo';
  const message = document.getElementById('input-message').value.trim() || '¡Regalando flores amarillas! 🌼';

  const pos_x = Math.floor(Math.random() * 80) + 10;
  const pos_y = Math.floor(Math.random() * 45) + 40;

  const newFlower = { name, flower_type: selectedType, decoration: selectedDeco, message, pos_x, pos_y };

  await _supabase.from('flowers').insert([newFlower]);

  document.getElementById('plant-modal').classList.remove('active');
  document.getElementById('input-name').value = '';
  document.getElementById('input-message').value = '';
}

// Modal Ver
function openViewModal(flower) {
  document.getElementById('view-sprite').innerHTML = SPRITES[flower.flower_type] || SPRITES.sakura;
  document.getElementById('view-name').innerText = flower.name;
  document.getElementById('view-message').innerText = `"${flower.message}"`;
  document.getElementById('view-modal').classList.add('active');
}

function closeViewModal(e) {
  if (e.target.classList.contains('modal')) {
    document.getElementById('view-modal').classList.remove('active');
  }
}
