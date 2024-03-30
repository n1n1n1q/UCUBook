const searchBar = document.getElementById("searchInput");
const searchRoomsButton = document.getElementById("searchButton");
const foundRoomsDiv = document.getElementById("results");
const requestMenu = document.getElementById("requestMenu");
const screenBlur = document.getElementById("menuOverlay");

document.addEventListener("keyup", handleEscapeKey);
searchRoomsButton.addEventListener("click", searchRooms);
searchBar.addEventListener("keyup", handleEnterKey);

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
    renderResultMessage("Введіть номер авдиторії!");
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
      renderResultMessage("Авдиторію не знайдено");
      return;
    }

    renderFoundRooms(data);
  } catch (error) {
    renderResultMessage("Помилка!");
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
    clearTimeSlotsDiv();
    let availableSlotsDiv = document.createElement("div");
    availableSlotsDiv.id = "availableSlots";
    availableSlotsDiv.classList.add("available-list");
    let availableSlotsP = document.createElement("p");
    availableSlotsP.id = "availableSlotsHeading";
    availableSlotsP.textContent = "Доступний час для бронювання";
    availableSlotsP.classList.add("text-field");
    requestMenu.appendChild(availableSlotsP);
    requestMenu.appendChild(availableSlotsDiv);
    const timeLoad = document.createElement("p");
    timeLoad.classList.add("text-field");
    timeLoad.textContent = "Завантаження даних...";
    requestMenu.appendChild(timeLoad);
    getAvailableTimeSlots(date, room).then(timeSlots =>
      {
        timeLoad.textContent="";
        timeSlots.forEach(timeSlot => {
          const timeSlotP = document.createElement("p");
          timeSlotP.classList.add("text-field");
          timeSlotP.textContent =  `${timeSlot[0]}-${timeSlot[1]}`;
          availableSlotsDiv.appendChild(timeSlotP);
        });
      });
      let requestFormButton = document.createElement("button");
      requestFormButton.id = "requestFormButton";
      requestFormButton.textContent = "Забронювати";
      requestFormButton.addEventListener("click", () => requestFormMenu(room,date));
      requestMenu.appendChild(requestFormButton);
      requestFormButton.classList.add("submit-button");
}

function requestFormMenu(room,date) {
  let requestForm = document.getElementById("requestForm");
  if (requestForm) {
    requestForm.remove();
  }
  document.getElementById("availableSlots").remove();
  document.getElementById("availableSlotsHeading").remove();
  document.getElementById("requestFormButton").remove();
  requestForm = document.createElement("div");
  requestForm.id = "requestForm";
  const infoText = document.createElement("p");
  infoText.classList.add("text-field");
  infoText.textContent = "Час, початок і кінець (цілі числа)"
  const timeDiv = document.createElement("div");
  timeDiv.id = "timeDiv";
  const startDiv = document.createElement("div");
  startDiv.id = "startDiv";
  const endDiv = document.createElement("div");
  endDiv.id = "endDiv";
  // const startText = document.createElement("p");
  // startText.textContent = "Початок: ";
  const startInput = document.createElement("input");
  // const endText = document.createElement("p");
  // endText.textContent = "Кінець: ";
  const endInput = document.createElement("input");
  startInput.classList.add("menu-input");
  endInput.classList.add("menu-input");
  // startDiv.appendChild(startText);
  startDiv.appendChild(startInput);
  startInput.classList.add("time-gap");
  endInput.classList.add("time-gap");
  // startText.classList.add("text-field");
  // endText.classList.add("text-field");
  // endDiv.appendChild(endText);
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
  getAvailableTimeSlots(date,room).then(timeSlots=>{
  sendButton.addEventListener("click", () => sendRequest(
    room, startInput.value.trim(), endInput.value.trim(), date, eventNameInput.value.trim(), descriptionInput.value.trim(),timeSlots
    ));
  requestForm.appendChild(infoText);
  requestForm.appendChild(timeDiv);
  requestForm.appendChild(nameDiv);
  requestForm.appendChild(descriptionDiv);
  requestForm.appendChild(sendButton);
  requestMenu.appendChild(requestForm);
  })
}

async function sendRequest(room,start,end,date,name,description,available) {
  if (!validateRequestInput(start,end,name,description)) {
    return;
  }
  try {
  const response = await fetch("/requests/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ room_name: room, busy_from: start, busy_to: end, day: date, event_name: name, description: description, renter: '', status:0, available:available})
  });
  if (!response.ok) {
    throw new Error("Couldn't create request");
  }
  const data = await response.json();
  requestResult(true);
  return data;
  } catch (error) {
    console.error("Error sending request ", error);
    requestResult(false);
    return "";
  }
}

