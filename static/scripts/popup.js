document.addEventListener('DOMContentLoaded', function() {
  const loginIcon = document.getElementById('loginIcon');
  const popupMenu = document.getElementById('popupMenu');

  if (loginIcon && popupMenu) {
      loginIcon.addEventListener('click', function(event) {
          event.preventDefault(); // Prevent default action of the link if it's an anchor tag
          event.stopPropagation(); // Stop event propagation to prevent it from reaching the document click listener

          // Toggle popup menu display
          if (popupMenu.style.display === 'block') {
              popupMenu.style.display = 'none';
          } else {
              popupMenu.style.display = 'block';
          }
      });

      // Click event listener on document to close the popup menu when clicking outside of it
      document.addEventListener('click', function(event) {
          if (!popupMenu.contains(event.target) && event.target !== loginIcon) {
              popupMenu.style.display = 'none';
          }
      });
  } else {
      console.error('Could not find login icon or popup menu element.');
  }
});
