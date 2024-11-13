import { invoke } from "@tauri-apps/api/core";
import { register } from '@tauri-apps/plugin-global-shortcut';

register('CmdOrCtrl+Shift+F', (e) => {
  if (e.state === 'Pressed') switchTeams();
});
register('Ctrl+Shift+1', (e) => {
  console.log("Ctrl+Shift+1 pressed", e);
  if (e.state === 'Pressed') updateNumber("score_team1", true);
});
register('Ctrl+Alt+1', (e) => {
  if (e.state === 'Pressed') updateNumber("score_team1", false);
});
register('Ctrl+Shift+2', (e) => {
  if (e.state === 'Pressed') updateNumber("score_team2", true);
});
register('Ctrl+Alt+2', (e) => {
  if (e.state === 'Pressed') updateNumber("score_team2", false);
});


let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
  }
}

async function submitResults() {
  const team1 = document.getElementById("name_team1") as HTMLInputElement;
  const team2 = document.getElementById("name_team2") as HTMLInputElement;
  const score1 = document.getElementById("score_team1") as HTMLElement;
  const score2 = document.getElementById("score_team2") as HTMLElement;
  const bestof = document.getElementById("bestof") as HTMLElement;

  if (team1 && team2 && score1 && score2 && bestof) {
    const result: { [key: string]: string } = {
      team1: team1.value,
      team2: team2.value,
      score1: score1.innerText,
      score2: score2.innerText,
      bestof: bestof.innerText,
    };

    try {
      await invoke("submit", { result });
      console.log("Results submitted:", result);
    } catch (error) {
      console.error("Failed to submit results:", error);
    }
  }
}


async function toggleAlwaysOnTop(alwaysOnTop:boolean) {
  try {
      await invoke('set_always_on_top', { alwaysOnTop });
      console.log(`Always on top set to ${alwaysOnTop}`);
  } catch (error) {
      console.error('Failed to set always on top:', error);
  }
}


function updateNumber(elementId: string, increase: boolean) {
  let scoreElement = document.getElementById(elementId) as HTMLElement;
  if (!scoreElement) return;
  let score = parseInt(scoreElement.innerText, 10);
  if (increase)
    scoreElement.innerText = (score + 1).toString(); 
  else
    if (score > 0 && elementId !== "bestof" || score > 1) scoreElement.innerText = (score - 1).toString();
  
  submitResults();
}


function switchTeams() {
  let team1 = document.getElementById("name_team1") as HTMLInputElement;
  let team2 = document.getElementById("name_team2") as HTMLInputElement;
  let score1 = document.getElementById("score_team1") as HTMLElement;
  let score2 = document.getElementById("score_team2") as HTMLElement;

  if (team1 && team2 && score1 && score2) {
    [team1.value, team2.value] = [team2.value, team1.value];
    [score1.textContent, score2.textContent] = [score2.textContent, score1.textContent];
  }

  submitResults();
}


function resetBoard() {
  const nameTeam1 = document.getElementById("name_team1") as HTMLInputElement;
  const nameTeam2 = document.getElementById("name_team2") as HTMLInputElement;
  const scoreTeam1 = document.getElementById("score_team1") as HTMLElement;
  const scoreTeam2 = document.getElementById("score_team2") as HTMLElement;
  const bestof = document.getElementById("bestof") as HTMLElement;

  nameTeam1.value = "Team 1";
  nameTeam2.value = "Team 2";
  if (scoreTeam1 && scoreTeam2) scoreTeam1.innerText = scoreTeam2.innerText = "0";
  if (bestof) bestof.innerText = "1";

  submitResults();
}


function resetEvent(isResetButton: boolean, isYesPressed: boolean) {
  const resetButtons = document.getElementById("reset-buttons");
  const reset = document.getElementById("reset");
  if (resetButtons && reset) {
    if (isResetButton) {
      resetButtons.style.display = "block";
      reset.style.display = "none";
    } else {
      resetButtons.style.display = "none";
      reset.style.display = "block";
      if (isYesPressed) resetBoard();
    }
  }
}


