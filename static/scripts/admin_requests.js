const container = document.getElementById('pendingRequestsContainer');
const loadingText = document.createElement('p');
loadingText.textContent = 'Завантаження даних...';
loadingText.style.fontSize="24px";
loadingText.style.marginLeft="10px";
loadingText.style.marginBottom="40vw";
container.appendChild(loadingText);
fetch('/get_pending_requests')
.then(response => response.json())
.then(pendingRequests => {


    if (pendingRequests.length === 0) {
        loadingText.textContent = 'Наразі немає активних запитів';
    } else {
        loadingText.remove();

        pendingRequests.forEach((request, index) => {
            if (index >= 10) return; // Show only the first 10 requests

            const requestDiv = document.createElement('div');
            requestDiv.classList.add('pending-requests');

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('pending-info');

            const mainP = document.createElement('p');
            mainP.classList.add('pending-main');
            mainP.textContent = `[${request.room_name}], ${request.day} ${request.busy_from}:00 - ${request.busy_to}:00`;

            const nameP = document.createElement('p');
            nameP.classList.add('pending-name');
            nameP.textContent = request.event_name;

            const descriptionP = document.createElement('p');
            descriptionP.classList.add('pending-description');
            descriptionP.textContent = request.description;

            const renterP = document.createElement('p');
            renterP.classList.add('pending-renter');
            renterP.textContent = request.renter;

            const numP = document.createElement('p');
            numP.classList.add('pending-num');
            numP.textContent = request.phone_number;

            infoDiv.appendChild(mainP);
            infoDiv.appendChild(nameP);
            infoDiv.appendChild(descriptionP);
            infoDiv.appendChild(renterP);
            infoDiv.appendChild(numP);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('pending-buttons');

            const acceptButton = document.createElement('button');
            acceptButton.classList.add('accept');
            acceptButton.textContent = 'Підтвердити';
            acceptButton.addEventListener('click', () => updateRequestStatus(request, 1, requestDiv));

            const declineButton = document.createElement('button');
            declineButton.classList.add('decline');
            declineButton.textContent = 'Відмовити';
            declineButton.addEventListener('click', () => updateRequestStatus(request, 2, requestDiv));

            buttonsDiv.appendChild(acceptButton);
            buttonsDiv.appendChild(declineButton);

            requestDiv.appendChild(infoDiv);
            requestDiv.appendChild(buttonsDiv);

            container.appendChild(requestDiv);
            container.appendChild(document.createElement('hr'));
        });

        if (pendingRequests.length > 10) {
            const pagesDiv = document.createElement('div');
            pagesDiv.classList.add('pages');
            container.appendChild(pagesDiv);
            // Add pagination logic here
        }
    }
})
.catch(error => console.error('Error fetching pending requests:', error));
const prevContainer = document.getElementById('prevRequestsContainer');
const prevLoadingText = document.createElement('p');
prevLoadingText.textContent = 'Завантаження даних...';
prevLoadingText.style.fontSize="24px";
prevLoadingText.style.marginLeft="10px";
prevContainer.appendChild(prevLoadingText);
fetch('/get_past_requests')
.then(response => response.json())
.then(pastRequests => {
    
    if (pastRequests.length === 0) {
        prevLoadingText.textContent = 'Наразі немає активних запитів';
    } else {
        pastRequests.forEach(request => {
            prevLoadingText.remove();
            const requestDiv = document.createElement('div');
            requestDiv.classList.add('prev-requests');

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('prev-info');

            const mainP = document.createElement('p');
            mainP.classList.add('prev-main');
            mainP.textContent = `[${request.room_name}], ${request.day} ${request.busy_from} - ${request.busy_to}`;

            const descriptionP = document.createElement('p');
            descriptionP.classList.add('prev-description');
            descriptionP.textContent = request.description;

            infoDiv.appendChild(mainP);
            infoDiv.appendChild(descriptionP);

            const statusDiv = document.createElement('div');
            statusDiv.classList.add('prev-status');
            if (request.status === 1) {
                statusDiv.textContent = 'Підтверджено';
                statusDiv.style.backgroundColor= "rgba(46, 171, 33, 200)";
            } else {
                statusDiv.textContent = 'Відмовлено';
                statusDiv.style.backgroundColor= "rgba(213, 33, 47, 200)";
            }
            statusDiv.style.color="#ffffff";
            requestDiv.appendChild(infoDiv);
            requestDiv.appendChild(statusDiv);

            prevContainer.appendChild(requestDiv);
            prevContainer.appendChild(document.createElement('hr'));
        });
    }
})
.catch(error => console.error('Error fetching past requests:', error));

function updateRequestStatus(request, newStatus, requestDiv) {
    const requestData = {
        room_name: request.room_name,
        busy_from: request.busy_from,
        busy_to: request.busy_to,
        day: request.day,
        renter: request.renter,
        event_name: request.event_name,
        description: request.description,
        status: request.status,
        new_status: newStatus
    };

    fetch('/update_request_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Request status updated successfully');
            requestDiv.remove(); // Remove the request from the UI
        } else {
            console.error('Error updating request status');
        }
    })
    .catch(error => console.error('Error updating request status:', error));
}