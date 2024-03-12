const buildingsData = [
    {"building": "Центр Шептицького", "floors": 5},
    {"building": "Академічний корпус", "floors": 5},
    {"building": "Храм Софії", "floors": 2},
];

const mapImages = ["ЦШ0", "ЦШ1", "ЦШ2", "ЦШ3", "ЦШ4"];

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
    activeFloor(getFloorId(buildingNames[0],0));
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
    const mapContainer = document.getElementsByClassName("map-container")[0];
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
        mapContainer.appendChild(mapImage);
    }
}

// showMap("ЦШ0");
generateButtons(buildingsData);