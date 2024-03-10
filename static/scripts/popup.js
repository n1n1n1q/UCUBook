document.addEventListener('DOMContentLoaded', function() {
    const loginIcon = document.getElementById('loginIcon');
    const popupMenu = document.getElementById('popupMenu');
    const adminTab = document.getElementById('adminTab');

    if (loginIcon && popupMenu && adminTab) {
        loginIcon.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (popupMenu.style.display === 'block') {
                popupMenu.style.display = 'none';
            } else {
                popupMenu.style.display = 'block';
            }
        });
        fetch('/user_status')
            .then(response => response.json())
            .then(data => {
                console.log('User status:', data);
                if (data >= 3) {
                    adminTab.style.display = 'block';
                } else {
                    adminTab.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching user status:', error);
            });
        document.addEventListener('click', function(event) {
            if (!popupMenu.contains(event.target) && event.target !== loginIcon) {
                popupMenu.style.display = 'none';
            }
        });
    } else {
        console.error('Could not find login icon or popup menu element.');
  }
});
