let selectedX = null;
let selectedY = null;

// Select a location on the webpage
document.getElementById("selectLocation").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: selectLocationOnPage
  });

  window.close();
});

// Start clicking
document.getElementById("start").addEventListener("click", async () => {
  const speed = Number(document.getElementById("speed").value);

  if (speed < 1) {
    alert("Enter a valid click speed.");
    return;
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: startAutoClicker,
    args: [speed]
  });
});

// Stop clicking
document.getElementById("stop").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: stopAutoClicker
  });
});

function selectLocationOnPage() {
  alert("Click the location you want the Auto Clicker to use.");

  function chooseLocation(event) {
    event.preventDefault();
    event.stopPropagation();

    const x = event.clientX;
    const y = event.clientY;

    localStorage.setItem(
      "autoClickLocation",
      JSON.stringify({ x, y })
    );

    alert(`Location selected!\nX: ${x}\nY: ${y}`);

    document.removeEventListener("click", chooseLocation, true);
  }

  document.addEventListener("click", chooseLocation, true);
}

function startAutoClicker(speed) {
  const location = JSON.parse(
    localStorage.getItem("autoClickLocation")
  );

  if (!location) {
    alert("Please select a click location first.");
    return;
  }

  if (window.autoClickerInterval) {
    clearInterval(window.autoClickerInterval);
  }

  const delay = 1000 / speed;

  window.autoClickerInterval = setInterval(() => {
    const element = document.elementFromPoint(
      location.x,
      location.y
    );

    if (element) {
      element.click();
    }
  }, delay);
}

function stopAutoClicker() {
  if (window.autoClickerInterval) {
    clearInterval(window.autoClickerInterval);
    window.autoClickerInterval = null;
  }
}
