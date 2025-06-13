let poems = [];
let index = 0;
let showingImage = true;

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
    return { id, full };
  });
  showImage();
}

function padId(id) {
  return id.toString().padStart(3, '0'); // "1" → "001"
}

function showImage() {
  const img = document.getElementById('shimo-image');
  const text = document.getElementById('full-poem');
  img.src = `images/f1s1_${padId(poems[index].id)}.jpg`;
  img.style.display = 'block';
  text.style.display = 'none';
  showingImage = true;
}

function showText() {
  const img = document.getElementById('shimo-image');
  const text = document.getElementById('full-poem');
  text.textContent = poems[index].full;
  img.style.display = 'none';
  text.style.display = 'block';
  showingImage = false;
}

function next() {
  if (index >= poems.length) {
    alert("おしまい！");
    return;
  }

  if (showingImage) {
    showText();
  } else {
    index++;
    if (index < poems.length) {
      showImage();
    } else {
      alert("おしまい！");
    }
  }
}

window.onload = loadCSV;
