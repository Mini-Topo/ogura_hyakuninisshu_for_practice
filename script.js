const POEM_CSV_PATH = 'poems.csv';
const IMAGE_COUNT = 10;
const IMAGE_PATH_PREFIX = 'images/f1s1_';
const IMAGE_EXTENSION = '.jpg';
const IMAGE_ID_LENGTH = 3;

const state = {
  poems: [],
  currentIndex: 0,
};

const poemTextElement = document.getElementById('poemText');
const imageGridElement = document.getElementById('imageGrid');

document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
  try {
    state.poems = await loadPoemsFromCsv(POEM_CSV_PATH);
    renderImageGrid(imageGridElement, IMAGE_COUNT);
    updatePoemText();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    poemTextElement.textContent = 'データの読み込みに失敗しました。';
  }
}

async function loadPoemsFromCsv(csvPath) {
  const response = await fetch(csvPath);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${csvPath}: ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();
  return parsePoems(csvText);
}

function parsePoems(csvText) {
  return csvText
    .trim()
    .split('\n')
    .slice(1) // ヘッダー除去
    .filter(Boolean)
    .map(parsePoemLine);
}

function parsePoemLine(line) {
  const [id, , upper, lower] = line.split(',').map(part => part.trim());
  return {
    id,
    upper,
    lower,
    full: `${upper}\n${lower}`,
  };
}

function renderImageGrid(container, count) {
  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= count; i += 1) {
    fragment.appendChild(createImageElement(i));
  }
  container.appendChild(fragment);
}

function createImageElement(sequenceNumber) {
  const img = document.createElement('img');
  const paddedNumber = padNumber(sequenceNumber, IMAGE_ID_LENGTH);
  img.src = `${IMAGE_PATH_PREFIX}${paddedNumber}${IMAGE_EXTENSION}`;
  img.alt = `Image ${sequenceNumber}`;
  img.dataset.id = String(sequenceNumber);
  img.addEventListener('click', handleImageSelection);
  return img;
}

function handleImageSelection(event) {
  const target = event.currentTarget;
  const selectedId = target.dataset.id;
  const currentPoem = state.poems[state.currentIndex];

  if (!currentPoem) {
    return;
  }

  if (selectedId === currentPoem.id) {
    target.style.visibility = 'hidden';
    state.currentIndex += 1;
    updatePoemText();
  } else {
    alert('違います！');
  }
}

function updatePoemText() {
  const currentPoem = state.poems[state.currentIndex];
  if (!currentPoem) {
    poemTextElement.textContent = '';
    return;
  }

  poemTextElement.textContent = currentPoem.upper;
}

function padNumber(value, length) {
  return value.toString().padStart(length, '0');
}
