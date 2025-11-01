<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>DRAM Basics: Cells, Arrays, and Read/Write Flow (Beginner Guide)</title>
<meta name="description" content="A beginner-friendly guide to DRAM: storage cells, sense amplifiers, memory arrays, banks, and the read/write sequence with a simple arrow diagram." />
<style>
  :root{
    --bg: #0f1220;
    --card: #171a2b;
    --ink: #e8ebff;
    --muted: #b7bce8;
    --accent: #7aa2ff;
    --accent-2: #9ae6b4;
    --border: #2a2f4a;
    --callout: #1c2138;
    --chip: #24294a;
    --link: #9bb4ff;
  }
  html,body{background:var(--bg); color:var(--ink); margin:0; font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif; line-height:1.6}
  .wrap{max-width:980px; margin:auto; padding:28px 18px 80px}
  header{padding:24px 0 8px; border-bottom:1px solid var(--border); margin-bottom:18px}
  h1{font-size:2rem; margin:0 0 8px}
  .subtitle{color:var(--muted); margin:0 0 12px}
  a{color:var(--link); text-decoration:none}
  a:hover{text-decoration:underline}
  .toc{background:var(--card); border:1px solid var(--border); border-radius:12px; padding:16px; margin:20px 0}
  .toc strong{display:block; margin-bottom:8px; color:var(--accent)}
  .toc ul{margin:0; padding-left:18px}
  .card{background:var(--card); border:1px solid var(--border); border-radius:14px; padding:18px; margin:16px 0}
  h2, h3{scroll-margin-top:90px}
  h2{margin-top:28px}
  .def-list dt{font-weight:700; margin-top:10px}
  .def-list dd{margin:0 0 8px 0; color:var(--muted)}
  .note{background:var(--callout); border-left:3px solid var(--accent); padding:12px 14px; border-radius:10px; color:var(--muted)}
  .chips{display:flex; flex-wrap:wrap; gap:8px; margin:10px 0 0}
  .chip{background:var(--chip); border:1px solid var(--border); color:var(--ink); padding:6px 10px; border-radius:999px; font-size:.9rem}
  code, .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
  .grid{display:grid; gap:14px}
  @media(min-width:860px){ .grid.cols-2{grid-template-columns:1fr 1fr} }
  .small{font-size:.95rem; color:var(--muted)}
  .footer{margin-top:28px; border-top:1px solid var(--border); padding-top:18px; color:var(--muted)}
  /* Simple inline diagram styling */
  .diagram-wrap{background:var(--card); border:1px solid var(--border); border-radius:14px; padding:10px; overflow:auto}
  svg{max-width:100%; height:auto; display:block; margin:auto}
  .legend{font-size:.92rem; color:var(--muted); text-align:center; margin-top:8px}
  /* Table styling (for the example bank spec) */
  table{width:100%; border-collapse:collapse; background:var(--card); border:1px solid var(--border); border-radius:12px; overflow:hidden}
  th, td{padding:10px 12px; border-bottom:1px solid var(--border); text-align:left}
  th{color:var(--accent)}
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>DRAM Basics: Cells, Arrays, and Read/Write Flow</h1>
      <p class="subtitle">A gentle, beginner-friendly walkthrough of how DRAM stores and moves bits.</p>
    </header>

    <nav class="toc">
      <strong>Table of Contents</strong>
      <ul>
        <li><a href="#what-is-dram">1) What is DRAM?</a></li>
        <li><a href="#dram-cell">2) The DRAM Storage Cell (1T1C)</a></li>
        <li><a href="#sense-amp">3) Why We Need a Differential Sense Amplifier</a></li>
        <li><a href="#read-flow">4) Read Flow (with Arrow Diagram)</a></li>
        <li><a href="#write-flow">5) Write Flow (incl. Write-Recovery)</a></li>
        <li><a href="#arrays-banks">6) Arrays, Rows, Columns, and Banks</a></li>
        <li><a href="#reference">7) References & Attribution</a></li>
      </ul>
    </nav>

    <section id="what-is-dram" class="card">
      <h2>1) What is DRAM?</h2>
      <p>
        <span class="mono">DRAM</span> (Dynamic Random Access Memory) is the main working memory in most computers.
        It’s <em>dynamic</em> because each stored bit slowly leaks away and must be refreshed regularly.
        The big advantages are high density and low cost per bit.
      </p>
      <div class="chips">
        <div class="chip">High density</div>
        <div class="chip">Low cost</div>
        <div class="chip">Needs refresh</div>
        <div class="chip">Volatile</div>
      </div>
    </section>

    <section id="dram-cell" class="card">
      <h2>2) The DRAM Storage Cell (1T1C)</h2>
      <p>A single DRAM bit (cell) uses just two parts:</p>
      <dl class="def-list">
        <dt>Storage capacitor</dt>
        <dd>Holds a small electrical charge. “More charge” ≈ bit <strong>1</strong>, “less/no charge” ≈ bit <strong>0</strong>.</dd>
        <dt>Access transistor</dt>
        <dd>Acts like a switch controlled by the <em>wordline</em>. When on, the cell connects to the <em>bitline</em> to read or write.</dd>
      </dl>

      <div class="note">
        <strong>Bitline & Wordline (in one sentence):</strong>
        The <em>wordline</em> selects which cells open, and the <em>bitline</em> is the path that carries the tiny signal in/out.
      </div>

      <p class="small">
        ⚡️ With the cell’s “common” capacitor plate held near <span class="mono">V<sub>CC</sub>/2</span>, the stored charge is roughly
        <span class="mono">Q ≈ ± C × (V<sub>CC</sub>/2)</span> depending on whether the bit is 1 or 0.
        (Exact sign conventions vary by implementation; for beginners, just remember the sense amp detects a tiny voltage difference.)
      </p>
    </section>

    <section id="sense-amp" class="card">
      <h2>3) Why We Need a Differential Sense Amplifier</h2>
      <div class="grid cols-2">
        <div>
          <p><strong>Three practical challenges:</strong></p>
          <ul>
            <li><em>Tiny signals:</em> The cell’s charge is minuscule; voltage changes on the bitline are very small.</li>
            <li><em>Destructive reads:</em> Reading perturbs the cell’s charge, so we must restore it.</li>
            <li><em>Leakage:</em> Capacitors slowly lose charge even if untouched — periodic refresh is required.</li>
          </ul>
        </div>
        <div>
          <p><strong>The fix: a differential sense amplifier</strong> sits between paired bitlines and:</p>
          <ul>
            <li>Amplifies the tiny voltage difference to a clean logic 0/1.</li>
            <li>Writes the “decided” value back to the cell (restores it) after a read.</li>
            <li>Works best if both bitlines are precharged near <span class="mono">V<sub>CC</sub>/2</span>.</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="read-flow" class="card">
      <h2>4) Read Flow (with Arrow Diagram)</h2>
      <p>Reading a bit is a four-phase dance: <strong>Precharge → Access → Sense → Restore</strong>.</p>

      <div class="diagram-wrap" aria-label="Read/Write arrow diagram">
        <!-- Inline SVG arrow/flow diagram -->
        <svg viewBox="0 0 1200 260" role="img" aria-labelledby="diagram-title">
          <title id="diagram-title">DRAM Read/Write Flow</title>
          <!-- connectors -->
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L9,3 L0,6 Z" fill="currentColor"></path>
            </marker>
          </defs>

          <!-- Read chain -->
          <g transform="translate(20,30)" fill="none" stroke="currentColor">
            <!-- Boxes -->
            <rect x="0" y="0" width="240" height="70" rx="10" fill="#222745" stroke="#2a2f4a"></rect>
            <rect x="280" y="0" width="240" height="70" rx="10" fill="#222745" stroke="#2a2f4a"></rect>
            <rect x="560" y="0" width="240" height="70" rx="10" fill="#222745" stroke="#2a2f4a"></rect>
            <rect x="840" y="0" width="240" height="70" rx="10" fill="#222745" stroke="#2a2f4a"></rect>
            <!-- Labels -->
            <g fill="#e8ebff" font-family="Inter,ui-sans-serif" font-size="16">
              <text x="120" y="40" text-anchor="middle"><tspan font-weight="700">Precharge</tspan></text>
              <text x="120" y="60" text-anchor="middle">Bitlines → VCC/2</text>

              <text x="400" y="40" text-anchor="middle"><tspan font-weight="700">Access</tspan></text>
              <text x="400" y="60" text-anchor="middle">Open wordline</text>

              <text x="680" y="40" text-anchor="middle"><tspan font-weight="700">Sense</tspan></text>
              <text x="680" y="60" text-anchor="middle">Amplify tiny ΔV</text>

              <text x="960" y="40" text-anchor="middle"><tspan font-weight="700">Restore</tspan></text>
              <text x="960" y="60" text-anchor="middle">Write back to cell</text>
            </g>
            <!-- Arrows -->
            <line x1="240" y1="35" x2="280" y2="35" stroke="#9bb4ff" stroke-width="2.5" marker-end="url(#arrow)"></line>
            <line x1="520" y1="35" x2="560" y2="35" stroke="#9bb4ff" stroke-width="2.5" marker-end="url(#arrow)"></line>
            <line x1="800" y1="35" x2="840" y2="35" stroke="#9bb4ff" stroke-width="2.5" marker-end="url(#arrow)"></line>
          </g>

          <!-- Write recovery branch -->
          <g transform="translate(700,150)" fill="none" stroke="currentColor">
            <!-- Down arrow from Restore -->
            <line x1="180" y1="-60" x2="180" y2="0" stroke="#9ae6b4" stroke-width="2.5" marker-end="url(#arrow)"></line>
            <!-- Box -->
            <rect x="60" y="0" width="240" height="70" rx="10" fill="#20402e" stroke="#315942"></rect>
            <g fill="#d7ffe4" font-family="Inter,ui-sans-serif" font-size="16">
              <text x="180" y="35" text-anchor="middle"><tspan font-weight="700">Write-Recovery</tspan></text>
              <text x="180" y="55" text-anchor="middle">Drive BL/BL̄ to target</text>
            </g>
          </g>
        </svg>
        <div class="legend">Blue path = read; green box = extra step for writes</div>
      </div>

      <h3>Phase by phase (simple view)</h3>
      <ol>
        <li><strong>Precharge:</strong> Equalize both bitlines near <span class="mono">V<sub>CC</sub>/2</span>.</li>
        <li><strong>Access:</strong> Turn on the cell’s access transistor via the wordline; a tiny voltage bump (or dip) appears on one bitline.</li>
        <li><strong>Sense:</strong> The sense amplifier compares the paired lines and quickly drives them to clean 0/1 logic levels.</li>
        <li><strong>Restore:</strong> The decided value is written back to the capacitor so the bit isn’t lost by the read.</li>
      </ol>
    </section>

    <section id="write-flow" class="card">
      <h2>5) Write Flow (incl. Write-Recovery)</h2>
      <p>
        Writing also starts with <em>Precharge → Access</em>. The controller then <strong>drives the bitlines</strong> with the
        desired value, the sense amp latches it, and the cell is <strong>restored</strong> to the new state.
        Some designs describe an explicit <em>Write-Recovery</em> window where the bitlines are held long enough to fully charge/discharge the cell.
      </p>
      <div class="note">
        <strong>Tip:</strong> Because cells leak, DRAM periodically refreshes each row by performing a read-then-restore cycle automatically.
      </div>
    </section>

    <section id="arrays-banks" class="card">
      <h2>6) Arrays, Rows, Columns, and Banks</h2>

      <h3>6.1 Memory Array (m × n × w)</h3>
      <p>
        Cells are grouped on <em>wordlines</em> (rows) and <em>bitlines</em> (columns), with sense amps at the ends of bitlines.
        Adding more cells to a single bitline increases capacitance → slower edges → lower performance.
        So designers balance <em>how many cells per bitline</em> vs. <em>how many bitlines</em>.
      </p>
      <ul>
        <li><strong>Data width (w):</strong> how many bits are read/written at once (size of a column access).</li>
        <li><strong>Row:</strong> all cells sharing a wordline; <em>row size</em> = number of bits in that row.</li>
        <li><strong>Column:</strong> the smallest addressable chunk within an active row; count is <span class="mono">row size / data width</span>.</li>
      </ul>

      <h3>6.2 Banks</h3>
      <p>
        Arrays don’t scale forever—long wordlines and bitlines get slow. To increase capacity without big speed loss,
        DRAM chips contain multiple <strong>banks</strong> (independent arrays). Only one bank is “active” per access, but
        multiple banks let controllers overlap operations for throughput.
      </p>

      <div class="grid cols-2">
        <div class="card">
          <h3 style="margin-top:0">Example Bank Organization</h3>
          <table aria-label="Example DRAM organization">
            <tr><th>Banks</th><td>4</td></tr>
            <tr><th>Rows / Bank</th><td>16K</td></tr>
            <tr><th>Columns / Row</th><td>1024</td></tr>
            <tr><th>Column Size (Data Width)</th><td>16 bits</td></tr>
          </table>
        </div>
        <div class="card">
          <h3 style="margin-top:0">Glossary</h3>
          <dl class="def-list">
            <dt>Wordline (WL)</dt><dd>Selects which cells connect to bitlines.</dd>
            <dt>Bitline (BL/BL̄)</dt><dd>Differential pair carrying the tiny signal to the sense amp.</dd>
            <dt>Precharge</dt><dd>Equalize BL/BL̄ near <span class="mono">V<sub>CC</sub>/2</span> to prepare for sensing.</dd>
            <dt>Refresh</dt><dd>Periodic read/restore to compensate for leakage.</dd>
          </dl>
        </div>
      </div>
    </section>

    <section id="reference" class="card">
      <h2>7) References & Attribution</h2>
      <ul>
        <li><em>Memory Systems – Cache, DRAM, and Disk</em> (classic reference)</li>
        <li>“DRAM Principles / DRAM Memory Organization” – introductory materials commonly cited in educational blogs</li>
      </ul>
      <p class="small">
        This article adapts simplified explanations from a CC BY-SA 4.0 source originally published on CSDN (2019, updated 2023).
        <br />
        <strong>Attribution (edit me):</strong> “Adapted from <em>DRAM Principle</em> by <span class="mono">[Original Author or Account]</span>, 
        licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>.”
        If you know the original link, please insert it here for proper credit.
      </p>
    </section>

    <div class="footer small">
      © Your Blog — Feel free to reuse this page layout for other beginner hardware notes.
    </div>
  </div>
</body>
</html>
