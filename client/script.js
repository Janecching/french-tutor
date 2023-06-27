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
                    'waitress': [
                        'Bonjour: Hello', 'Merci: Thank you', 'Sil vous plaît: Please ', 'Menu: Menu ', 'L\'addition: The bill',
                        'Café: Coffee', 'Pain: Bread', 'Fromage: Cheese', 'Vin: Wine', 'Croissant: Croissant',
                        'Eau: Water', 'Poulet: Chicken', 'Salade: Salad', 'Pâtes: Pasta', 'Pizza: Pizza'
                    ],
                    'hotel receptionist': [
                        'Chambre: Room', 'Réception: Reception', 'Clé: Key', 'Réservation: Reservation', 'Hôtel: Hotel',
                        'Lit: Bed', 'Douche: Shower', 'Serviette: Towel', 'Ascenseur: Elevator', 'Prix: Price',
                        'Petit-déjeuner: Breakfast', 'Wifi: Wi-Fi', 'Occupé: Occupied', 'Climatisation: Air conditioning', 'Piscine: Pool'
                    ],
                    'tourist information conceirge': [
                        'Où est: Where is', 'Rue: Street', 'Droite: Right', 'Gauche: Left', 'Quartier: Neighborhood',
                        'Station de métro: Metro station', 'Arrêt de bus: Bus stop', 'Bâtiment: Building', 'Loin: Far', 'Près: Near',
                        'Tournez à droite: Turn right', 'Tournez à gauche: Turn left', 'Tout droit: Straight ahead',
                        'Au coin de: At the corner of', 'Intersection: Intersection'
                    ],
                    'vendor at a market': [
                        'Marché: Market', 'Fruits: Fruits', 'Légumes: Vegetables', 'Viande: Meat', 'Poisson: Fish',
                        'Pain: Bread', 'Fromage: Cheese', 'Prix: Price', 'Sacs: Bags', 'Caisse: Cash register',
                        'Étal: Stall', 'Épicerie: Grocery store', 'Commerçant: Vendor', 'Promotion: Promotion', 'Panier: Basket'
                    ]
                },
                Intermediate: {
                    'waitress': [
                        'Apéritif: Appetizer', 'Entrée: Starter', 'Plat principal: Main course', 'Dessert: Dessert',
                        'Carte des vins: Wine list', 'Menu du jour: Daily menu', 'Réservation: Reservation', 'Serveur: Waiter',
                        'Pourboire: Tip', 'Service: Service', 'Confirmation: Confirmation', 'Facture: Bill', 'Bagages: Luggage',
                        'Service en chambre: Room service', 'Climatisation: Air conditioning'
                    ],
                    'hotel receptionist': [
                        'Réceptionniste: Receptionist', 'Confirmation: Confirmation', 'Facture: Bill', 'Bagages: Luggage',
                        'Service en chambre: Room service', 'Climatisation: Air conditioning', 'Wifi: Wi-Fi', 'Piscine: Pool',
                        'Réveil: Alarm clock', 'Occupé: Occupied', 'Tournez à droite: Turn right', 'Tournez à gauche: Turn left',
                        'Tout droit: Straight ahead', 'Au coin de: At the corner of', 'Intersection: Intersection'
                    ],
                    'tourist information conceirge': [
                        'Tournez à droite: Turn right', 'Tournez à gauche: Turn left', 'Tout droit: Straight ahead',
                        'Au coin de: At the corner of', 'Intersection: Intersection', 'Passage piéton: Pedestrian crossing',
                        'Feu de signalisation: Traffic light', 'Plan de la ville: City map', 'Arrêt de taxi: Taxi stand',
                        'Se perdre: Get lost', 'Réceptionniste: Receptionist', 'Confirmation: Confirmation',
                        'Facture: Bill', 'Bagages: Luggage', 'Service en chambre: Room service'
                    ],
                    'vendor at a market': [
                        'Étal: Stall', 'Épicerie: Grocery store', 'Commerçant: Vendor', 'Promotion: Promotion',
                        'Panier: Basket', 'Balance: Scale', 'Monnaie: Change', 'Rayon: Aisle', 'Ticket de caisse: Receipt',
                        'Retourner: Return', 'Apéritif: Appetizer', 'Entrée: Starter', 'Plat principal: Main course',
                        'Dessert: Dessert', 'Carte des vins: Wine list'
                    ]
                }
            }
        };
        const vocabularies = top10Words[language][level][scenario];
        const vocabTable = document.getElementById('vocabTable');

        vocabularies.forEach(word => {
            const row = document.createElement('tr');

            const wordCell = document.createElement('td');
            wordCell.textContent = word;

            row.appendChild(wordCell);
            vocabTable.appendChild(row);
        });
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