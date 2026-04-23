const form = document.querySelector("#form");
const participants = document.querySelector("#participants");
const quantity = document.querySelector("#quantity");
const title = document.querySelector("#title");
const rafflesOutput = document.querySelector("#raffles-output");

const errorParticipants = document.querySelector("#error-participants");
const errorQuantity = document.querySelector("#error-quantity");
const errorTitle = document.querySelector("#error-title");

function setFieldError(span, input, message) {
  span.textContent = message;
  input.classList.add("input-error");
}

function clearFieldError(span, input) {
  span.textContent = "";
  input.classList.remove("input-error");
}

function clearAllErrors() {
  clearFieldError(errorParticipants, participants);
  clearFieldError(errorQuantity, quantity);
  clearFieldError(errorTitle, title);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearAllErrors();

  let hasError = false;

  if (title.value.trim() === "") {
    setFieldError(errorTitle, title, "Por favor, insira um nome para o jogo.");
    hasError = true;
  }

  if (participants.value.trim() === "") {
    setFieldError(errorParticipants, participants, "Por favor, insira os participantes do jogo.");
    hasError = true;
  }

  if (quantity.value === "") {
    setFieldError(errorQuantity, quantity, "Por favor, selecione o número de equipes.");
    hasError = true;
  }

  if (hasError) return;

  const players = participants.value
    .split("\n")
    .map((player) => player.trim())
    .filter((player) => player !== "");

  const numberOfTeams = parseInt(quantity.value, 10);

  if (players.length < numberOfTeams) {
    setFieldError(
      errorParticipants,
      participants,
      `Participantes insuficientes: ${players.length} participante(s) para ${numberOfTeams} equipes.`
    );
    return;
  }

  const randomPlayers = shuffle(players);

  const teams = [];
  for (let i = 0; i < numberOfTeams; i++) {
    teams.push({ name: `Time ${i + 1}`, players: [] });
  }

  for (let index = 0; index < randomPlayers.length; index++) {
    teams[index % numberOfTeams].players.push(randomPlayers[index]);
  }

  displayRafflesOutput(title.value.trim(), teams);
  rafflesOutput.scrollIntoView({ behavior: "smooth" });
});

form.addEventListener("reset", () => {
  rafflesOutput.innerHTML = "";
  clearAllErrors();
});

function buildWhatsAppMessage(gameTitle, teams) {
  let message = `🎲 *${gameTitle}*\n`;
  teams.forEach((team) => {
    message += `\n*${team.name}*\n`;
    team.players.forEach((player) => {
      message += `• ${player}\n`;
    });
  });
  return message.trim();
}

function displayRafflesOutput(gameTitle, teams) {
  rafflesOutput.innerHTML = "";

  const titleEl = document.createElement("h2");
  titleEl.classList.add("output-title");
  titleEl.textContent = gameTitle;
  rafflesOutput.appendChild(titleEl);

  const teamsGrid = document.createElement("div");
  teamsGrid.classList.add("teams-grid");

  teams.forEach((team) => {
    const teamDiv = document.createElement("div");
    teamDiv.classList.add("team");

    const teamHeader = document.createElement("div");
    teamHeader.classList.add("team-header");

    const teamName = document.createElement("h3");
    teamName.classList.add("team-name");
    teamName.textContent = team.name;
    teamHeader.appendChild(teamName);

    const teamCount = document.createElement("span");
    teamCount.classList.add("team-count");
    teamCount.textContent = `${team.players.length} jogador(es)`;
    teamHeader.appendChild(teamCount);

    teamDiv.appendChild(teamHeader);

    const teamPlayers = document.createElement("ul");
    teamPlayers.classList.add("team-players");

    team.players.forEach((player) => {
      const playerItem = document.createElement("li");
      playerItem.textContent = player;
      teamPlayers.appendChild(playerItem);
    });

    teamDiv.appendChild(teamPlayers);
    teamsGrid.appendChild(teamDiv);
  });

  rafflesOutput.appendChild(teamsGrid);

  const whatsappLink = document.createElement("a");
  whatsappLink.classList.add("whatsapp-btn");
  whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage(gameTitle, teams))}`;
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  whatsappLink.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    Compartilhar no WhatsApp
  `;
  rafflesOutput.appendChild(whatsappLink);
}
