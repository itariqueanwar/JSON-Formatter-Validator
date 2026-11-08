// Redsite JSON Formatter & Validator — Local & In-Browser
(() => {
  const input = document.querySelector('#jsonInput');
  const output = document.querySelector('#jsonOutput');
  const statusContainer = document.querySelector('#statusContainer');
  const statusMessage = document.querySelector('#statusMessage');
  const errorAction = document.querySelector('#errorAction');
  const jumpErrorBtn = document.querySelector('#jumpErrorBtn');
  const errorAutoFixBtn = document.querySelector('#errorAutoFixBtn');

  const formatBtn = document.querySelector('#formatBtn');
  const minifyBtn = document.querySelector('#minifyBtn');
  const autoFixBtn = document.querySelector('#autoFixBtn');
  const copyBtn = document.querySelector('#copyBtn');
  const downloadBtn = document.querySelector('#downloadBtn');
  const clearBtn = document.querySelector('#clearBtn');
  const pasteBtn = document.querySelector('#pasteBtn');
  const sampleBtn = document.querySelector('#sampleBtn');
  const uploadBtn = document.querySelector('#uploadBtn');
  const fileInput = document.querySelector('#fileInput');
  const indentSelect = document.querySelector('#indentSize');
  const viewToggleBtn = document.querySelector('#viewToggleBtn');
  const wrapToggleBtn = document.querySelector('#wrapToggleBtn');
  const workbench = document.querySelector('#workbench');
  const inputStats = document.querySelector('#inputStats');
  const outputStats = document.querySelector('#outputStats');
  const dropZoneOverlay = document.querySelector('#dropZoneOverlay');

  let currentParsed = null;
  let lastError = null;

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = (bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2);
    return `${value} ${sizes[i]}`;
  }

  function getStats(str) {
    if (!str) return { chars: 0, lines: 0, bytes: 0 };
    const chars = str.length;
    const lines = str.length ? str.split('\n').length : 0;
    const bytes = new Blob([str]).size;
    return { chars, lines, bytes };
  }

  function updateInputStats() {
    const val = input.value;
    if (!val.trim()) {
      inputStats.textContent = '0 lines · 0 B';
      return;
    }
    const { lines, bytes } = getStats(val);
    inputStats.textContent = `${lines} ${lines === 1 ? 'line' : 'lines'} · ${formatBytes(bytes)}`;
  }

  function updateOutputStats(isMinified = false, originalBytes = 0) {
    const val = output.value;
    if (!val.trim()) {
      outputStats.textContent = '0 lines · 0 B';
      return;
    }
    const { lines, bytes } = getStats(val);
    let text = `${lines} ${lines === 1 ? 'line' : 'lines'} · ${formatBytes(bytes)}`;

    if (isMinified && originalBytes > 0 && bytes < originalBytes) {
      const savedPct = Math.round(((originalBytes - bytes) / originalBytes) * 100);
      text += ` (${savedPct}% smaller)`;
    }
    outputStats.textContent = text;
  }

  function setStatus(type, message, details = null) {
    // type: 'idle' | 'valid' | 'error' | 'repaired'
    statusContainer.className = `status-container ${type}`;
    statusMessage.textContent = message;

    if (type === 'error' && details) {
      lastError = details;
      errorAction.hidden = false;
      if (details.position !== null || details.line !== null) {
        jumpErrorBtn.hidden = false;
        jumpErrorBtn.textContent = `Jump to line ${details.line || 'error'}`;
      } else {
        jumpErrorBtn.hidden = true;
      }
      // Check if auto-fix might help
      const raw = input.value;
      const fixable = /['\/\/]/.test(raw) || /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$-]*)\s*:/.test(raw) || /,\s*[}\]]/.test(raw) || /\b(True|False|None)\b/.test(raw);
      errorAutoFixBtn.hidden = !fixable;
    } else {
      lastError = null;
      errorAction.hidden = true;
    }
  }

  function parseErrorLocation(text, error) {
    let line = null;
    let column = null;
    let position = null;

    // Pattern 1: position (\d+)
    const posMatch = error.message.match(/position\s+(\d+)/i);
    if (posMatch) {
      position = parseInt(posMatch[1], 10);
    }

    // Pattern 2: line (\d+) column (\d+)
    const lineColMatch = error.message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
    } else if (position !== null && !isNaN(position)) {
      const slice = text.slice(0, position);
      const lines = slice.split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    } else {
      // Pattern 3: V8 snippet pattern '..."<snippet>" is not valid JSON'
      const snippetMatch = error.message.match(/\.\.\.([\s\S]+?)" is not valid JSON/);
      if (snippetMatch) {
        const snippet = snippetMatch[1];
        const idx = text.indexOf(snippet);
        if (idx !== -1) {
          position = idx;
          const slice = text.slice(0, idx);
          const lines = slice.split('\n');
          line = lines.length;
          column = lines[lines.length - 1].length + 1;
        }
      }
    }

    return { line, column, position, message: error.message };
  }

  function parse(silent = false) {
    const raw = input.value.trim();
    if (!raw) {
      currentParsed = null;
      output.value = '';
      copyBtn.disabled = true;
      downloadBtn.disabled = true;
      updateInputStats();
      updateOutputStats();
      setStatus('idle', 'Paste or drop JSON above to begin.');
      return false;
    }

    try {
      currentParsed = JSON.parse(raw);
      updateInputStats();
      if (!silent) {
        setStatus('valid', 'Valid JSON syntax · Ready to format or minify.');
      }
      return true;
    } catch (err) {
      currentParsed = null;
      output.value = '';
      copyBtn.disabled = true;
      downloadBtn.disabled = true;
      updateInputStats();
      updateOutputStats();
      const loc = parseErrorLocation(raw, err);
      const msg = loc.line && loc.column
        ? `Syntax Error at Line ${loc.line}, Column ${loc.column}: ${err.message}`
        : `Syntax Error: ${err.message}`;
      setStatus('error', msg, loc);
      return false;
    }
  }

  function render(compact = false) {
    if (!input.value.trim()) {
      setStatus('idle', 'Please enter or paste JSON to format.');
      input.focus();
      return;
    }

    if (!parse(true)) return;

    const originalBytes = new Blob([input.value]).size;
    const space = compact ? 0 : indentSelect.value === 'tab' ? '\t' : Number(indentSelect.value);
    output.value = JSON.stringify(currentParsed, null, space);

    copyBtn.disabled = false;
    downloadBtn.disabled = false;
    updateOutputStats(compact, originalBytes);

    const mode = compact ? 'Minified' : 'Formatted';
    setStatus('valid', `✓ Valid JSON · ${mode} output ready to copy or download.`);
  }

  function stripComments(str) {
    let out = '';
    let inString = false;
    let stringChar = '';
    let isEscaped = false;
    let inLineComment = false;
    let inBlockComment = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const next = str[i + 1];

      if (inLineComment) {
        if (char === '\n') {
          inLineComment = false;
          out += char;
        }
        continue;
      }

      if (inBlockComment) {
        if (char === '*' && next === '/') {
          inBlockComment = false;
          i++; // skip /
        }
        continue;
      }

      if (inString) {
        out += char;
        if (isEscaped) {
          isEscaped = false;
        } else if (char === '\\') {
          isEscaped = true;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
        continue;
      }

      if (char === '"' || char === "'") {
        inString = true;
        stringChar = char;
        isEscaped = false;
        out += char;
        continue;
      }

      if (char === '/' && next === '/') {
        inLineComment = true;
        i++; // skip second /
        continue;
      }

      if (char === '/' && next === '*') {
        inBlockComment = true;
        i++; // skip *
        continue;
      }

      out += char;
    }

    return out;
  }

  function repairJson(str) {
    // 1. Strip comments safely outside strings
    let cleaned = stripComments(str.trim());
    // 2. Python/JS literals
    cleaned = cleaned.replace(/\bTrue\b/g, 'true')
                     .replace(/\bFalse\b/g, 'false')
                     .replace(/\bNone\b/g, 'null');
    // 3. Quote unquoted object keys: { key: "value" } -> { "key": "value" }
    cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$-]*)\s*:/g, '$1"$2":');
    // 4. Convert single-quoted strings to double quotes
    cleaned = cleaned.replace(/'((?:\\.|[^'\\])*)'/g, (match, inner) => {
      return '"' + inner.replace(/"/g, '\\"').replace(/\\'/g, "'") + '"';
    });
    // 5. Remove trailing commas before } or ]
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

    return cleaned;
  }

  function autoFix() {
    const raw = input.value.trim();
    if (!raw) {
      setStatus('idle', 'Paste JSON with errors to auto-repair.');
      return;
    }

    const repaired = repairJson(raw);
    try {
      const parsed = JSON.parse(repaired);
      currentParsed = parsed;
      input.value = repaired;
      updateInputStats();

      const space = indentSelect.value === 'tab' ? '\t' : Number(indentSelect.value);
      output.value = JSON.stringify(parsed, null, space);
      copyBtn.disabled = false;
      downloadBtn.disabled = false;
      updateOutputStats(false, new Blob([raw]).size);

      setStatus('repaired', '✓ Repaired common syntax issues (quotes, trailing commas, comments) and formatted JSON!');
    } catch (err) {
      const loc = parseErrorLocation(repaired, err);
      const msg = `Auto-fix resolved some errors, but remaining issue at Line ${loc.line || '?'}: ${err.message}`;
      setStatus('error', msg, loc);
    }
  }

  function jumpToError() {
    if (!lastError) return;
    input.focus();

    if (lastError.position !== null && !isNaN(lastError.position)) {
      const pos = Math.min(lastError.position, input.value.length);
      input.setSelectionRange(pos, Math.min(pos + 1, input.value.length));
    } else if (lastError.line !== null) {
      const lines = input.value.split('\n');
      let offset = 0;
      for (let i = 0; i < lastError.line - 1 && i < lines.length; i++) {
        offset += lines[i].length + 1;
      }
      if (lastError.column) {
        offset += lastError.column - 1;
      }
      input.setSelectionRange(offset, Math.min(offset + 1, input.value.length));
    }
  }

  // Event Listeners
  formatBtn.addEventListener('click', () => render(false));
  minifyBtn.addEventListener('click', () => render(true));
  autoFixBtn.addEventListener('click', autoFix);
  if (errorAutoFixBtn) errorAutoFixBtn.addEventListener('click', autoFix);
  if (jumpErrorBtn) jumpErrorBtn.addEventListener('click', jumpToError);

  input.addEventListener('input', () => {
    updateInputStats();
    if (!input.value.trim()) {
      output.value = '';
      copyBtn.disabled = true;
      downloadBtn.disabled = true;
      updateOutputStats();
      setStatus('idle', 'Paste or drop JSON above to begin.');
      return;
    }
    parse(false);
  });

  indentSelect.addEventListener('change', () => {
    if (output.value && currentParsed) {
      render(false);
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    currentParsed = null;
    lastError = null;
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
    updateInputStats();
    updateOutputStats();
    setStatus('idle', 'All cleared. Ready for your JSON.');
    input.focus();
  });

  sampleBtn.addEventListener('click', () => {
    const sampleData = {
      product: "JSON Formatter & Validator",
      by: "Redsite",
      version: "2.0.0",
      description: "Format, validate, repair, and minify JSON online. 100% private in-browser.",
      features: [
        "Instant formatting & pretty printing",
        "Deep syntax validation & line-number diagnostics",
        "Smart auto-repair for trailing commas & single quotes",
        "Payload minifier for bandwidth optimization",
        "Local execution — zero server uploads"
      ],
      settings: {
        theme: "raven",
        indent: 2,
        clientSideOnly: true
      },
      stats: {
        stars: 5,
        price: 0,
        currency: "USD"
      }
    };

    input.value = JSON.stringify(sampleData, null, 2);
    render(false);
  });

  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        setStatus('idle', 'Clipboard is empty.');
        return;
      }
      input.value = text;
      render(false);
    } catch {
      input.focus();
      setStatus('idle', 'Please paste directly into the input box (Cmd+V or Ctrl+V).');
    }
  });

  copyBtn.addEventListener('click', async () => {
    if (!output.value) return;
    try {
      await navigator.clipboard.writeText(output.value);
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>Copied! ✓</span>';
      copyBtn.classList.add('copied');
      setStatus('valid', '✓ Formatted JSON copied to clipboard!');
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch {
      output.focus();
      output.select();
      setStatus('idle', 'Press Cmd+C or Ctrl+C to copy selected output.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!output.value) return;
    const isMinified = !output.value.includes('\n');
    const filename = isMinified ? 'minified.json' : 'formatted.json';
    const blob = new Blob([output.value], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus('valid', `✓ Downloaded ${filename}`);
  });

  // File Upload & Drag-and-drop
  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    readFile(file);
    fileInput.value = '';
  });

  function readFile(file) {
    if (file.size > 20 * 1024 * 1024) {
      setStatus('error', 'File is larger than 20MB. Please use a smaller JSON file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      input.value = e.target.result;
      render(false);
    };
    reader.onerror = () => {
      setStatus('error', 'Failed to read file from disk.');
    };
    reader.readAsText(file);
  }

  // Drag and Drop
  const dropTarget = workbench;
  ['dragenter', 'dragover'].forEach(name => {
    dropTarget.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZoneOverlay.classList.add('active');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropTarget.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZoneOverlay.classList.remove('active');
    });
  });

  dropTarget.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const file = dt.files && dt.files[0];
    if (file) {
      readFile(file);
    } else {
      const text = dt.getData('text');
      if (text) {
        input.value = text;
        render(false);
      }
    }
  });

  // View Mode Toggle (Split vs Stacked)
  let isSplitView = window.innerWidth >= 960;
  function updateViewLayout() {
    if (isSplitView) {
      workbench.classList.add('split-view');
      workbench.classList.remove('stacked-view');
      viewToggleBtn.innerHTML = '<span class="icon">⫾</span> Stacked View';
    } else {
      workbench.classList.remove('split-view');
      workbench.classList.add('stacked-view');
      viewToggleBtn.innerHTML = '<span class="icon">◫</span> Split View';
    }
  }
  updateViewLayout();

  viewToggleBtn.addEventListener('click', () => {
    isSplitView = !isSplitView;
    updateViewLayout();
  });

  // Wrap toggle
  let isWrapped = true;
  wrapToggleBtn.addEventListener('click', () => {
    isWrapped = !isWrapped;
    output.style.whiteSpace = isWrapped ? 'pre-wrap' : 'pre';
    wrapToggleBtn.classList.toggle('active', isWrapped);
    wrapToggleBtn.textContent = isWrapped ? 'Wrap: On' : 'Wrap: Off';
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

    // Cmd/Ctrl + Enter -> Format
    if (cmdOrCtrl && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      render(false);
    }
    // Cmd/Ctrl + Shift + M -> Minify
    else if (cmdOrCtrl && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
      e.preventDefault();
      render(true);
    }
    // Cmd/Ctrl + Shift + C -> Copy
    else if (cmdOrCtrl && e.shiftKey && (e.key === 'C' || e.key === 'c') && !output.disabled) {
      e.preventDefault();
      copyBtn.click();
    }
  });

  // Initialize
  updateInputStats();
  updateOutputStats();
})();
