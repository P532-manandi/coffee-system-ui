let order = {
    beverage: '',
    condiments: [],
    total: 0
};

const prices = {
    beverages: {
        'Dark Roast': 1.99,
        'Espresso': 1.34,
        'House Blend': 1.65,
        'Decaf': 1.28
    },
    condiments: {
        'Milk': 0.4,
        'Mocha': 0.3,
        'Soy': 0.27,
        'Whip': 0.25
    }
};

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    
    document.getElementById(screenId).style.display = 'flex';
}

function selectBeverage(beverage) {
    order.beverage = beverage;
    order.total = prices.beverages[beverage];
    
    document.getElementById('selected-beverage').textContent = beverage;
    
    order.condiments = [];
    document.getElementById('selected-condiments').innerHTML = '';
    
    showScreen('condiments-screen');
}

function toggleCondiment(condiment) {
    const index = order.condiments.indexOf(condiment);
    
    if (index === -1) {
        order.condiments.push(condiment);
        order.total += prices.condiments[condiment];
        
        const condimentElement = document.createElement('div');
        condimentElement.className = 'condiment-item';
        condimentElement.id = `condiment-${condiment}`;
        condimentElement.textContent = `${condiment}`;
        condimentElement.onclick = () => toggleCondiment(condiment);
        document.getElementById('selected-condiments').appendChild(condimentElement);
    } else {

        order.condiments.splice(index, 1);
        order.total -= prices.condiments[condiment];
        
        document.getElementById(`condiment-${condiment}`).remove();
    }
    

    document.querySelectorAll('.condiments-grid .option-card').forEach(card => {
        if (order.condiments.includes(card.textContent.trim())) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

function placeOrder() {
    const orderId = Math.floor(Math.random() * 100) + 1;
    
    let condimentText = '';
    if (order.condiments.length > 0) {
        condimentText = ' with ' + order.condiments.map(c => c.toLowerCase()).join(' and ');
        
        const condimentCounts = {};
        order.condiments.forEach(c => {
            condimentCounts[c] = (condimentCounts[c] || 0) + 1;
        });
        
        for (const [condiment, count] of Object.entries(condimentCounts)) {
            if (count > 1) {
                condimentText = condimentText.replace(condiment.toLowerCase(), `double ${condiment.toLowerCase()}`);
            }
        }
    }
    
    const orderDetails = `${order.beverage} ${condimentText}!`;
    
    document.getElementById('order-id').textContent = `Order id: ${orderId}`;
    document.getElementById('order-details').textContent = orderDetails;
    document.getElementById('order-total').textContent = `Total: $${order.total.toFixed(1)}`;
    
    showScreen('confirmation-screen');
}

document.addEventListener('DOMContentLoaded', function() {
    showScreen('start-screen');
});