fetch('/requests/current_user')
  .then(response => response.json())
  .then(data => {
    const requestsContainer = document.getElementById('requestsContainer');

    requestsContainer.innerHTML = '';

    data.forEach(request => {
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
      statusDiv.classList.add("status")
      statusDiv.textContent = "В очікуванні...";
      if(request.status === 1){
        statusDiv.classList.add("status-confirm")
        statusDiv.textContent = "Підтверджено";
      }
      if(request.status=== 2){
        statusDiv.classList.add("status-decline")
        statusDiv.textContent = "Відмовлено";
      }
      

      requestDiv.appendChild(requestInfoDiv);
      requestDiv.appendChild(statusDiv);

      requestsContainer.appendChild(requestDiv);
    });
  })
  .catch(error => console.error('Error:', error));
