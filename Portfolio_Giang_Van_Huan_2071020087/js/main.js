const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
}
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// Hiệu ứng tuyết rơi bằng Canvas, tự điều chỉnh theo kích thước màn hình.
const canvas = document.querySelector("#snow");
const ctx = canvas ? canvas.getContext("2d") : null;
let flakes = [], snowEnabled = true, raf;
function resizeSnow() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  flakes = Array.from({length: Math.min(115, Math.floor(innerWidth / 8))}, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: Math.random() * 2.2 + .5, speed: Math.random() * 1.1 + .35,
    drift: (Math.random() - .5) * .55, alpha: Math.random() * .65 + .25
  }));
}
function drawSnow() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  if (snowEnabled) {
    for (const f of flakes) {
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`; ctx.fill();
      f.y += f.speed; f.x += f.drift + Math.sin(f.y / 55) * .25;
      if (f.y > innerHeight + 5) { f.y = -5; f.x = Math.random() * innerWidth; }
      if (f.x < -5) f.x = innerWidth + 5;
      if (f.x > innerWidth + 5) f.x = -5;
    }
  }
  raf = requestAnimationFrame(drawSnow);
}
if (canvas && ctx) {
  resizeSnow(); drawSnow();
  window.addEventListener("resize", resizeSnow);
}
const snowToggle = document.querySelector("#snow-toggle");
if (snowToggle && ctx) snowToggle.addEventListener("click", () => {
  snowEnabled = !snowEnabled;
  snowToggle.setAttribute("aria-pressed", String(snowEnabled));
  snowToggle.querySelector("span").textContent = `Tuyết rơi: ${snowEnabled ? "Bật" : "Tắt"}`;
  if (!snowEnabled) ctx.clearRect(0, 0, innerWidth, innerHeight);
});

// Chọn và xem trước ảnh đại diện.
const photoInput = document.querySelector("#profile-photo-input");
const photoPreview = document.querySelector("#profile-photo-preview");
const photoFrame = document.querySelector("#profile-photo-box");
if (photoInput && photoPreview && photoFrame) {
  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn một tệp hình ảnh.");
      photoInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      photoPreview.src = reader.result;
      photoFrame.classList.add("has-image");
    });
    reader.readAsDataURL(file);
  });
}
