document.addEventListener("keyup", function closeMenuOnEscape(event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});

function initializeSearchBar() {
    const searchRoomsButton = document.getElementById("searchButton");
    searchRoomsButton.addEventListener("click", searchRooms);
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("keyup", function searchEnter(event) {
        if (event.key === "Enter") {
            event.preventDefault;
            searchRooms();
        }
    });
}

async function searchRooms() {
    console.log("Taadadsad")
    const searchInput = document.getElementById("searchInput").value.trim();
    console.log(searchInput)
    const foundRoomsDiv = document.getElementById("results");
    foundRoomsDiv.innerHTML = "";

    if (searchInput === "") {
        const emptyInputMessage = document.createElement("p");
        emptyInputMessage.classList.add('result-message');
        emptyInputMessage.textContent = "No search input!";
        foundRoomsDiv.appendChild(emptyInputMessage);
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
        console.log(data)
        if (data.length === 0) {
            const noMatches = document.createElement("p");
            noMatches.classList.add("result-message");
            noMatches.textContent = "No matches found";
            foundRoomsDiv.appendChild(noMatches);
            return;
        }
        const foundRoomsList = document.createElement('div');
        foundRoomsList.classList.add("room-list");
        data.forEach(room => {
            console.log(room);
            const roomDiv = document.createElement("div");
            roomDiv.classList.add("found-room");
            roomDiv.id = room;
            roomDiv.textContent = room;
            roomDiv.addEventListener("click", () => {
                createRequestMenu(roomDiv.id);
            });
            foundRoomsList.appendChild(roomDiv);
        });
        foundRoomsDiv.appendChild(foundRoomsList);
    } catch (error) {
        console.log(error)
        const errorMessage = document.createElement('p');
        errorMessage.classList.add("result-message");
        errorMessage.textContent = "Error!";
        foundRoomsDiv.appendChild(errorMessage);
    }
}

function showAvailableTimeSlots(date) {
    console.log("!!!" + date)
}

function createRequestMenu(roomId) {
    const screenBlur = document.getElementById("menuOverlay");

    const requestMenu = document.getElementById("requestMenu");
    requestMenu.innerHTML = "";
    const roomName = document.createElement("p");
    const inputDiv = document.createElement("div");
    const dateInputText = document.createElement("p");
    const dateInput = document.createElement("input");
    const inputSubmitButton = document.createElement("button");
    
    roomName.textContent = roomId;
    dateInputText.textContent = "Дата";
    dateInput.type = "date";
    dateInput.addEventListener("input", showAvailableTimeSlots(inputSubmitButton.value));

    inputDiv.appendChild(dateInputText);
    inputDiv.appendChild(dateInput);
    inputDiv.appendChild(inputSubmitButton);

    requestMenu.appendChild(roomName);
    requestMenu.appendChild(inputDiv);


    
    const page = document.getElementById("ucubook");
    page.style.filter = "blur(10px)";
    requestMenu.style.display = "block";
    requestMenu.style.filter = "none";
    screenBlur.style.display = "block";
    screenBlur.style.filter= "none";

}

function closeMenu() {
    const requestMenu = document.getElementById("requestMenu");
    const blurOverlay = document.getElementById("menuOverlay");
    requestMenu.style.display = "none";
    blurOverlay.style.display = "none";

}

closeMenu();
initializeSearchBar();