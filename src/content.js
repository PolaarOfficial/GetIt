let drawing = false;
let capturing = false;
let box, startX, startY;

function handleMouseDown(event) {
  event.preventDefault();
  if (capturing) return;

  drawing = true;
  startX = event.pageX;
  startY = event.pageY;
  box = document.createElement("div");
  box.style.position = "absolute";
  box.style.border = "2px solid red";
  box.style.background = "rgba(255,0,0,0.2)";
  box.style.pointerEvents = "none";
  box.style.left = `${startX}px`;
  box.style.top = `${startY}px`;
  document.body.appendChild(box);
}

function handleMouseUp(event) {
  event.preventDefault();
  if (capturing || !drawing) return;

  drawing = false;
  capturing = true;

  const coords = {
    x: Math.min(event.pageX, startX),
    y: Math.min(event.pageY, startY),
    width: Math.abs(event.pageX - startX),
    height: Math.abs(event.pageY - startY),
  };

  // Temporarily remove the box before capturing
  document.body.removeChild(box);

  chrome.runtime.sendMessage(
    {
      action: "capture",
      coords: coords,
    },
    function (response) {
      if (response.result !== "captured") {
        // If the capture wasn't successful for any reason, add the box back to the page
        document.body.appendChild(box);
      }
      // In either case, we're no longer capturing
      capturing = false;
      box = null;
    }
  );
}

function handleMouseMove(event) {
  event.preventDefault();
  if (drawing && box) {
    box.style.width = `${Math.abs(event.pageX - startX)}px`;
    box.style.height = `${Math.abs(event.pageY - startY)}px`;
    box.style.left = `${event.pageX < startX ? event.pageX : startX}px`;
    box.style.top = `${event.pageY < startY ? event.pageY : startY}px`;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
  } else if (request.action === "stop") {
    window.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mousemove", handleMouseMove);
  }
});
