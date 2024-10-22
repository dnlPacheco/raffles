const form = document.querySelector("#form");
const participants = document.querySelector("#participants");
const quantity = document.querySelector("#quantity");
const title = document.querySelector("#title");
const rafflesOutput = document.querySelector("#raffles-output");


form.addEventListener("submit", (event) => {
  event.preventDefault();

  //   valida nome vazio
  if (title.value === "") {
    alert("Por favor, insira um nome para o jogo.");
    return;
  }
  //   valida participantes vazio
  if (participants.value === "") {
    alert("Por favor, insira os participantes do jogo.");
    return;
  }

  // Algoritmo de Fisher-Yates
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const players = participants.value
    .split("\n")
    .map((player) => player.trim())
    .filter((player) => player !== "");

  console.log("players", players);

  const numberOfTeams = quantity.value;

  const randomPlayers = shuffle(players);
  console.log("randomPlayers: ", randomPlayers);

  // Criando o array de times
  const teams = [];
  for (let i = 0; i < numberOfTeams; i++) {
    teams.push({ name: `Team ${i + 1}`, players: [] });
  }

  console.log("numberOfTeams", numberOfTeams);
  for (let index = 0; index < randomPlayers.length; index++) {
    let teamIndex = index % numberOfTeams;
    teams[teamIndex]?.players.push(randomPlayers[index]);
  }

  console.log("Times sorteados: ", teams);

  displayRafflesOutput(teams)
  
});


function displayRafflesOutput(teams) {
  
  rafflesOutput.innerHTML = ''

  teams.forEach((team) => {
    const teamDiv = document.createElement("div")
    teamDiv.classList.add('team')

    const teamName = document.createElement("h3")
    teamName.textContent = team.name;
    teamDiv.appendChild(teamName)

    const teamPlayers = document.createElement("ul");

    team?.players.forEach((player) => {
      const playerItem = document.createElement("li")
      playerItem.textContent = player;
      teamPlayers.appendChild(playerItem)
    })

    teamDiv.appendChild(teamPlayers)

    rafflesOutput.appendChild(teamDiv)
  })
}

// TODO: Validar quando o número de participantes for menor que a quantidade de equipes

/*
Daniel
Pedro
Gabriel
Afonso
Luisa
Gabriela
Mariana
Guilherme
*/