function initializeSearchBar() {
    const searchRoomsButton = document.getElementById("searchButton");
    searchRoomsButton.addEventListener("click", searchRooms);
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
                requestMenu(roomDiv.id);
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

function requestMenu(roomId) {
    const menu = document.getElementById("requestMenu");
    
    
}


initializeSearchBar()