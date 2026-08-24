const events = [
  { title: "Oficina de Design Thinking", cat: "acadêmico", time: "18:30", place: "Sala Inovação", points: 40 },
  { title: "Campeonato de Games", cat: "convivência", time: "19:00", place: "Arena de Integração", points: 30 },
  { title: "Desafio Intercursos", cat: "esporte", time: "20:10", place: "Quadra", points: 50 },
  { title: "Pitch de Startups", cat: "acadêmico", time: "19:20", place: "Auditório", points: 45 },
  { title: "Quiz entre Cursos", cat: "convivência", time: "20:40", place: "Praça de Convivência", points: 35 },
  { title: "Mesa de Carreiras", cat: "acadêmico", time: "18:50", place: "Bloco B", points: 40 }
];

const rewards = [
  { name: "Cupom Café", desc: "1 café + pão de queijo", cost: 100 },
  { name: "Desconto na Lanchonete", desc: "R$ 15 de desconto", cost: 150 },
  { name: "Ingresso para evento acadêmico", desc: "Entrada gratuita", cost: 220 },
  { name: "Brinde exclusivo Campus Viva", desc: "Kit universitário", cost: 280 }
];

const ranking = [
  ["Marina Costa","Engenharia",540],
  ["Lucas Freire","Administração",490],
  ["Victor Camolesi","Sistemas",455],
  ["Kevin Alves Nacata","Sistemas",430],
  ["Arthur Duarte","Sistemas",405],
  ["Davi Zacarone","Sistemas",390],
  ["Ana Martins","Sistemas",320]
];

const courseRanking = [
  ["Sistemas de Informação",842],
  ["Administração",760],
  ["Direito",690],
  ["Psicologia",640],
  ["Engenharia",610]
];

const titleMap = {
  inicio: "Visão geral",
  eventos: "Agenda de atividades",
  recompensas: "Recompensas",
  ranking: "Ranking",
  coordenacao: "Painel da coordenação",
  cadastro: "Nova atividade"
};

let points = 320;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function showPanel(name) {
  $$(".panel").forEach(panel => panel.classList.toggle("active", panel.id === `panel-${name}`));
  $$(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.panel === name));
  $("#pageTitle").textContent = titleMap[name] || "Campus Viva";
  $("#sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eventCard(event) {
  return `
    <article class="card event">
      <span class="tag">${event.cat}</span>
      <h3>${event.title}</h3>
      <p class="muted">${event.time} • ${event.place}</p>
      <footer>
        <span><b>+${event.points}</b> pontos</span>
        <button class="btn join-btn" data-title="${event.title.replaceAll('"', '&quot;')}">Participar</button>
      </footer>
    </article>
  `;
}

function bindJoinButtons() {
  $$(".join-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.textContent = "Inscrito ✓";
      btn.disabled = true;
      showToast(`Inscrição confirmada: ${btn.dataset.title}`);
    }, { once: true });
  });
}

function renderEvents(filter = "todos") {
  const filtered = filter === "todos" ? events : events.filter(e => e.cat === filter);
  $("#eventList").innerHTML = filtered.map(eventCard).join("");
  $("#homeEvents").innerHTML = events.slice(0, 3).map(eventCard).join("");
  bindJoinButtons();
}

function renderRewards() {
  $("#rewardList").innerHTML = rewards.map((r, i) => `
    <div class="reward-row">
      <div>
        <b>${r.name}</b>
        <small>${r.desc}</small>
      </div>
      <button class="btn reward-btn" data-i="${i}">${r.cost} pts</button>
    </div>
  `).join("");

  $$(".reward-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const reward = rewards[Number(btn.dataset.i)];
      if (points < reward.cost) return showToast("Você ainda não possui pontos suficientes.");
      points -= reward.cost;
      updatePoints();
      showToast(`${reward.name} resgatado com sucesso!`);
    });
  });
}

function renderRanking() {
  $("#rankingBody").innerHTML = ranking.map((row, i) => `
    <tr><td>${i + 1}</td><td>${row[0]}</td><td>${row[1]}</td><td><b>${row[2]}</b></td></tr>
  `).join("");

  $("#courseRanking").innerHTML = courseRanking.map((row, i) => `
    <div class="course-row">
      <div class="course-head"><b>${i + 1}. ${row[0]}</b><span>${row[1]} pts</span></div>
      <div class="progress"><span style="width:${100 - i * 12}%"></span></div>
    </div>
  `).join("");
}

function updatePoints() {
  $("#points").textContent = points;
  $("#heroPoints").textContent = points;
}

$$(".nav-btn").forEach(btn => btn.addEventListener("click", () => showPanel(btn.dataset.panel)));
$$("[data-go]").forEach(btn => btn.addEventListener("click", () => showPanel(btn.dataset.go)));

$("#eventFilter").addEventListener("change", e => renderEvents(e.target.value));
$("#roleBtn").addEventListener("click", () => showPanel("coordenacao"));
$("#menuBtn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

const modal = $("#checkinModal");
$("#checkinBtn").addEventListener("click", () => {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
});
$("#closeModal").addEventListener("click", () => {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
});
modal.addEventListener("click", e => {
  if (e.target === modal) $("#closeModal").click();
});
$("#confirmCheckin").addEventListener("click", () => {
  points += 30;
  updatePoints();
  $("#closeModal").click();
  showToast("Check-in confirmado! +30 pontos");
});

$("#activityForm").addEventListener("submit", e => {
  e.preventDefault();
  const title = $("#activityTitle").value.trim();
  if (!title) return showToast("Informe o nome da atividade.");

  const cat = $("#activityCategory").value.toLowerCase();
  const time = $("#activityTime").value || "19:00";
  const value = Math.max(10, Math.min(500, Number($("#activityPoints").value) || 10));

  events.unshift({ title, cat, time, place: "Local a definir", points: value });
  renderEvents($("#eventFilter").value);
  e.target.reset();
  $("#activityTime").value = "19:00";
  $("#activityPoints").value = "40";
  showToast("Atividade adicionada ao protótipo.");
  showPanel("eventos");
});

renderEvents();
renderRewards();
renderRanking();
updatePoints();
