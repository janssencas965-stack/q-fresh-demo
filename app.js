(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const slug = (s) => encodeURIComponent(s);

  /* ---------------- openingsuren (Brussel) ---------------- */
  const DAGEN = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
  const UREN = { 1: [4, 13], 2: [9, 16], 3: [4, 13], 4: [9, 16], 5: [4, 13] };
  const pad = (n) => String(n).padStart(2, "0") + ":00";

  function nu() {
    const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Brussels", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const g = (t) => p.find(x => x.type === t).value;
    const dag = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday"));
    return { dag, uur: (+g("hour") % 24) + (+g("minute")) / 60 };
  }
  function status() {
    const { dag, uur } = nu();
    const t = UREN[dag];
    if (t && uur >= t[0] && uur < t[1]) return { open: true, kort: "Nu open", titel: "Nu open", sub: `Tot ${pad(t[1])} vandaag` };
    if (t && uur < t[0]) return { open: false, kort: `Opent om ${pad(t[0])}`, titel: "Nog gesloten", sub: `Vandaag open vanaf ${pad(t[0])}` };
    for (let i = 1; i <= 7; i++) {
      const d = (dag + i) % 7;
      if (UREN[d]) {
        const wanneer = i === 1 ? "morgen" : DAGEN[d].toLowerCase();
        return { open: false, kort: `Opent ${wanneer} ${pad(UREN[d][0])}`, titel: "Gesloten", sub: `Open ${wanneer} om ${pad(UREN[d][0])}` };
      }
    }
  }
  function renderHours(el) {
    const { dag } = nu();
    const rows = [1, 2, 3, 4, 5, 6, 0].map(d => {
      const t = UREN[d];
      return `<div class="${d === dag ? "today" : ""}"><dt>${DAGEN[d]}</dt><dd>${t ? pad(t[0]) + " – " + pad(t[1]) : "Gesloten"}</dd></div>`;
    });
    el.innerHTML = rows.join("");
  }
  function paintStatus() {
    const s = status();
    $("#openPill").innerHTML = `<span class="dot ${s.open ? "on" : ""}"></span>${s.kort}`;
    if ($("#hcDot")) $("#hcDot").className = "dot " + (s.open ? "on" : "");
    $("#hcStatus").textContent = s.titel + " · ";
    $("#hcSub").textContent = s.sub;
    renderHours($("#hoursHome")); renderHours($("#hoursContact"));
  }

  /* ---------------- gegevens ---------------- */
  const subsOf = (cat) => [...new Set(P.filter(p => p.cat === cat).map(p => p.sub))];
  const catOf = (id) => CATS.find(c => c.id === id);

  /* ---------------- mega menu ---------------- */
  function buildMega() {
    const link = (c, s) => `<li><a href="#/assortiment/${c}/${slug(s)}">${esc(s)}</a></li>`;
    $("#mega").innerHTML = `
      <div><h4>Fruit <a href="#/assortiment/fruit">Alles</a></h4><ul>${subsOf("fruit").map(s => link("fruit", s)).join("")}</ul></div>
      <div><h4>Groenten <a href="#/assortiment/groenten">Alles</a></h4><ul>${subsOf("groenten").map(s => link("groenten", s)).join("")}</ul></div>
      <div>
        <h4>Meer</h4>
        <ul>
          <li><a href="#/assortiment/noten">Noten en gedroogd fruit</a></li>
          <li><a href="#/assortiment/sappen">Vruchtensappen</a></li>
          <li><a href="#/assortiment/kruiden">Verse kruiden</a></li>
        </ul>
        <a class="promo" href="#/assortiment/sappen" style="margin-top:16px"><img src="img/krachtsap.jpg" alt=""><span>Nieuw in de kijker</span><b>Schulp krachtsappen</b></a>
      </div>`;
  }
  const wrapMega = $("#megaWrap"), megaBtn = $("#megaBtn");
  let megaT;
  const mobiel = () => matchMedia("(max-width:860px)").matches;
  const openMega = (v) => { wrapMega.classList.toggle("open", v); megaBtn.setAttribute("aria-expanded", v); };
  wrapMega.addEventListener("mouseenter", () => { if (!mobiel()) { clearTimeout(megaT); openMega(true); } });
  wrapMega.addEventListener("mouseleave", () => { if (!mobiel()) megaT = setTimeout(() => openMega(false), 120); });
  wrapMega.addEventListener("focusin", () => { if (!mobiel()) openMega(true); });
  wrapMega.addEventListener("focusout", (e) => { if (!wrapMega.contains(e.relatedTarget)) openMega(false); });
  megaBtn.addEventListener("click", (e) => { if (mobiel()) { e.preventDefault(); openMega(!wrapMega.classList.contains("open")); } else openMega(false); });
  $("#mega").addEventListener("click", () => { openMega(false); closeNav(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { openMega(false); closeDrawer(); } });

  const burger = $("#burger"), nav = $("#nav");
  function closeNav() { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  nav.addEventListener("click", (e) => { if (e.target.closest("a") && !e.target.closest("#megaBtn")) closeNav(); });
  addEventListener("scroll", () => $("#top").classList.toggle("scrolled", scrollY > 8), { passive: true });

  /* ---------------- home ---------------- */
  function buildHome() {
    const arrow = `<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4 10h12m-5-5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const nfo = {
      fruit: `${subsOf("fruit").length} soorten, van appel tot exoten`,
      groenten: `${subsOf("groenten").length} groepen`,
      noten: "Superfoods en snacks",
      sappen: "Schulp, sinds 1861",
      kruiden: `${P.filter(p => p.cat === "kruiden").length} kruiden en gesneden groenten`
    };
    $("#bento").innerHTML = CATS.map(c => `
      <a class="tile t-${c.id}" href="#/assortiment/${c.id}">
        <img src="img/${c.foto}" alt="" loading="lazy">
        <span class="go">${arrow}</span>
        <h3>${esc(c.naam)}</h3><p>${esc(nfo[c.id])}</p>
      </a>`).join("");

    const V = [
      ["Kwaliteit", "Wij gaan op zoek naar de meest kwalitatieve producten.", "Wanneer producten binnenkomen, controleren we telkens de kwaliteit ervan.", "Tomaat-cherry-tros-rood.jpg", "M5 12l4 4 10-10"],
      ["Versheid", "Een goede rotatie is de sleutel tot versheid.", "Door goede rotatie kunnen we dagverse producten aanbieden.", "Eikenblad-groen-2.jpg", "M12 3c5 1 8 5 7 10-5 0-9-2-10-7 1-2 2-3 3-3zM5 20c2-5 5-8 9-10"],
      ["Service", "Persoonlijkheid, vriendelijkheid en snelheid maken het verschil.", "We streven naar een goede service met een snelle en persoonlijke aanpak.", "Royal-Gala.jpg", "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.500-7 10-7 10z"],
      ["Flexibiliteit", "Wij staan steeds paraat voor onze klanten.", "We passen ons aan de wensen van de klant aan, qua structuur, medewerkers en productaanbod.", "Zoete-aardapel-1.jpg", "M13 3L5 14h6l-1 7 8-11h-6z"]
    ];
    $("#vTabs").innerHTML = `<h2>Waar we voor staan</h2>` + V.map((v, i) =>
      `<button class="v-tab" role="tab" id="vt${i}" aria-selected="${i === 0}" aria-controls="vPanel" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">${v[0]}</button>`).join("");
    const show = (i) => {
      const v = V[i];
      $("#vPanel").setAttribute("aria-labelledby", "vt" + i);
      $("#vPanel").innerHTML = `<img src="img/${v[3]}" alt=""><div class="vp-text"><h3>${v[1]}</h3><p>${v[2]}</p></div>`;
      $$(".v-tab").forEach((b, j) => { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; });
    };
    $("#vTabs").addEventListener("click", (e) => { const b = e.target.closest(".v-tab"); if (b) show(+b.dataset.i); });
    $("#vTabs").addEventListener("keydown", (e) => {
      if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
      e.preventDefault();
      const cur = $$(".v-tab").findIndex(b => b.getAttribute("aria-selected") === "true");
      const n = (cur + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : V.length - 1)) % V.length;
      show(n); $("#vt" + n).focus();
    });
    show(0);

    $("#valuesCards").innerHTML = V.map(v => `
      <div class="v-card"><span class="ic"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="${v[4]}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <h3>${v[0]}</h3><p>${v[1]} ${v[2]}</p></div>`).join("");

    $("#team").innerHTML = TEAM.map(t => `
      <div class="t-card"><h3>${esc(t.groep)}</h3><p>${esc(t.tekst)}</p>
      ${t.wie[0] === t.groep ? "" : `<div class="people">${t.wie.map(w => `<span class="person"><i>${w[0]}</i>${esc(w)}</span>`).join("")}</div>`}</div>`).join("");
  }

  /* ---------------- aanvraaglijst ---------------- */
  let lijst = {};
  try { lijst = JSON.parse(localStorage.getItem("qf-lijst") || "{}"); } catch (e) { lijst = {}; }
  const bewaar = () => { try { localStorage.setItem("qf-lijst", JSON.stringify(lijst)); } catch (e) { } };
  const byId = (id) => P[id];
  const aantal = () => Object.keys(lijst).length;
  function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 2200); }
  function paintCount() {
    $("#listCount").textContent = aantal();
    $$(".item[data-id]").forEach(b => { const on = !!lijst[b.dataset.id]; b.classList.toggle("in", on); b.setAttribute("aria-pressed", on); $(".plus", b).textContent = on ? "✓" : "+"; });
  }
  function toggle(id) {
    if (lijst[id]) { delete lijst[id]; toast(`${byId(id).n} verwijderd`); }
    else { lijst[id] = 1; toast(`${byId(id).n} toegevoegd aan uw aanvraaglijst`); $("#listBtn").classList.remove("bump"); void $("#listBtn").offsetWidth; $("#listBtn").classList.add("bump"); }
    bewaar(); paintCount(); if (drawerOpen) paintDrawer();
  }
  function lijstTekst() {
    return Object.keys(lijst).map(id => `- ${lijst[id]} x ${byId(id).n} (${byId(id).sub})`).join("\n");
  }
  function paintDrawer() {
    const ids = Object.keys(lijst);
    $("#dBody").innerHTML = ids.length ? ids.map(id => {
      const p = byId(id);
      return `<div class="line-i">${p.img ? `<img src="img/${p.img}" alt="">` : `<span class="ph0"></span>`}
        <div><b>${esc(p.n)}</b><small>${esc(p.sub)}</small></div>
        <div class="qty"><button data-d="-1" data-id="${id}" aria-label="Minder ${esc(p.n)}">−</button><span>${lijst[id]}</span><button data-d="1" data-id="${id}" aria-label="Meer ${esc(p.n)}">+</button></div></div>`;
    }).join("") : `<div class="d-empty"><b>Nog niets in uw lijst.</b>Kies producten in het <a href="#/assortiment" style="color:var(--leaf);font-weight:600;text-decoration:underline">assortiment</a> en vraag in één keer een prijs.</div>`;
    $("#dSend").disabled = !ids.length; $("#dClear").disabled = !ids.length;
    $("#dSend").style.opacity = $("#dClear").style.opacity = ids.length ? 1 : .45;
  }
  $("#dBody").addEventListener("click", (e) => {
    if (e.target.closest("a")) { closeDrawer(); return; }
    const b = e.target.closest(".qty button"); if (!b) return;
    const id = b.dataset.id, n = lijst[id] + +b.dataset.d;
    if (n < 1) delete lijst[id]; else lijst[id] = n;
    bewaar(); paintDrawer(); paintCount();
  });
  $("#dClear").addEventListener("click", () => { lijst = {}; bewaar(); paintDrawer(); paintCount(); });
  $("#dSend").addEventListener("click", () => {
    const body = `Goedendag Q-Fresh,\n\nGraag een prijs voor:\n${lijstTekst()}\n\nMet vriendelijke groeten,\n`;
    location.href = `mailto:info@q-fresh.be?subject=${encodeURIComponent("Offerte-aanvraag via de website")}&body=${encodeURIComponent(body)}`;
  });
  let drawerOpen = false, lastFocus;
  function openDrawer() {
    drawerOpen = true; lastFocus = document.activeElement; paintDrawer();
    $("#scrim").hidden = false; $("#drawer").hidden = false;
    requestAnimationFrame(() => { $("#scrim").classList.add("show"); $("#drawer").classList.add("show"); $("#dClose").focus(); });
  }
  function closeDrawer() {
    if (!drawerOpen) return; drawerOpen = false;
    $("#scrim").classList.remove("show"); $("#drawer").classList.remove("show");
    setTimeout(() => { $("#scrim").hidden = true; $("#drawer").hidden = true; }, 300);
    if (lastFocus) lastFocus.focus();
  }
  $("#listBtn").addEventListener("click", openDrawer);
  $("#dClose").addEventListener("click", closeDrawer);
  $("#scrim").addEventListener("click", closeDrawer);
  $("#drawer").addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = $$("button:not([disabled]),a[href]", $("#drawer")); const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });

  /* ---------------- assortiment ---------------- */
  const S = { cat: "fruit", sub: "", q: "" };
  function buildCats() {
    $("#cats").innerHTML = CATS.map(c => `
      <button class="cat" data-c="${c.id}" aria-pressed="false"><img src="img/${c.foto}" alt="" loading="lazy">${esc(c.naam)}<small>${P.filter(p => p.cat === c.id).length}</small></button>`).join("");
  }
  function renderShop() {
    const zoek = S.q.trim().toLowerCase();
    $$(".cat").forEach(b => b.setAttribute("aria-pressed", !zoek && b.dataset.c === S.cat));
    const subs = zoek ? [] : subsOf(S.cat);
    $("#subs").hidden = subs.length < 2;
    $("#subs").innerHTML = subs.length < 2 ? "" :
      [["", "Alles"], ...subs.map(s => [s, s])].map(([v, l]) => `<button class="chip" data-s="${esc(v)}" aria-pressed="${S.sub === v}">${esc(l)}</button>`).join("");
    let list = zoek ? P.filter(p => (p.n + " " + p.sub + " " + catOf(p.cat).naam).toLowerCase().includes(zoek))
      : P.filter(p => p.cat === S.cat && (!S.sub || p.sub === S.sub));
    const c = catOf(S.cat);
    $("#count").textContent = zoek ? `${list.length} resultaten voor “${S.q.trim()}”` : `${list.length} ${list.length === 1 ? "product" : "producten"} in ${S.sub || c.naam}`;
    const banner = "";
    $("#grid").innerHTML = banner + list.map(p => {
      const kind = p.img ? "" : p.cat === "sappen" ? "txt sap-t " + (p.sub === "Schulp ambachtelijk" ? "apple" : "") : "txt";
      const inner = p.img
        ? `<div class="ph${p.img.startsWith("sap/") ? " bottle " + p.img[4] : ""}"><img src="img/${p.img}" alt="${esc(p.n)}" loading="lazy"></div><div class="tx"><b>${esc(p.n)}</b>${p.note ? `<small>${esc(p.note)}</small>` : `<small>${esc(p.sub)}</small>`}</div><span class="plus">+</span>`
        : `<div class="tx"><b>${esc(p.n)}</b>${p.note ? `<small>${esc(p.note)}</small>` : `<small>${esc(p.sub)}</small>`}</div><span class="plus">+</span>`;
      return `<button class="item ${kind}" data-id="${p.id}" aria-pressed="false" aria-label="${esc(p.n)}, toevoegen aan aanvraaglijst">${inner}</button>`;
    }).join("");
    $("#empty").hidden = list.length > 0;
    paintCount();
  }
  $("#cats").addEventListener("click", (e) => { const b = e.target.closest(".cat"); if (!b) return; $("#q").value = ""; S.q = ""; S.cat = b.dataset.c; S.sub = ""; history.replaceState(null, "", `#/assortiment/${S.cat}`); renderShop(); });
  $("#subs").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; S.sub = b.dataset.s; history.replaceState(null, "", `#/assortiment/${S.cat}${S.sub ? "/" + slug(S.sub) : ""}`); renderShop(); });
  $("#q").addEventListener("input", (e) => { S.q = e.target.value; renderShop(); });
  $("#grid").addEventListener("click", (e) => { const b = e.target.closest(".item"); if (b) toggle(+b.dataset.id); });

  /* ---------------- formulieren ---------------- */
  $("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target; let ok = true;
    ["naam", "mail", "msg"].forEach(n => { const el = f.elements[n]; const bad = !el.value.trim() || (n === "mail" && !/^\S+@\S+\.\S+$/.test(el.value)); el.classList.toggle("bad", bad); if (bad) ok = false; });
    if (!ok) { $("#formNote").textContent = "Vul naam, een geldig e-mailadres en uw bericht in."; $("#formNote").style.color = "#d93025"; return; }
    const v = (n) => f.elements[n].value.trim();
    const body = `${v("msg")}\n\n${Object.keys(lijst).length ? "Aanvraaglijst:\n" + lijstTekst() + "\n\n" : ""}${v("naam")}${v("bedrijf") ? ", " + v("bedrijf") : ""}\n${v("mail")}${v("tel") ? "\n" + v("tel") : ""}`;
    location.href = `mailto:info@q-fresh.be?subject=${encodeURIComponent("Bericht via de website van " + v("naam"))}&body=${encodeURIComponent(body)}`;
    $("#formNote").style.color = ""; $("#formNote").textContent = "Uw mailprogramma opent met het bericht. Verstuur het daar om af te ronden.";
  });
  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const m = e.target.querySelector("input").value;
    location.href = `mailto:info@q-fresh.be?subject=${encodeURIComponent("Inschrijving nieuwsbrief")}&body=${encodeURIComponent("Graag schrijf ik mij in voor de nieuwsbrief: " + m)}`;
    toast("Bedankt, uw mailprogramma opent om de inschrijving te bevestigen.");
  });

  /* ---------------- router ---------------- */
  const PAGES = ["home", "assortiment", "over-ons", "team", "contact"];
  const TITELS = { home: "Q-Fresh | Groothandel in groenten en fruit, Roeselare", assortiment: "Assortiment | Q-Fresh", "over-ons": "Over ons | Q-Fresh", team: "Ons team | Q-Fresh", contact: "Contact | Q-Fresh" };
  let huidig = "";
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent).filter(Boolean);
    let page = PAGES.includes(parts[0]) ? parts[0] : "home";
    if (page === "assortiment") {
      if (parts[1] && catOf(parts[1])) { S.cat = parts[1]; S.sub = subsOf(S.cat).includes(parts[2]) ? parts[2] : ""; S.q = ""; $("#q").value = ""; }
      renderShop();
    }
    if (page !== huidig) {
      $$(".page").forEach(s => { s.hidden = s.dataset.page !== page; });
      $$(".nav a[data-r]").forEach(a => a.classList.toggle("on", a.dataset.r === page));
      document.title = TITELS[page];
      scrollTo({ top: 0, behavior: "instant" });
      huidig = page;
    } else if (page === "assortiment") scrollTo({ top: 0, behavior: "smooth" });
    openMega(false);
  }
  addEventListener("hashchange", route);

  buildMega(); buildHome(); buildCats(); paintStatus(); paintCount();
  setInterval(paintStatus, 60000);
  route();
})();
