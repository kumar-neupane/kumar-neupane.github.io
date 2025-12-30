document.addEventListener("DOMContentLoaded", function () {
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(el => {
    const file = el.getAttribute('data-include') + '.html';
    fetch(file)
      .then(response => {
        if (response.ok) return response.text();
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        el.innerHTML = data;
      })
      .catch(error => {
        console.error('Error loading file:', file, error);
      });
  });
});
