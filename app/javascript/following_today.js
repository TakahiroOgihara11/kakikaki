document.addEventListener("DOMContentLoaded", () => {
  // 画像モーダル
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-image");
  document.querySelectorAll(".following-posts-page .clickable-image").forEach(img => {
    img.addEventListener("click", () => {
      modalImg.src = img.dataset.fullImageUrl;
      modal.classList.add("open");
    });
  });
  modal?.addEventListener("click", () => { 
    modal.classList.remove("open"); 
    modalImg.src = ""; 
  });

  // コメント開閉
  document.querySelectorAll(".following-posts-page .us-comments__toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      const section = document.getElementById(id);
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      section.setAttribute("aria-hidden", String(expanded));
      section.classList.toggle("is-collapsed", expanded);
      section.classList.toggle("is-expanded", !expanded);
    });
  });

  // チップ補助（あれば）
  document.querySelectorAll(".following-posts-page .us-chip").forEach(chip => {
    chip.addEventListener("click", (e) => {
      const textarea = e.target.closest(".us-form")?.querySelector(".us-input");
      if (!textarea) return;
      const insert = e.target.getAttribute("data-insert") || "";
      textarea.value = textarea.value ? (textarea.value + " " + insert) : insert;
      textarea.focus();
    });
  });

  // リップル効果
  document.querySelectorAll('.following-posts-page [data-ripple]').forEach(el => {
    el.addEventListener('click', function (e) {
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size/2) + 'px';
      r.style.top  = (e.clientY - rect.top  - size/2) + 'px';
      this.appendChild(r);
      setTimeout(() => r.remove(), 500);
    });
  });
});
