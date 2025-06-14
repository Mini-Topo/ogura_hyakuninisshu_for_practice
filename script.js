let poems = [];
let index = 0;
let showingImage = true;

const poemText = document.getElementById('poemText');
const imageGrid = document.getElementById('imageGrid');

async function loadCSV() {
  const response = await fetch('poems.csv');
  const text = await response.text();
  const lines = text.trim().split('\n').slice(1); // ヘッダー除去
  poems = lines.map(line => {
    const parts = line.split(',');
    const id = parts[0].trim();
    const ue = parts[2].trim();
    const shimo = parts[3].trim();
    const full = ue + '\n' + shimo;
    return { id, full, ue, shimo };
  });
  createImageGrid();
  showPoem();
}

function padId(id) {
  return id.toString().padStart(3, '0'); // "1" → "001"
}

function createImageGrid() {
  for (let i = 1; i <= 10; i++) {
    const img = document.createElement('img');
    const paddedNumber = String(i).padStart(3, '0'); // 001, 002, ..., 010
    img.src = `images/f1s1_${paddedNumber}.jpg`;
    img.alt = `Image ${i}`;
    img.dataset.id = i; // 各画像に ID を持たせる

    img.addEventListener('click', () => {
      const currentPoem = poems[index];
      if (img.dataset.id === currentPoem.id) {
        img.style.visibility = 'hidden';  // 正解なら画像を消す（空間を保持）
        index++;
        showPoem();
      } else {
        alert("違います！");
      }
    });

    imageGrid.appendChild(img);
  }
}

function showPoem() {
  if (index < poems.length) {
    poemText.textContent = poems[index].ue;
  }
}

window.onload = loadCSV;