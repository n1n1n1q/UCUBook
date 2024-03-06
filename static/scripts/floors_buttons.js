const buildingsData = [
    {"building": "Центр Шептицького", "floors": 5},
    {"building": "Академічний корпус", "floors": 5},
    {"building": "Храм Софії", "floors": 2},
];

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
            floorButton.id = buildingData.building+'-floor-'+i;
            floorButton.addEventListener('click', () => {
                activeFloor(floorButton.id);
            });
            floorButton.innerText = i + '-й поверх';
            floorsListDiv.appendChild(floorButton);
        }
    });
    const buildingNames = buildingsData.map(data => data.building);
    showFloors(buildingNames[0]);
    activeFloor(buildingNames[0]+'-floor-0');
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
        } else {building.classList.add('current');}
    });
    const floorsList = document.getElementById(buildingName);
    if (floorsList) {floorsList.classList.add('active');
    }
    activeFloor(buildingName+"-floor-0");
}

function activeFloor(floorId) {
    const allFloors = document.querySelectorAll('.floor-button');
    allFloors.forEach(floor => {
        if (floor.id !== floorId) {
            floor.classList.remove('current');
        } else {
            floor.classList.add('current');
        }
    });
}

function generateMap (floor) {
    // !!!
}
generateButtons(buildingsData)