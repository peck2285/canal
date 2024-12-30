let abonnés = JSON.parse(localStorage.getItem('abonnés')) || [];
let filtreActif = "all";
let indexEdition = null;

// Ajoute 30 jours à une date
function ajouterExactement30Jours(date) {
  const nouvelleDate = new Date(date);
  nouvelleDate.setDate(nouvelleDate.getDate() + 30);
  return nouvelleDate;
}

// Formate une date en JJ/MM/AAAA
function formaterDate(date) {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

// Met à jour le tableau
function mettreAJourTable() {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';
  const maintenant = new Date();

  abonnés.forEach((abonné, index) => {
    const dateActivation = new Date(abonné.dateActivation);
    const finActivation = ajouterExactement30Jours(dateActivation);
    const joursRestants = Math.floor((finActivation - maintenant) / (1000 * 60 * 60 * 24));
    let prevention = '';

    if (joursRestants === 3) prevention = 'J-3';
    else if (joursRestants === 2) prevention = 'J-2';
    else if (joursRestants === 1) prevention = 'J-1';
    else if (joursRestants === 0) prevention = 'JJ';
    else if (joursRestants < 0) prevention = 'Échu';

    if (filtreActif !== "all" && filtreActif !== prevention) return;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${abonné.numAbonne}</td>
      <td>${abonné.nom}</td>
      <td>${formaterDate(dateActivation)}</td>
      <td>${formaterDate(finActivation)}</td>
      <td>${abonné.tel}</td>
      <td>${prevention}</td>
      <td>
        <button onclick="éditerAbonné(${index})">Modifier</button>
        <button onclick="supprimerAbonné(${index})">Supprimer</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  localStorage.setItem('abonnés', JSON.stringify(abonnés));
}

// Gère la soumission du formulaire d'ajout
document.getElementById('form-abonné').addEventListener('submit', (e) => {
  e.preventDefault();

  const numAbonne = document.getElementById('numAbonne').value.trim();
  const nom = document.getElementById('nom').value.trim();
  const dateActivation = document.getElementById('dateActivation').value;
  const tel = document.getElementById('tel').value.trim();

  abonnés.push({ numAbonne, nom, dateActivation, tel });
  mettreAJourTable();
  e.target.reset();
});

// Gère la modification
function éditerAbonné(index) {
  indexEdition = index;
  const abonné = abonnés[index];

  document.getElementById('edit-numAbonne').value = abonné.numAbonne;
  document.getElementById('edit-nom').value = abonné.nom;
  document.getElementById('edit-dateActivation').value = abonné.dateActivation;
  document.getElementById('edit-tel').value = abonné.tel;

  document.getElementById('form-modifier').classList.remove('hidden');
}

// Enregistre les modifications
document.getElementById('form-modifier').addEventListener('submit', (e) => {
  e.preventDefault();

  const numAbonne = document.getElementById('edit-numAbonne').value.trim();
  const nom = document.getElementById('edit-nom').value.trim();
  const dateActivation = document.getElementById('edit-dateActivation').value;
  const tel = document.getElementById('edit-tel').value.trim();

  abonnés[indexEdition] = { numAbonne, nom, dateActivation, tel };
  mettreAJourTable();

  document.getElementById('form-modifier').classList.add('hidden');
});

// Annule la modification
document.getElementById('cancel-modifier').addEventListener('click', () => {
  document.getElementById('form-modifier').classList.add('hidden');
});

// Supprime un abonné
function supprimerAbonné(index) {
  abonnés.splice(index, 1);
  mettreAJourTable();
}

// Filtre les abonnés
document.getElementById('filter').addEventListener('change', (e) => {
  filtreActif = e.target.value;
  mettreAJourTable();
});

// Initialise
mettreAJourTable();
