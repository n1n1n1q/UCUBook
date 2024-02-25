const buildingsData = [
    {"building": "Центр Шептицького", "floors": 5},
    {"building": "Академічнйи корпус", "floors": 5},
    {"building": "Храм Софії", "floors": 2},
];

function generateBuildingButtonsAndFLoors(data) {
    const buildingButtonsContainer = document.getElementById('building-buttons');
    const floorsListContainer = document.getElementById('floors-list');

    data.forEach(buildingData =>{
        const buildingButton = document.createElemenet('button');
        buildingButton.textContent = buildingData.building;
        buildingButton.addEventsListener('click',function() {
            showFloorsList(buildingData.building, buildingData.floors);
        });
        buildingButtonsContainer.appendChild(buildingButton);
        
        const floorsListDiv = document.createElement('div');
        floorsListDiv.id = buildingData.building.replace(/\s+/g, '-')+'-floors';
        floorsListDiv.classList.add('floors-list');
        floorsListContainer.appendChild(floorsListDiv);
        
        for (let i = 1; i <= buildingData.floors; i++) {
            const floorBurtton = document.createElement('button');
            floorBurtton.textContent = "Floor " + i;
            floorsListDiv.appendChild(floorBurtton);
        }
        
    });
}

function showFloorsList(buildingName, numFloors) {
    const allFloorsList = document.querySelectorAll('.floors-list');
    allFloorsList.forEach(list => {
        list.classList.remove('active');
    });

    const floorList = document.getElementById(buildingName.replace(/\s+/g, '-')+'-floors');
    if (floorList) {
        floorList.classList.add('active');
    }
}

generateBuildingButtonsAndFLoors(buildingsData);