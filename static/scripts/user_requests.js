const userRequests = [
    {
        "room_name": "roomname",
        "busy_from": 10,
        "busy_to": 10,
        "day": "day",
        "renter": "renter",
        "event_name": "eventname",
        "description": "description"
    },
    {
        "room_name": "roomname1",
        "busy_from": 100,
        "busy_to": 100,
        "day": "day1",
        "renter": "renter1",
        "event_name": "eventname1",
        "description": "description1"
    }
];

const currentUser = [
    {"login": "currentuser"}
]

function displayUserRequests (requests) {
    const requestsContainer = document.getElementById("requestsContainer");
    requestsContainer.innerHTML = "";
}