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
}
