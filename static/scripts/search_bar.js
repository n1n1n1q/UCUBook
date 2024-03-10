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

function showAvailableTimeSlots(date,room) {
    console.log(date)
    let availableSlotsDiv = document.getElementById("availableSlots");
    if (availableSlotsDiv) {
      availableSlotsDiv.remove();
    }
    let availableSlotsP = document.getElementById("availableSlotsHeading");
    if (availableSlotsP) {
      availableSlotsP.remove();
    }
    let requestFormButton = document.getElementById("requestFormButton");
    if (requestFormButton) {
      requestFormButton.remove();
    }
    let requestForm = document.getElementById("requestForm");
    if (requestForm) {
      requestForm.remove();
    }
    availableSlotsDiv = document.createElement("div");
    availableSlotsDiv.id = "availableSlots";
    availableSlotsDiv.classList.add("available-list");
    availableSlotsP = document.createElement("p");
    availableSlotsP.id = "availableSlotsHeading";
    availableSlotsP.textContent = "Доступний час для бронювання";
    availableSlotsP.classList.add("text-field");
    requestMenu.appendChild(availableSlotsP);
    requestMenu.appendChild(availableSlotsDiv);

    getAvailableTimeSlots(date, room).then(timeSlots =>
      {
        console.log(timeSlots);
        timeSlots.forEach(timeSlot => {
          const timeSlotP = document.createElement("p");
          timeSlotP.classList.add("text-field");
          timeSlotP.textContent =  `${timeSlot[0]}-${timeSlot[1]}`;
          availableSlotsDiv.appendChild(timeSlotP);
        })
      });
      requestFormButton = document.createElement("button");
      requestFormButton.id = "requestFormButton";
      requestFormButton.textContent = "Забронювати";
      requestFormButton.addEventListener("click", () => requestFormMenu(room,date));
      requestMenu.appendChild(requestFormButton);
      requestFormButton.classList.add("submit-button")
}

function requestFormMenu(room,date) {
  console.log(room);
  // const renter = !!!
  let requestForm = document.getElementById("requestForm");
  if (requestForm) {
    requestForm.remove();
  }
  document.getElementById("availableSlots").remove();
  document.getElementById("availableSlotsHeading").remove();
  document.getElementById("requestFormButton").remove();
  requestForm = document.createElement("div");
  requestForm.id = "requestForm";
  const timeDiv = document.createElement("div");
  timeDiv.id = "timeDiv";
  const startDiv = document.createElement("div");
  startDiv.id = "startDiv";
  const endDiv = document.createElement("div");
  endDiv.id = "endDiv";
  const startText = document.createElement("p");
  startText.textContent = "Початок: ";
  const startInput = document.createElement("input");
  const endText = document.createElement("p");
  endText.textContent = "Кінець: ";
  const endInput = document.createElement("input");
  startInput.classList.add("menu-input");
  endInput.classList.add("menu-input");
  startDiv.appendChild(startText);
  startDiv.appendChild(startInput);
  startInput.classList.add("time-gap");
  endInput.classList.add("time-gap");
  startText.classList.add("text-field");
  endText.classList.add("text-field");
  endDiv.appendChild(endText);
  endDiv.appendChild(endInput);
  timeDiv.appendChild(startDiv);
  timeDiv.appendChild(endDiv);
  const nameDiv = document.createElement("div");
  nameDiv.id = "nameDiv";
  const descriptionDiv = document.createElement("div");
  descriptionDiv.id = "desciptionDiv";
  const eventNameText = document.createElement("p");
  eventNameText.textContent = "Назва події:";
  const eventNameInput = document.createElement("input");
  eventNameText.classList.add("text-field");
  eventNameInput.classList.add("menu-input");
  const descriptionText = document.createElement("p");
  descriptionText.textContent = "Опис події: ";
  const descriptionInput = document.createElement("input");
  descriptionInput.classList.add("menu-input");
  descriptionText.classList.add("text-field");
  nameDiv.appendChild(eventNameText);
  nameDiv.appendChild(eventNameInput);
  descriptionDiv.appendChild(descriptionText);
  descriptionDiv.appendChild(descriptionInput);
  const sendButton = document.createElement("button");
  sendButton.textContent = "Надіслати запит";
  sendButton.classList.add("submit-button");
  // sendButton.addEventListener("click", () => sendRequest(
  //   room, startInput.value.trim(), endInput.value.trim(), date, renter, eventNameInput.value.trim(), descriptionInput.value.trim()
  //   ));
  requestForm.appendChild(timeDiv);
  requestForm.appendChild(nameDiv);
  requestForm.appendChild(descriptionDiv);
  requestForm.appendChild(sendButton);
  requestMenu.appendChild(requestForm);
}

async function sendRequest(room,start,end,date,renter,name,description) {
  try {
  const response = await fetch("/requests/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ room_name: room, busy_from: start, busy_to:end, dat: date, renter: renter, event_name: name, description: description})
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("Couldn't create request");
  }
  const data = await response.json();
  return data;
  } catch (error) {
    console.error("Error sending request ", error);
    return "";
  }

}

async function getAvailableTimeSlots(date, room) {
  console.log(date);
  console.log(room);
  try {
    const response = await fetch("/get_by_data", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input_date: date, input_room: room }),
    });

    console.log(response)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return [];
  }
}

function createRequestMenu(roomId) {
  console.log(roomId)
  requestMenu.innerHTML = "";
  const exit = document.createElement("p");
  exit.textContent = "x";
  exit.id = "exitMenu";
  exit.addEventListener("click", () => closeMenu());
  requestMenu.appendChild(exit);
  screenBlur.style.display = "block";
  requestMenu.style.display = "block";

  const roomName = document.createElement("p");
  roomName.textContent = roomId;
  roomName.id = "roomNameRequest";

  const inputDiv = document.createElement("div");
  const dateInputText = document.createElement("p");
  dateInputText.textContent = "Дата";
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInputText.id = "dateInputText";
  dateInput.classList.add("menu-input");
  dateInput.max = "9999-12-31";
  dateInput.id = "dateInput";
  dateInputText.classList.add("text-field");
  const inputSubmitButton = document.createElement("button");
  inputSubmitButton.textContent = "Шукати";
  inputSubmitButton.id = "dateSubmit";
  inputSubmitButton.addEventListener("click", () => showAvailableTimeSlots(dateInput.value,roomId));
  inputSubmitButton.classList.add("submit-button");
  inputDiv.appendChild(dateInputText);
  inputDiv.appendChild(dateInput);
  inputDiv.appendChild(inputSubmitButton);

  requestMenu.appendChild(roomName);
  requestMenu.appendChild(inputDiv);
  const imagesDiv = document.createElement("div");
  imagesDiv.id = "imagesDiv";
  const image1 = document.createElement("div");
  const image2 = document.createElement("div");
  image1.classList.add("room-image");
  image2.classList.add("room-image");
  image1.id="image1";
  image2.id="image2";
  imagesDiv.appendChild(image1);
  imagesDiv.appendChild(image2);
  requestMenu.appendChild(imagesDiv);
}

function closeMenu() {
  requestMenu.style.display = "none";
  screenBlur.style.display = "none";
}

// Initial Setup
searchBar.value = "";
closeMenu();
