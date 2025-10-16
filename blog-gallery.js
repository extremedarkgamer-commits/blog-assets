// GALERIA DENTRO DAS POSTAGENS
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".gallery").forEach(gallery => {
    const imgsAttr = gallery.getAttribute("data-imgs");
    if (!imgsAttr) return;

    const imgs = imgsAttr.split(",").map(i => i.trim());
    if (!imgs.length) return;

    // estrutura da galeria
    const main = document.createElement("div");
    main.className = "gallery-main";
    const mainImg = document.createElement("img");
    mainImg.src = imgs[0];
    mainImg.alt = "main";
    mainImg.addEventListener("click", () => openLightbox(0));
    main.appendChild(mainImg);

    const thumbs = document.createElement("div");
    thumbs.className = "gallery-thumbs";
    imgs.slice(1).forEach((url, i) => {
      const t = document.createElement("img");
      t.src = url;
      t.alt = `thumb${i}`;
      t.addEventListener("click", () => openLightbox(i + 1));
      thumbs.appendChild(t);
    });

    gallery.innerHTML = "";
    gallery.appendChild(main);
    gallery.appendChild(thumbs);

    window.galleryImages = imgs;
  });
});

// LIGHTBOX
document.addEventListener("DOMContentLoaded", () => {
  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.style.display = "none";
  lb.innerHTML = `
    <span class="lightbox-nav lightbox-prev" onclick="prevImage(event)">‹</span>
    <img id="lightbox-img" src="">
    <span class="lightbox-nav lightbox-next" onclick="nextImage(event)">›</span>
  `;
  lb.addEventListener("click", e => {
    if (e.target.id === "lightbox" || e.target.tagName === "IMG") lb.style.display = "none";
  });
  document.body.appendChild(lb);
});

let currentIndex = 0;
function openLightbox(i) {
  currentIndex = i;
  showImage();
  document.getElementById("lightbox").style.display = "flex";
}
function showImage() {
  document.getElementById("lightbox-img").src = window.galleryImages[currentIndex];
}
function prevImage(e) {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + window.galleryImages.length) % window.galleryImages.length;
  showImage();
}
function nextImage(e) {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % window.galleryImages.length;
  showImage();
}
document.addEventListener("keydown", e => {
  const lb = document.getElementById("lightbox");
  if (lb && lb.style.display === "flex") {
    if (e.key === "ArrowLeft") prevImage(e);
    if (e.key === "ArrowRight") nextImage(e);
    if (e.key === "Escape") lb.style.display = "none";
  }
});


// MINIATURAS AUTOMÁTICAS NA HOME
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".gallery-thumb[data-postid]").forEach(el => {
    const postId = el.getAttribute("data-postid");
    if (!postId) return;
    try {
      const blogId = window._WidgetManager._GetAllData().blog.blogId;
      const url = `https://www.blogger.com/feeds/${blogId}/posts/default/${postId}?alt=json`;

      fetch(url)
        .then(r => r.json())
        .then(data => {
          const content = data.entry?.content?.$t || "";
          const match = content.match(/https?:\/\/[^"'<>]+?\.(jpg|jpeg|png|webp)/i);
          if (match) {
            el.style.backgroundImage = `url(${match[0]})`;
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
          } else {
            el.style.backgroundColor = "#333";
          }
        })
        .catch(err => console.warn("thumb error:", err));
    } catch (e) {
      console.warn("thumb fetch fail", e);
    }
  });
});
