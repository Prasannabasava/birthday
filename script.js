// 🎨 Paper Blast Animation
const paperCanvas = document.getElementById('paperBlastCanvas');
const paperCtx = paperCanvas.getContext('2d');
paperCanvas.width = window.innerWidth;
paperCanvas.height = window.innerHeight;

const papers = [];

class Paper {
  constructor() {
    this.x = paperCanvas.width / 2;
    this.y = paperCanvas.height / 2;
    this.size = Math.random() * 20 + 10;
    this.speedX = Math.random() * 10 - 5;
    this.speedY = Math.random() * 10 - 5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 6 - 3;
    this.opacity = 1;
    this.color = `hsl(${Math.random() * 360}, 70%, 70%)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.01;
    this.size *= 0.99;
  }

  draw() {
    paperCtx.save();
    paperCtx.globalAlpha = this.opacity;
    paperCtx.translate(this.x, this.y);
    paperCtx.rotate((this.rotation * Math.PI) / 180);
    paperCtx.fillStyle = this.color;
    paperCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    paperCtx.restore();
  }
}

function animatePaperBlast() {
  paperCtx.clearRect(0, 0, paperCanvas.width, paperCanvas.height75);
  papers.forEach((paper, index) => {
    paper.update();
    paper.draw();
    if (paper.opacity <= 0 || paper.size < 1) {
      papers.splice(index, 1);
    }
  });

  if (papers.length > 0) {
    requestAnimationFrame(animatePaperBlast);
  } else {
    paperCanvas.style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    animateHeart();
    backgroundMusic.play().catch(err => console.warn("Autoplay failed:", err));
  }
}

// 🎨 Heart Canvas Animation
const heartCanvas = document.getElementById('heartCanvas');
const heartCtx = heartCanvas.getContext('2d');
heartCanvas.width = window.innerWidth;
heartCanvas.height = window.innerHeight;

let t = 0;
const particles = [];
let loopCount = 0;
let maxLoopCount = 2 * (Math.PI * 2 / 0.05);
let buttonShown = false;

function drawHeart(x, y, size) {
  heartCtx.beginPath();
  heartCtx.moveTo(x, y);
  heartCtx.bezierCurveTo(x + size, y - size, x + size * 2, y + size, x, y + size * 2);
  heartCtx.bezierCurveTo(x - size * 2, y + size, x - size, y - size, x, y);
  heartCtx.fillStyle = 'red';
  heartCtx.fill();
}

function animateHeart() {
  const x = heartCanvas.width / 2 + 180 * Math.pow(Math.sin(t), 3);
  const y = heartCanvas.height / 2 - 10 * (15 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  particles.push({ x, y, size: 4 + Math.random() * 2 });
  t += 0.05;
  loopCount++;

  if (loopCount >= maxLoopCount && !buttonShown) {
    document.getElementById('magicBtn').style.display = 'block';
    buttonShown = true;
  }

  heartCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
  particles.forEach((p, i) => {
    drawHeart(p.x, p.y, p.size);
    p.size *= 0.98;
    if (p.size < 0.5) particles.splice(i, 1);
  });

  requestAnimationFrame(animateHeart);
}

// 🎵 Audio Elements
const backgroundMusic = document.getElementById('birthdayMusic');
const mainMusic = document.getElementById('bgMusic');
const voiceNote = document.getElementById('voiceNote');

// 🎁 UI Elements
const envelope = document.getElementById('envelope');
const magicBtn = document.getElementById('magicBtn');
const imageContainer = document.getElementById('imageContainer');
const currentImage = document.getElementById('currentImage');
const loveLetter = document.getElementById('loveLetter');

// 🖼️ Local image paths
const images = [
  "images/image.jpg",
  "images/image.jpg",
  "images/image.jpg",
  "images/image.jpg",
  "images/image.jpg",
  "images/image.jpg"
];

let currentIndex = 0;

function showNextImage() {
  if (currentIndex >= images.length) {
    imageContainer.style.display = 'none';
    loveLetter.style.display = 'flex';
    voiceNote.play();
    return;
  }

  // Randomize entry direction
  const directions = [
    { x: '-200%', y: '-50%', rotate: '-30deg' },
    { x: '200%', y: '-50%', rotate: '30deg' },
    { x: '-50%', y: '-200%', rotate: '-20deg' },
    { x: '-50%', y: '200%', rotate: '20deg' }
  ];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  
  currentImage.src = images[currentIndex];
  imageContainer.style.display = 'block';
  imageContainer.style.transform = `translate(${direction.x}, ${direction.y}) rotate(${direction.rotate})`;
  
  // Trigger animation
  setTimeout(() => {
    imageContainer.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
    imageContainer.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    imageContainer.style.opacity = '1';
    
    setTimeout(() => {
      imageContainer.style.transition = 'none';
      imageContainer.style.display = 'none';
      currentIndex++;
      setTimeout(showNextImage, 1000);
    }, 3000);
  }, 50);
}

// 🎇 Envelope Click
envelope.addEventListener('click', () => {
  envelope.classList.add('clicked');
  setTimeout(() => {
    envelope.style.display = 'none';
    paperCanvas.style.display = 'block';
    
    // Create paper particles
    for (let i = 0; i < 50; i++) {
      papers.push(new Paper());
    }
    
    animatePaperBlast();
  }, 600); // Delay to allow envelope animation to complete
});

// 🎇 Magic Button Click
magicBtn.addEventListener('click', () => {
  magicBtn.style.display = 'none';
  backgroundMusic.pause();
  mainMusic.play();
  showNextImage();
});

// 🔊 Autoplay-safe background music
window.addEventListener('click', () => {
  if (backgroundMusic && backgroundMusic.paused) {
    backgroundMusic.play().catch(err => {
      console.warn("Autoplay failed:", err);
    });
  }
}, { once: true });