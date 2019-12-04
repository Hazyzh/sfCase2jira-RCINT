const button = document.querySelector('#logout');
button.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'logout' });
});
