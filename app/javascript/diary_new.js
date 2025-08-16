// app/javascript/diary_new.js
document.addEventListener("turbo:load", () => {
  const root = document.querySelector(".diary-new");
  if (!root) return;

  // JS 稼働マーク（CSSの .has-js 分岐に使う）
  document.documentElement.classList.add("has-js");

  // フェードイン
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-in"); });
  }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
  root.querySelectorAll("[data-reveal]").forEach(el => io.observe(el));

  const form   = root.querySelector("form.diary-form");
  const title  = root.querySelector("#tweet_name");
  const diary  = root.querySelector("#tweet_diary");
  const submit = root.querySelector("#submit-btn");

  // ---------- 文字数カウント ----------
  const titleCount = root.querySelector("#title-count");
  const diaryCount = root.querySelector("#diary-count");
  const updateCounts = () => {
    if (titleCount) titleCount.textContent = (title?.value || "").length;
    if (diaryCount) diaryCount.textContent = (diary?.value || "").length;
  };
  title?.addEventListener("input", updateCounts);
  diary?.addEventListener("input", updateCounts);
  updateCounts();

  // ---------- テキストエリアのオートリサイズ ----------
  const autosize = (el) => { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; };
  if (diary) {
    autosize(diary);
    diary.addEventListener("input", () => autosize(diary));
  }

  // ---------- 画像プレビュー & D&D ----------
  const drop = root.querySelector("#upload-drop");
  const input = root.querySelector("#tweet_image");
  const previews = root.querySelector("#upload-previews");
  const MAX_FILES = 4;

  const renderThumbs = (files) => {
    previews.innerHTML = "";
    Array.from(files).slice(0, MAX_FILES).forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      const wrap = document.createElement("div");
      wrap.className = "upload-thumb";
      wrap.innerHTML = `
        <img src="${url}" alt="preview ${idx+1}">
        <button type="button" class="upload-remove" aria-label="画像を削除">削除</button>
      `;
      wrap.querySelector(".upload-remove").addEventListener("click", () => {
        const dt = new DataTransfer();
        Array.from(input.files).forEach((f, i) => { if (i !== idx) dt.items.add(f); });
        input.files = dt.files;
        renderThumbs(input.files);
        URL.revokeObjectURL(url);
      });
      previews.appendChild(wrap);
    });
  };

  const acceptFiles = (fileList) => {
    const files = Array.from(fileList).filter(f => /^image\//.test(f.type));
    const current = Array.from(input.files);
    const merged = current.concat(files).slice(0, MAX_FILES);
    const dt = new DataTransfer();
    merged.forEach(f => dt.items.add(f));
    input.files = dt.files;
    renderThumbs(input.files);
  };

  input?.addEventListener("change", (e) => acceptFiles(e.target.files));

  ["dragenter","dragover"].forEach(ev =>
    drop?.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("is-dragover"); })
  );
  ["dragleave","dragend","drop"].forEach(ev =>
    drop?.addEventListener(ev, () => drop.classList.remove("is-dragover"))
  );
  drop?.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) acceptFiles(e.dataTransfer.files);
  });
  // クリックでもファイル選択
  drop?.addEventListener("click", () => input?.click());

  // ---------- ローカル保存（自動） ----------
  const KEY = "diary:new:v1";
  const saveDraft = () => {
    const data = {
      name:  title?.value || "",
      diary: diary?.value || "",
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  };
  const restoreDraft = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (title && !title.value) title.value = data.name || "";
      if (diary && !diary.value) diary.value = data.diary || "";
      updateCounts();
      if (diary) autosize(diary);
    } catch {}
  };
  restoreDraft();
  title?.addEventListener("input", saveDraft);
  diary?.addEventListener("input", saveDraft);

  // ---------- 送信可否（タイトル or 本文が空なら無効） ----------
  const validate = () => {
    const ok = (title?.value?.trim().length || 0) > 0 || (diary?.value?.trim().length || 0) > 0;
    if (submit) submit.disabled = !ok;
  };
  title?.addEventListener("input", validate);
  diary?.addEventListener("input", validate);
  validate();

  // ---------- ショートカット：Cmd/Ctrl + Enter で送信 ----------
  form?.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!submit?.disabled) form.requestSubmit();
    }
  });
});
