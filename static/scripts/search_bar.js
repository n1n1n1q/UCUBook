// DOM Elements
const searchBar = document.getElementById("searchInput");
const searchRoomsButton = document.getElementById("searchButton");
const foundRoomsDiv = document.getElementById("results");
const requestMenu = document.getElementById("requestMenu");
const screenBlur = document.getElementById("menuOverlay");

// Event Listeners
document.addEventListener("keyup", handleEscapeKey);
searchRoomsButton.addEventListener("click", searchRooms);
searchBar.addEventListener("keyup", handleEnterKey);

// Functions
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeMenu();
  }
}

function handleEnterKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchRooms();
  }
}

async function searchRooms() {
  const searchInput = searchBar.value.trim();
  foundRoomsDiv.innerHTML = "";

  if (searchInput === "") {
    renderResultMessage("No search input!");
    return;
  }

  try {
    const response = await fetch("/search", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input_data: searchInput }),
    });
    const data = await response.json();

    if (data.length === 0) {
      renderResultMessage("No matches found");
      return;
    }

    renderFoundRooms(data);
  } catch (error) {
    console.log(error);
    renderResultMessage("Error!");
  }
}

function renderResultMessage(message) {
  const resultMessage = document.createElement("p");
  resultMessage.classList.add('result-message');
  resultMessage.textContent = message;
  foundRoomsDiv.appendChild(resultMessage);
}

function renderFoundRooms(rooms) {
  const foundRoomsList = document.createElement('div');
  foundRoomsList.classList.add("room-list");

  rooms.forEach(room => {
    const roomDiv = document.createElement("div");
    roomDiv.classList.add("found-room");
    roomDiv.id = room;
    roomDiv.textContent = room;
    roomDiv.addEventListener("click", () => createRequestMenu(roomDiv.id));
    foundRoomsList.appendChild(roomDiv);
  });

  foundRoomsDiv.appendChild(foundRoomsList);
}

function showAvailableTimeSlots(date) {
    console.log(date)
    const availableSlotsDiv = document.createElement("div");
    availableSlotsDiv.classList.add("available-list");
    getAvailableTimeSlots(date).then(timeSlots =>
      {
        
      })
}

async function getAvailableTimeSlots(date) {
  try {
    const response = await fetch("/get_by_data", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input_data: date }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error('Error fetching available time slots:', error);
  }
}

function createRequestMenu(roomId) {
  requestMenu.innerHTML = "";
  screenBlur.style.display = "block";
  requestMenu.style.display = "block";

  const roomName = document.createElement("p");
  roomName.textContent = roomId;

  const inputDiv = document.createElement("div");
  const dateInputText = document.createElement("p");
  dateInputText.textContent = "Дата";
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  const inputSubmitButton = document.createElement("button");
  inputSubmitButton.textContent = "Шукати";
  inputSubmitButton.addEventListener("click", () => showAvailableTimeSlots(dateInput.value));

  inputDiv.appendChild(dateInputText);
  inputDiv.appendChild(dateInput);
  inputDiv.appendChild(inputSubmitButton);

  requestMenu.appendChild(roomName);
  requestMenu.appendChild(inputDiv);
}

function closeMenu() {
  requestMenu.style.display = "none";
  screenBlur.style.display = "none";
}

// Initial Setup
searchBar.value = "";
closeMenu();