const requestsContainer = document.getElementById('requestsContainer');
const loadingText = document.createElement('p');
loadingText.textContent = 'Завантаження даних...';
loadingText.style.fontSize = "24px";
loadingText.style.marginLeft = "10px";
loadingText.style.marginBottom = "40vw";
requestsContainer.appendChild(loadingText);

function createPaginationArrows(numPages, currentPage, container, requests) {
  const pagesDiv = document.createElement('div');
  pagesDiv.classList.add('pages');

  const prevArrow = document.createElement('span');
  prevArrow.classList.add('arrow', 'prev');
  prevArrow.innerHTML = '←'
  prevArrow.addEventListener('click', () => showPage(currentPage - 1, requests, container));
  if (currentPage === 1) {
    prevArrow.classList.add('disabled');
  }
  pagesDiv.appendChild(prevArrow);

  const pageInfo = document.createElement('span');
  pageInfo.classList.add('page-info');
  pageInfo.textContent = ` ${currentPage} / ${numPages} `;
  pagesDiv.appendChild(pageInfo);

  const nextArrow = document.createElement('span');
  nextArrow.classList.add('arrow', 'next');
  nextArrow.innerHTML = '→';
  nextArrow.addEventListener('click', () => showPage(currentPage + 1, requests, container));
  if (currentPage === numPages) {
    nextArrow.classList.add('disabled');
  }
  pagesDiv.appendChild(nextArrow);

  container.appendChild(pagesDiv);
}

function showPage(pageNum, requests, container) {
  const itemsPerPage = 10;
  const startIndex = (pageNum - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);
  const numPages = Math.ceil(requests.length / itemsPerPage);
  if (pageNum>numPages || pageNum<1){
    return ;
  }
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  if (requests.length === 0) {
    const noRequestsText = document.createElement('p');
    noRequestsText.textContent = 'На жаль, у Вас немає жодних запитів.';
    noRequestsText.style.fontSize = "24px";
    noRequestsText.style.marginLeft = "10px";
    container.appendChild(noRequestsText);
  } else {
    currentRequests.forEach(request => {
      requestsContainer.appendChild(document.createElement('hr'));

      const requestDiv = document.createElement('div');
      requestDiv.classList.add('request');

      const requestInfoDiv = document.createElement('div');
      requestInfoDiv.classList.add('request-info');

      const mainInfoP = document.createElement('p');
      mainInfoP.classList.add('request-main');
      mainInfoP.textContent = `Аудиторія: ${request.room_name}; ${request.day}, ${request.busy_from}:00 - ${request.busy_to}:00`;

      const descriptionP = document.createElement('p');
      descriptionP.classList.add('request-description');
      descriptionP.textContent = `${request.event_name}: ${request.description}`;

      requestInfoDiv.appendChild(mainInfoP);
      requestInfoDiv.appendChild(descriptionP);

      const statusDiv = document.createElement('div');
      statusDiv.classList.add("status");
      statusDiv.textContent = "В очікуванні...";

      if (request.status === 1) {
        statusDiv.classList.add("status-confirm");
        statusDiv.textContent = "Підтверджено";
      }

      if (request.status === 2) {
        statusDiv.classList.add("status-decline");
        statusDiv.textContent = "Відмовлено";
      }

      requestDiv.appendChild(requestInfoDiv);
      requestDiv.appendChild(statusDiv);

      requestsContainer.appendChild(requestDiv);
    });
  }

  const pagesDiv = container.querySelector('.pages');
  if (pagesDiv) {
    pagesDiv.remove();
  }
  if (requests.length > 0) {
    createPaginationArrows(numPages, pageNum, container, requests);
  }
}

fetch('/requests/current_user')
  .then(response => response.json())
  .then(data => {
    if (data.length === 0) {
      loadingText.textContent = "На жаль, у Вас немає жодних запитів.";
    } else {
      loadingText.remove();

      const itemsPerPage = 10; 
      const numPages = Math.ceil(data.length / itemsPerPage);

      createPaginationArrows(numPages, 1, requestsContainer, data);

      showPage(1, data, requestsContainer);
    }
  })
  .catch(error => console.error('Error:', error));
