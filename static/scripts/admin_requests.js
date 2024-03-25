const container = document.getElementById('pendingRequestsContainer');
const loadingText = document.createElement('p');
loadingText.textContent = 'Завантаження даних...';
loadingText.style.fontSize = "24px";
loadingText.style.marginLeft = "10px";
loadingText.style.marginBottom = "40vw";
container.appendChild(loadingText);

function createPaginationArrows(numPages, currentPage, container, requests, requestType) {
  const pagesDiv = document.createElement('div');
  pagesDiv.classList.add('pages');

  const prevArrow = document.createElement('span');
  prevArrow.classList.add('arrow', 'prev');
  prevArrow.innerHTML = '←';
  prevArrow.addEventListener('click', () => showPage(currentPage - 1, requests, container, requestType));
  if (currentPage === 1) {
    prevArrow.classList.add('disabled');
  }
  pagesDiv.appendChild(prevArrow);

  const pageInfo = document.createElement('span');
  pageInfo.classList.add('page-info');
  pageInfo.textContent = `${currentPage} / ${numPages}`;
  pagesDiv.appendChild(pageInfo);

  const nextArrow = document.createElement('span');
  nextArrow.classList.add('arrow', 'next');
  nextArrow.innerHTML = '→';
  nextArrow.addEventListener('click', () => showPage(currentPage + 1, requests, container, requestType));
  if (currentPage === numPages) {
    nextArrow.classList.add('disabled');
  }
  pagesDiv.appendChild(nextArrow);

  container.appendChild(pagesDiv);
}

function showPage(pageNum, requests, container, requestType) {
  const itemsPerPage = 10;
  const startIndex = (pageNum - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);
  const numPages = Math.ceil(requests.length / itemsPerPage);
  if(pageNum>numPages){
    return ;
  }
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  currentRequests.forEach((request) => {
    const requestDiv = document.createElement('div');
    requestDiv.classList.add(`${requestType}-requests`);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add(`${requestType}-info`);

    const mainP = document.createElement('p');
    mainP.classList.add(`${requestType}-main`);
    mainP.textContent = `[${request.room_name}], ${request.day} ${request.busy_from}:00 - ${request.busy_to}:00`;

    const descriptionP = document.createElement('p');
    descriptionP.classList.add(`${requestType}-description`);
    descriptionP.textContent = request.description;

    infoDiv.appendChild(mainP);
    infoDiv.appendChild(descriptionP);

    if (requestType === 'pending') {
      const nameP = document.createElement('p');
      nameP.classList.add('pending-name');
      nameP.textContent = request.event_name;

      const renterP = document.createElement('p');
      renterP.classList.add('pending-renter');
      renterP.textContent = request.renter;

      const numP = document.createElement('p');
      numP.classList.add('pending-num');
      numP.textContent = request.phone_number;

      infoDiv.appendChild(nameP);
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
    } else {
      const statusDiv = document.createElement('div');
      statusDiv.classList.add('prev-status');
      if (request.status === 1) {
        statusDiv.textContent = 'Підтверджено';
        statusDiv.style.backgroundColor = "rgba(46, 171, 33, 200)";
      } else {
        statusDiv.textContent = 'Відмовлено';
        statusDiv.style.backgroundColor = "rgba(213, 33, 47, 200)";
      }
      statusDiv.style.color = "#ffffff";
      requestDiv.appendChild(infoDiv);
      requestDiv.appendChild(statusDiv);
    }

    container.appendChild(requestDiv);
    container.appendChild(document.createElement('hr'));
  });

  const pagesDiv = container.querySelector('.pages');
  if (pagesDiv) {
    pagesDiv.remove();
  }
  createPaginationArrows(numPages, pageNum, container, requests, requestType);
}

fetch('/get_pending_requests')
  .then(response => response.json())
  .then(pendingRequests => {
    if (pendingRequests.length === 0) {
      loadingText.textContent = 'Наразі немає активних запитів';
    } else {
      loadingText.remove();

      const itemsPerPage = 10; 
      const numPages = Math.ceil(pendingRequests.length / itemsPerPage);

      createPaginationArrows(numPages, 1, container, pendingRequests, 'pending');

      showPage(1, pendingRequests, container, 'pending');
    }
  })
  .catch(error => console.error('Error fetching pending requests:', error));

const prevContainer = document.getElementById('prevRequestsContainer');
const prevLoadingText = document.createElement('p');


const roomFilterSelection = document.getElementById('roomFilter');
const dateFilterSelection = document.getElementById('dateFilter');
const filterButton = document.getElementById('filterButton');


function filter_by_room(roomName, requests) {
    if (roomName === 'ALL') {
        return requests;
    }
    return requests.filter(request => request.room_name === roomName);
}

function filter_by_date(selectedDate, requests) {
    if (!selectedDate) {
        return requests;
    }
    return requests.filter(request => request.day === selectedDate);
}


filterButton.addEventListener('click', function() {
    selectedDate = dateFilterSelection.value;
    selectedRoom = roomFilterSelection.value;
    const prevRequests = prevContainer.querySelectorAll('.prev-requests, hr, span'); // Select all request elements
    prevRequests.forEach(request => request.remove()); // Remove all request elements
    prevLoadingText.textContent = 'Завантаження даних...';
    prevLoadingText.style.fontSize = "24px";
    prevLoadingText.style.marginLeft = "10px";
    prevContainer.appendChild(prevLoadingText);

    fetch('/get_past_requests')
    .then(response => response.json())
    .then(pastRequests => {

        let filteredRequests;
        filteredRequests = filter_by_date(selectedDate, filter_by_room(selectedRoom, pastRequests))
    
        if (filteredRequests.length === 0) {
            prevLoadingText.textContent = 'Минулих запитів не знайдено';
        } else {
            prevLoadingText.textContent = '';
            const itemsPerPage = 10; 
            const numPages = Math.ceil(filteredRequests.length / itemsPerPage);

            createPaginationArrows(numPages, 1, prevContainer, filteredRequests, 'prev');
            showPage(1, filteredRequests, prevContainer, 'prev');
        }
    })
    .catch(error => console.error('Error fetching past requests:', error));


});

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
    new_status: newStatus,
    available: []
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
        requestDiv.remove(); 
      } else {
        console.error('Error updating request statusdasda');
        errorText=document.createElement("p");
        errorText.textContent="Сталася помилка при обробці запиту...";
        const buttonsDiv = requestDiv.querySelector('.pending-buttons');
        buttonsDiv.innerHTML=""
        buttonsDiv.appendChild(errorText);
        errorText.style.display="flex";
        errorText.style.marginBottom="30px";
      }
    })
    .catch(error => {
      console.error('Error updating request status иуи:', error);
      errorText=document.createElement("p");
      errorText.textContent="Помилка:(";
      const buttonsDiv = requestDiv.querySelector('.pending-buttons');
      buttonsDiv.innerHTML="";
      buttonsDiv.appendChild(errorText);
    });
}

const event = new Event('click');
filterButton.dispatchEvent(event);