window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });

  // Team 1
  document.getElementById("increase_team1")?.addEventListener("click", () => updateNumber("score_team1", true));
  document.getElementById("decrease_team1")?.addEventListener("click", () => updateNumber("score_team1", false));
  // Team 2
  document.getElementById("increase_team2")?.addEventListener("click", () => updateNumber("score_team2", true));
  document.getElementById("decrease_team2")?.addEventListener("click", () => updateNumber("score_team2", false));
  // Bestof
  document.getElementById("increase_bestof")?.addEventListener("click", () => updateNumber("bestof", true));
  document.getElementById("decrease_bestof")?.addEventListener("click", () => updateNumber("bestof", false));

  // switch teams
  document.getElementById("switch-teams")?.addEventListener("click", () => switchTeams());
  // Submit results
  document.getElementById("submit-results")?.addEventListener("click", () => submitResults());
  // Reset board
  document.getElementById("reset")?.addEventListener("click", () => resetEvent(true, false));
  document.getElementById("reset-yes")?.addEventListener("click", () => resetEvent(false, true));
  document.getElementById("reset-no")?.addEventListener("click", () => resetEvent(false, false));

  // Menu buttons
  const mainContent = document.getElementById("content");
  const settingsMenu = document.getElementById("settings-menu");
  const helpMenu = document.getElementById("help-menu");
  const settingsButton = document.getElementById("settings-button");
  const helpButton = document.getElementById("help-button");

  // Fonction to display one menu and hide the others
  function showOnly(elementToShow: HTMLElement | null) {
    mainContent?.classList.add('hidden');
    settingsMenu?.classList.add('hidden');
    helpMenu?.classList.add('hidden');

    elementToShow?.classList.remove('hidden');
  }

  settingsButton?.addEventListener('click', () => {
      if (settingsMenu?.classList.contains('hidden')) {
        showOnly(settingsMenu);
      } else {
        showOnly(mainContent);
      }
  });

  helpButton?.addEventListener('click', () => {
      if (helpMenu?.classList.contains('hidden')) {
        showOnly(helpMenu);
      } else {
        showOnly(mainContent);
      }
  });
});

// Initialisation des variables
const output = document.getElementById('output')!;
const pressedKeys: Set<string> = new Set();

// Mapping des touches spéciales pour suivre la convention Tauri
const keyMap: { [key: string]: string } = {
  Control: "Ctrl",
  Alt: "Alt",
  Shift: "Shift",
  Meta: "Command" // Pour macOS, équivalent à la touche Windows sur PC
};

// Fonction pour normaliser le nom des touches en suivant la convention Tauri
function formatKey(key: string): string {
  return keyMap[key] || key; // Utiliser le mapping ou retourner la touche brute
}

// Fonction pour générer le raccourci formaté
function getFormattedShortcut(): string {
  // Trier les touches pour un affichage cohérent
  return Array.from(pressedKeys)
      .map(formatKey)
      .sort() // Tri pour assurer un ordre cohérent
      .join("+");
}

// Fonction pour mettre à jour l'affichage
function updateOutput() {
  const shortcut = getFormattedShortcut();
  output.textContent = shortcut ? `Touches appuyées : ${shortcut}` : "Touches appuyées : ";
}

// Écouteur pour les touches enfoncées
window.addEventListener('keydown', (event) => {
  if (!event.repeat) { // Ignorer les événements répétés
      pressedKeys.add(event.key);
      updateOutput();
  }
});

// Écouteur pour les touches relâchées
window.addEventListener('keyup', (event) => {
  pressedKeys.delete(event.key); // Supprime la touche relâchée
  updateOutput();
});

// const settingsButton = document.getElementById("settings-button");
// if (settingsButton) {
//   settingsButton.addEventListener("click", (e) => {
//     e.preventDefault();
//     toggleAlwaysOnTop(true);
//     console.log("Settings button clicked");
//   });
// }

// const helpButton = document.getElementById("help-button");
// if (helpButton) {
//   helpButton.addEventListener("click", (e) => {
//     e.preventDefault();
//     toggleAlwaysOnTop(false);
//     console.log("Help button clicked");
//   });
// }

