// SOMI Lab — main.js

// Align "skip the boring stuff" hint to the Vibes nav link
function positionVibesHint() {
  const hint = document.querySelector('.hero-vibes-hint');
  const vibesLink = document.querySelector('.nav-links a[href="vibes.html"]');
  if (!hint || !vibesLink) return;
  const linkRect = vibesLink.getBoundingClientRect();
  const linkCenterX = linkRect.left + linkRect.width / 2;
  const right = window.innerWidth - linkCenterX - hint.offsetWidth / 2;
  hint.style.right = Math.max(0, right) + 'px';
}
document.addEventListener('DOMContentLoaded', positionVibesHint);
window.addEventListener('resize', positionVibesHint);

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.topic-card, .project-item, .person-card-sm, .pub-item, .news-card, .apply-sidebar-card, .contact-block');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// Project detail modal (Ongoing Projects)
const projectModal = document.getElementById('project-modal');
const projectDetailsTpl = document.getElementById('project-details');
if (projectModal && projectDetailsTpl) {
  const titleEl = projectModal.querySelector('.project-modal-title');
  const bodyEl = projectModal.querySelector('.project-modal-body');
  const detailMap = {};
  projectDetailsTpl.content.querySelectorAll('[data-project]').forEach(node => {
    detailMap[node.dataset.project] = {
      title: node.dataset.title,
      body: node.innerHTML,
    };
  });

  let lastTrigger = null;

  const openModal = (key, trigger) => {
    const detail = detailMap[key];
    if (!detail) return;
    titleEl.textContent = detail.title;
    bodyEl.innerHTML = detail.body;
    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    lastTrigger = trigger;
    const closeBtn = projectModal.querySelector('.project-modal-close');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastTrigger) lastTrigger.focus();
  };

  document.querySelectorAll('.project-item[data-project]').forEach(item => {
    item.addEventListener('click', () => openModal(item.dataset.project, item));
  });

  projectModal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('open')) {
      closeModal();
    }
  });
}

// Student Research modal
const srModal = document.getElementById('sr-modal');
const srDetailsTpl = document.getElementById('sr-details');
if (srModal && srDetailsTpl) {
  const srTagEl   = document.getElementById('sr-modal-tag');
  const srTitleEl = document.getElementById('sr-modal-title');
  const srBodyEl  = document.getElementById('sr-modal-body');
  const srFooterEl = document.getElementById('sr-modal-footer');

  const srMap = {};
  srDetailsTpl.content.querySelectorAll('[data-sr]').forEach(node => {
    srMap[node.dataset.sr] = {
      tag:    node.dataset.tag,
      title:  node.dataset.title,
      body:   node.dataset.body,
      author: node.dataset.author,
      role:   node.dataset.role,
    };
  });

  let srLastTrigger = null;

  const openSrModal = (key, trigger) => {
    const d = srMap[key];
    if (!d) return;
    srTagEl.textContent   = d.tag;
    srTitleEl.textContent = d.title;
    srBodyEl.textContent  = d.body;
    srFooterEl.innerHTML  = `
      <span class="sr-modal-author">${d.author}</span>
      <span class="sr-modal-role">${d.role}</span>
    `;
    srModal.classList.add('open');
    srModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sr-modal-open');
    srLastTrigger = trigger;
    srModal.querySelector('.sr-modal-close').focus();
  };

  const closeSrModal = () => {
    srModal.classList.remove('open');
    srModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sr-modal-open');
    if (srLastTrigger) srLastTrigger.focus();
  };

  document.querySelectorAll('.student-research-card[data-sr]').forEach(card => {
    card.addEventListener('click', () => openSrModal(card.dataset.sr, card));
  });

  srModal.querySelectorAll('[data-sr-close]').forEach(el => {
    el.addEventListener('click', closeSrModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && srModal.classList.contains('open')) {
      closeSrModal();
    }
  });
}
