/* App interactions for 老王研究所 */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Gate modal logic (用于需要授权的页面按钮)
  const gateModal = $('#gate-modal');
  function openGate() { gateModal?.setAttribute('aria-hidden', 'false'); }
  function closeGate() { gateModal?.setAttribute('aria-hidden', 'true'); }
  gateModal?.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === 'close' || target.classList.contains('modal-backdrop')) {
      closeGate();
    }
  });
  $$('[data-action="contact"]').forEach(btn => btn.addEventListener('click', openGate));
  // 统一事件委托：任何 .gated-link 点击均弹出授权（支持动态内容）
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const gated = t.closest('.gated-link');
    if (gated) {
      e.preventDefault();
      openGate();
    }
  });

  // 已移除互动栏目与本地发帖逻辑

  // 简易轮播
  const track = document.querySelector('.carousel-track');
  if (track) {
    const slides = Array.from(track.children);
    let idx = 0;
    setInterval(() => {
      if (slides.length === 0) return;
      idx = (idx + 1) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
    }, 3000);
  }

  // 代码中心：从 JSON 生成卡片
  const codeList = $('#code-list');
  async function loadMacros() {
    try {
      const res = await fetch('assets/macros.json');
      if (!res.ok) throw new Error('fail');
      return await res.json();
    } catch {
      return [];
    }
  }

  function createCodeCard(item) {
    const card = document.createElement('div');
    card.className = 'card code-card';
    // 使用说明与下载均改为上锁弹窗
    const docLink = '<button class="btn gated-link" type="button" title="需授权">使用说明（已上锁）</button>';
    const dlDisabled = '<button class="btn gated-link" type="button" title="需授权">下载（已上锁）</button>';
    card.innerHTML = `
      <h4>${item.name}</h4>
      <div class="desc">${item.description || ''}</div>
      <div class="meta"><span class="tag">版本 ${item.version || 'N/A'}</span><span class="tag">${item.category || '宏代码'}</span></div>
      <div class="actions">${docLink}${dlDisabled}</div>
    `;
    return card;
  }

  loadMacros().then(items => {
    if (!codeList) return;
    if (!Array.isArray(items) || items.length === 0) {
      codeList.innerHTML = '<div class="muted">尚无可显示的条目。</div>';
      return;
    }
    const frag = document.createDocumentFragment();
    items.forEach(item => frag.appendChild(createCodeCard(item)));
    codeList.appendChild(frag);
  });
})();


