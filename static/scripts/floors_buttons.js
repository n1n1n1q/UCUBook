const mapContainer = document.getElementsByClassName("map-container")[0];

const buildingsData = [
    {"building": "Центр Шептицького", "floors": 5},
    {"building": "Академічний корпус", "floors": 5},
    {"building": "Храм Софії", "floors": 2},
];

const mapImages = ["ЦШ0", "ЦШ1", "ЦШ2", "ЦШ3", "ЦШ4"];

const floorRooms = [
    {"floor": "ЦШ0", "rooms": ["002", "016"]},
    {"floor": "ЦШ1", "rooms": ["127"]},
    {"floor": "ЦШ2", "rooms": ["202", "203", "204", "216"]},
    {"floor": "ЦШ3", "rooms": ["302", "303", "304", "316"]},
    {"floor": "ЦШ4", "rooms": ["402", "403", "404", "416"]}
];

function getFloorId(buildingName,floorNum) {
    const tmp = buildingName.split(" ");
    return tmp[0][0].toUpperCase()+tmp[1][0].toUpperCase()+floorNum;
}

function generateButtons(data) {
    const buildingsContainer = document.getElementById('buildingsContainer');
    const floorsContainer = document.getElementById('floorsContainer');

    data.forEach(buildingData => {
        const buildingButton = document.createElement('button');
        buildingButton.id = buildingData.building+'-button';
        buildingButton.classList.add('building-button');
        buildingButton.innerText = buildingData.building;
        buildingButton.addEventListener('click', () => {
            showFloors(buildingData.building);
        });
        buildingsContainer.appendChild(buildingButton);

        const floorsListDiv = document.createElement('div');
        floorsListDiv.id = buildingData.building;
        floorsListDiv.classList.add('floors-section');
        floorsContainer.appendChild(floorsListDiv);

        for (let i = 0; i < buildingData.floors; i++) {
            const floorButton = document.createElement('button');
            floorButton.classList.add('floor-button');
            floorButton.id = getFloorId(buildingData.building,i);
            floorButton.addEventListener('click', () => {
                activeFloor(floorButton.id);
            });
            floorButton.innerText = i + '-й поверх';
            floorsListDiv.appendChild(floorButton);
        }
    });
    const buildingNames = buildingsData.map(data => data.building);
    showFloors(buildingNames[0]);
    activeFloor(getFloorId(buildingNames[0],2));
}

function showFloors(buildingName) {
    const allFloorsLists = document.querySelectorAll('.floors-section');
    const allBuildings = document.querySelectorAll('.building-button');
    allFloorsLists.forEach(floorsList => {
        floorsList.classList.remove('active');
    });
    allBuildings.forEach(building => {
        if (building.id !== buildingName+'-button') {
            building.classList.remove('current');
        } else {
            building.classList.add('current');
        }
    });
    const floorsList = document.getElementById(buildingName);
    if (floorsList) {floorsList.classList.add('active');
    }
    activeFloor(buildingName,0);
}

function activeFloor(floorId) {
    const allFloors = document.querySelectorAll('.floor-button');
    allFloors.forEach(floor => {
        if (floor.id !== floorId) {
            floor.classList.remove('current');
        } else {
            floor.classList.add('current');
            showMap(floorId);
        }
    });
}

function showMap(floorId) {
    mapContainer.innerHTML = "";
    if (mapImages.indexOf(floorId)===-1) {
        const noImage = document.createElement("p");
        noImage.textContent = "Немає карти";
        mapContainer.appendChild(noImage);
    } else {
        const mapImage = document.createElement("img");
        mapImage.classList.add("map-image");
        floorFolder = floorId.slice(0,2);
        fileName = `${floorId[2]}pov.jpg`;
        mapImage.src = `static/assets/${floorFolder}/${fileName}`;
        mapImage.style.width = "relative";
        mapImage.style.padding = "4px";
        mapImage.style.marginTop = "15px";
        mapImage.style.marginLeft = "20px";
        mapImage.style.height = "50rem";
        mapImage.style.position = "absolute";
        mapContainer.appendChild(mapImage);
        showRooms(floorId);
    }
}
function showRooms(floorId) {
    const floorObj = floorRooms.find(item => item.floor === floorId);
    const roomsList = floorObj.rooms;
    console.log(roomsList);
    roomsList.forEach(room => {
        console.log(room);
        const roomElement = document.createElement("div");
        roomElement.id = getRoomId(room,floorId.slice(0,2));
        roomElement.style.cursor = "pointer";
        roomElement.style.zIndex = "10";
        roomElement.style.backgroundColor = "#000";
        roomElement.style.position = "absolute";
        if (room==="002") {
            roomElement.style.height = "80px";
            roomElement.style.width = "170px";
            roomElement.style.marginTop = "166px";
            roomElement.style.marginLeft = "298px";
            console.log("002");
        } else if (room==="016") {
            roomElement.style.height = "70px";
            roomElement.style.width = "47px";
            roomElement.style.marginTop = "271px";
            roomElement.style.marginLeft = "520px";
            console.log("016");
        } else if (room==="127") {
            roomElement.style.height = "125px";
            roomElement.style.width = "103px";
            roomElement.style.marginTop = "264px";
            roomElement.style.marginLeft = "125px";
            console.log("127");
        } else if (room==="202") {
            roomElement.style.height = "81px";
            roomElement.style.width = "71px";
            roomElement.style.marginTop = "123px";
            roomElement.style.marginLeft = "507px";
            console.log("202");
        }
                
    mapContainer.appendChild(roomElement);
    });

}

function getRoomId(roomNum,building) {
    return building+"-"+roomNum;
}
// showMap("ЦШ0");
generateButtons(buildingsData);