let order = {
  beverage: "",
  condiments: [],
  total: 0,
};

const prices = {
  beverages: {
    "Dark Roast": 1.99,
    Espresso: 1.34,
    "House Blend": 1.65,
    Decaf: 1.28,
  },
  condiments: {
    Milk: 0.4,
    Mocha: 0.3,
    Soy: 0.27,
    Whip: 0.25,
  },
};

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.style.display = "none";
  });

  document.getElementById(screenId).style.display = "flex";
}

function selectBeverage(beverage) {
  order.beverage = beverage;
  order.total = prices.beverages[beverage];

  document.getElementById("selected-beverage").textContent = beverage;

  order.condiments = [];
  document.getElementById("selected-condiments").innerHTML = "";

  showScreen("condiments-screen");
}

function toggleCondiment(condiment) {
  const index = order.condiments.indexOf(condiment);

  if (index === -1) {
    order.condiments.push(condiment);
    order.total += prices.condiments[condiment];

    const condimentElement = document.createElement("div");
    condimentElement.className = "condiment-item";
    condimentElement.id = `condiment-${condiment}`;
    condimentElement.textContent = `${condiment}`;
    condimentElement.onclick = () => toggleCondiment(condiment);
    document
      .getElementById("selected-condiments")
      .appendChild(condimentElement);
  } else {
    order.condiments.splice(index, 1);
    order.total -= prices.condiments[condiment];

    document.getElementById(`condiment-${condiment}`).remove();
  }

  document.querySelectorAll(".condiments-grid .option-card").forEach((card) => {
    if (order.condiments.includes(card.textContent.trim())) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });
}

function placeOrder() {
  // Create order data to send to backend
  const orderData = {
    beverage: order.beverage,
    condiments: order.condiments,
  };

  // Show loading state
  document.getElementById("order-id").textContent = "Processing...";
  document.getElementById("order-details").textContent =
    "Please wait while we process your order";
  document.getElementById("order-total").textContent = "";
  showScreen("confirmation-screen");

  // Call the backend API
  fetch("https://coffee-order-cpwn.onrender.com/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle successful response from backend
      // Format: { "description": "Espresso, Milk, Whip", "cost": 1.99, "id": 1 }

      // Parse the description into beverage and condiments
      const descriptionParts = data.description.split(", ");
      const beverage = descriptionParts[0];
      const condiments = descriptionParts.slice(1);

      // Update the order details display
      document.getElementById("order-id").textContent = `Order #${data.id}`;

      // Format the details in the HTML with styling
      let orderDetailsHTML = `<span class="beverage-name">${beverage}</span>`;

      if (condiments.length > 0) {
        orderDetailsHTML += '<div class="condiments-container">';
        condiments.forEach((condiment) => {
          orderDetailsHTML += `<span class="condiment-badge">${condiment}</span>`;
        });
        orderDetailsHTML += "</div>";
      }

      document.getElementById("order-details").innerHTML = orderDetailsHTML;
      document.getElementById(
        "order-total"
      ).textContent = `Total: $${data.cost.toFixed(2)}`;
      document
        .querySelectorAll(".condiments-grid .option-card")
        .forEach((card) => {
          card.classList.remove("selected");
        });
    })
    .catch((error) => {
      // Handle error
      console.error("Error placing order:", error);
      document.getElementById("order-id").textContent = "Error";
      document.getElementById("order-details").textContent =
        "There was an error processing your order. Please try again.";
      document.getElementById("order-total").textContent = "";
    });
}

document.addEventListener("DOMContentLoaded", function () {
  showScreen("start-screen");
});
