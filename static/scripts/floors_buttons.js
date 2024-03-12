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
    {"floor": "ЦШ4", "rooms": ["402", "403", "404", "415", "416"]}
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
    activeFloor(getFloorId(buildingNames[0],4));
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
    if (floorsList) {
        floorsList.classList.add('active');
    }
    activeFloor(getFloorId(buildingName,0));
}

function activeFloor(floorId) {
    const allFloors = document.querySelectorAll('.floor-button');
    allFloors.forEach(floor => {
        if (floor.id !== floorId) {
            floor.classList.remove('current');
        } else {
            floor.classList.add('current');
            showMap(floor.id);
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
        console.log(`static/assets/${floorFolder}/${fileName}`);
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
    roomsList.forEach(room => {
        const roomElement = document.createElement("div");
        roomElement.id = getRoomId(room,floorId.slice(0,2));
        roomElement.style.cursor = "pointer";
        roomElement.style.zIndex = "10";
        roomElement.style.backgroundColor = "#000";
        roomElement.style.position = "absolute";
        roomElement.style.opacity = "0";
        if (room==="002") {
            roomElement.style.height = "80px";
            roomElement.style.width = "170px";
            roomElement.style.marginTop = "166px";
            roomElement.style.marginLeft = "298px";
            roomElement.id = getRoomId("002","ЦШ");
        } else if (room==="016") {
            roomElement.style.height = "70px";
            roomElement.style.width = "47px";
            roomElement.style.marginTop = "271px";
            roomElement.style.marginLeft = "520px";
            roomElement.id = getRoomId("016","ЦШ");
        } else if (room==="127") {
            roomElement.style.height = "125px";
            roomElement.style.width = "103px";
            roomElement.style.marginTop = "264px";
            roomElement.style.marginLeft = "125px";
            roomElement.id = getRoomId("127","ЦШ");
        } else if (room==="202") {
            roomElement.style.height = "81px";
            roomElement.style.width = "71px";
            roomElement.style.marginTop = "123px";
            roomElement.style.marginLeft = "507px";
            roomElement.id = getRoomId("202","ЦШ");
        } else if (room==="203") {
            roomElement.style.height = "72px";
            roomElement.style.width = "71px";
            roomElement.style.marginTop = "40px";
            roomElement.style.marginLeft = "507px";
            roomElement.id = getRoomId("203","ЦШ");
        } else if (room==="204") {
            roomElement.style.height = "43px";
            roomElement.style.width = "71px";
            roomElement.style.marginTop = "40px";
            roomElement.style.marginLeft = "612px";
            roomElement.id = getRoomId("204","ЦШ");
        } else if (room==="216") {
            roomElement.style.height = "62px";
            roomElement.style.width = "53px";
            roomElement.style.marginTop = "301px";
            roomElement.style.marginLeft = "324px";
            roomElement.id = getRoomId("216","ЦШ");
        } else if (room==="302") {
            roomElement.style.height = "81px";
            roomElement.style.width = "71px";
            roomElement.style.marginTop = "123px";
            roomElement.style.marginLeft = "507px";
            roomElement.id = getRoomId("302","ЦШ");
        } else if (room==="303") {
            roomElement.style.height = "72px";
            roomElement.style.width = "71px";
            roomElement.style.marginTop = "40px";
            roomElement.style.marginLeft = "507px";
            roomElement.id = getRoomId("303","ЦШ");
        } else if (room==="304") {
            roomElement.style.height = "43px";
            roomElement.style.width = "71px";
            roomElement.style.marginTop = "40px";
            roomElement.style.marginLeft = "612px";
            roomElement.id = getRoomId("304","ЦШ");
        } else if (room==="316") {
            roomElement.style.height = "62px";
            roomElement.style.width = "37px";
            roomElement.style.marginTop = "301px";
            roomElement.style.marginLeft = "321px";
            roomElement.id = getRoomId("316","ЦШ");
        } else if (room==="402") {
            roomElement.style.height = "81px";
            roomElement.style.width = "71px";
            roomElement.style.marginTop = "123px";
            roomElement.style.marginLeft = "507px";
            roomElement.id = getRoomId("402","ЦШ");
        } else if (room==="403") {
            roomElement.style.height = "72px";
            roomElement.style.width = "71px";
            roomElement.style.marginTop = "40px";
            roomElement.style.marginLeft = "507px";
            roomElement.id = getRoomId("403","ЦШ");
        } else if (room==="404") {
            roomElement.style.height = "43px";
            roomElement.style.width = "71px";
            roomElement.style.marginTop = "40px";
            roomElement.style.marginLeft = "612px";
            roomElement.id = getRoomId("404","ЦШ");
        } else if (room==="415") {
            roomElement.style.height = "62px";
            roomElement.style.width = "70px";
            roomElement.style.marginTop = "285px";
            roomElement.style.marginLeft = "508px";
            roomElement.id = getRoomId("415","ЦШ");
        } else if (room==="416") {
            roomElement.style.height = "62px";
            roomElement.style.width = "36px";
            roomElement.style.marginTop = "301px";
            roomElement.style.marginLeft = "322px";
            roomElement.id = getRoomId("416","ЦШ");
        } 
        roomElement.addEventListener("click", () => createRequestMenu(roomElement.id));
        mapContainer.appendChild(roomElement);
    });

}

function getRoomId(roomNum,building) {
    return building+"-"+roomNum;
}
generateButtons(buildingsData);