async function getAvailableTimeSlots(date, room) {
  try {
    const response = await fetch("/get_by_data", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input_date: date, input_room: room }),
    });
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
  dateInput.max = "2100-12-31";
  dateInput.id = "dateInput";
  dateInputText.classList.add("text-field");
  const inputSubmitButton = document.createElement("button");
  inputSubmitButton.textContent = "Шукати";
  inputSubmitButton.id = "dateSubmit";
  inputSubmitButton.addEventListener("click", () => handleDateInput(roomId));
  inputSubmitButton.classList.add("submit-button");
  inputDiv.appendChild(dateInputText);
  inputDiv.appendChild(dateInput);
  inputDiv.appendChild(inputSubmitButton);

  requestMenu.appendChild(roomName);
  requestMenu.appendChild(inputDiv);
  const imageDiv = document.createElement("div");
  imageDiv.id = "imagesDiv";
  const image = document.createElement("img");
  image.classList.add("room-image");
  image.id="image";
  const imageFolder = roomId.slice(0,2).toLowerCase();
  const imageFile = roomId.slice(3);
  image.src = `static/assets/photos/${imageFolder}/${imageFile}.jpeg`;
  imageDiv.appendChild(image);
  requestMenu.appendChild(imageDiv);
}

function handleDateInput(room) {
  let dateInputValue = dateInput.value;
  let inputList = dateInputValue.split("-");

  let dateInp = new Date(inputList[0],inputList[1]-1,inputList[2]);
  let currentDate = new Date();
  let maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, currentDate.getDate());
  if (isNaN(dateInp.getDay())) {
    renderResultDate("Введіть дату!");
    return;
  }
  if (dateInp<currentDate) {
    renderResultDate("Бронювання на цей день неможливе");
    return;
  }
  if (dateInp>maxDate) {
    renderResultDate("Бронювання можливе лише на наступні 6 місяців");
    return;
  }
  showAvailableTimeSlots(dateInputValue,room);

}

function renderResultDate(message) {
  clearTimeSlotsDiv();
  let availableSlotsMessage = document.createElement("p");
  availableSlotsMessage.id = "availableSlots"
  availableSlotsMessage.classList.add('text-field-msg');
  availableSlotsMessage.textContent = message;
  requestMenu.appendChild(availableSlotsMessage);
}

function closeMenu() {
  requestMenu.style.display = "none";
  screenBlur.style.display = "none";
}

function clearTimeSlotsDiv() {
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
}

function validateRequestInput(start,end,name,description) {
  inputErrorRemove();
  startTime = parseInt(start);
  endTime = parseInt(end);
  if (isNaN(startTime)) {
    inputError("Введіть час початку події");
    return false;
  }
  if (startTime<8||startTime>20) {
    inputError("Час початку поза межами робочого часу");
    return false;
  }
  if (isNaN(endTime)) {
    inputError("Введіть час завершення події");
    return false;
  }
  if (endTime<9||endTime>21) {
    inputError("Час завершення поза межами робочого часу");
    return false;
  }
  if (endTime<startTime) {
    inputError("Неправильний час");
    return false;
  }
  if (endTime-startTime>3) {
    inputError("Тривалість події перевищує 3 години")
  }
  if (name.length===0) {
    inputError("Введіть назву події");
    return false;
  }
  if (name.length<5) {
    inputError("Надто коротка назва події");
    return false;
  }
  if (description.length>256) {
    inputError("Опис не повинен перевищувати 256 символів");
    return false;
  }
  return true;
}

function inputError(message) {
  inputErrorRemove();
  let requestInputError = document.createElement("p");
  requestInputError.id = "requestInputError";
  requestInputError.classList.add("text-field");
  requestInputError.textContent = message;
  requestForm.appendChild(requestInputError);
}

function inputErrorRemove() {
  let requestInputError = document.getElementById("requestInputError");
  if (requestInputError) {
    requestInputError.remove();
  }
}

function requestResult(ind) {
  requestMenu.innerHTML = "";
  const exit = document.createElement("p");
  exit.textContent = "x";
  exit.id = "exitMenu";
  exit.addEventListener("click", () => closeMenu());
  requestMenu.appendChild(exit);
  const requestRes = document.createElement("p");
  requestRes.classList.add("text-field-msg");
  requestMenu.appendChild(requestRes);
  if (ind) {
    requestRes.textContent = "Запит успішно надіслано. Очікуйте лист про підтвердження.";
  } else {
    requestRes.textContent = "При надсиланні запиту виникла помилка.";
  }
}

searchBar.value = "";
closeMenu();
