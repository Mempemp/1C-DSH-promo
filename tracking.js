(() => {
  const configured = window.DSH_COUNTER_ENDPOINT;
  if (!configured) return;
  let endpoint;
  try { endpoint = new URL(configured); if (endpoint.protocol !== 'https:') return; } catch { return; }
  document.querySelectorAll('[data-instructions]').forEach(link => {
    // A real POST form avoids counting link previews, crawlers and prefetches.
    const form = document.createElement('form');
    form.action = endpoint.href; form.method = 'post'; form.target = '_blank'; form.rel = 'noopener noreferrer';
    const button = document.createElement('button');
    button.type = 'submit'; button.className = link.className; button.innerHTML = link.innerHTML;
    form.append(button); link.replaceWith(form);
  });
})();
