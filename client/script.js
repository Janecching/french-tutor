import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

document.addEventListener('DOMContentLoaded', function() {
    var vocabButton = document.getElementById('vocabButton');
    vocabButton.addEventListener('click', function(e) {
        e.preventDefault();
        generateVocabularies();
    });

    function generateVocabularies() {
        const language = document.getElementById('language').value;
        const level = document.getElementById('level').value;
        const scenario = document.getElementById('scenario').value;
        const top10Words = {
            French: {
                Beginner: {
                    'Ordering food': ['Bonjour', 'Merci', 'S\'il vous plaît', 'Menu', 'L\'addition', 'Café', 'Pain', 'Fromage', 'Vin', 'Croissant'],
                    'Checking in a hotel': ['Chambre', 'Réception', 'Clé', 'Réservation', 'Hôtel', 'Lit', 'Douche', 'Serviette', 'Ascenseur', 'Prix'],
                    'Asking for directions': ['Où est', 'Rue', 'Droite', 'Gauche', 'Quartier', 'Station de métro', 'Arrêt de bus', 'Bâtiment', 'Loin', 'Près'],
                    'Shopping at a market': ['Marché', 'Fruits', 'Légumes', 'Viande', 'Poisson', 'Pain', 'Fromage', 'Prix', 'Sacs', 'Caisse'],
                },
                Intermediate: {
                    'Ordering food': ['Apéritif', 'Entrée', 'Plat principal', 'Dessert', 'Carte des vins', 'Menu du jour', 'Réservation', 'Serveur', 'Pourboire', 'Service'],
                    'Checking in a hotel': ['Réceptionniste', 'Confirmation', 'Facture', 'Bagages', 'Service en chambre', 'Climatisation', 'Wifi', 'Piscine', 'Réveil', 'Occupé'],
                    'Asking for directions': ['Tournez à droite', 'Tournez à gauche', 'Tout droit', 'Au coin de', 'Intersection', 'Passage piéton', 'Feu de signalisation', 'Plan de la ville', 'Arrêt de taxi', 'Se perdre'],
                    'Shopping at a market': ['Étal', 'Épicerie', 'Commerçant', 'Promotion', 'Panier', 'Balance', 'Monnaie', 'Rayon', 'Ticket de caisse', 'Retourner'],
                },
            },
        };

        const vocabularies = top10Words[language][level][scenario];
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '<h3>Generated Vocabularies:</h3>';
        const list = document.createElement('ul');
        vocabularies.forEach(word => {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            list.appendChild(listItem);
        });
        resultsDiv.appendChild(list);
    }
});

const handleSubmit = async(e) => {
    e.preventDefault();
    const userPromptForm = document.getElementById('userPromptForm');
    const data = new FormData(userPromptForm);

    // post user input 
    const language = document.getElementById('language').value;
    const level = document.getElementById('level').value;
    const scenario = document.getElementById('scenario').value;
    const userPrompt = data.get('prompt');
    console.log(language, level, scenario);

    chatContainer.innerHTML += chatStripe(false, userPrompt);
    userPromptForm.reset();

    // post bot response
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

    try {
        const response = await fetch('http://localhost:5000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversation: userPrompt,
                language: language,
                level: level,
                scenario: scenario,
            }),
        });
        console.log(userPrompt);

        clearInterval(loadInterval);
        messageDiv.innerHTML = ' ';

        if (response.ok) {
            const data = await response.json();
            const parsedData = data.bot.trim(); // Trims any trailing spaces/'\n'

            typeText(messageDiv, parsedData);

        } else {
            const err = await response.text();

            messageDiv.innerHTML = 'Something went wrong';
            alert(err);
        }
    } catch (error) {
        console.error(error);
        messageDiv.innerHTML = 'Something went wrong';
        alert('An error occurred. Please try again.');
    }
};


form.addEventListener('submit', handleSubmit);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent form submission
        handleSubmit(event);
    }
});