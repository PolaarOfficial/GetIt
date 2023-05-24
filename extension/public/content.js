let drawBox = null;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let scrollX = 0;
let scrollY = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "activate") {
    // Remove any existing box when activating
    const existingBox = document.getElementById("screenshotBox");
    if (existingBox) {
      document.body.removeChild(existingBox);
    }

    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
    scrollX = window.scrollX;
    scrollY = window.scrollY;
  } else if (request.message === "deactivate") {
    document.removeEventListener("mousedown", mouseDown);
    document.removeEventListener("mouseup", mouseUp);
    document.removeEventListener("mousemove", mouseMove);
    if (drawBox !== null) {
      document.body.removeChild(drawBox);
      drawBox = null;
    }
  } else if (request.message === "image") {
    let img = new Image();
    img.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let data = ctx.getImageData(
        startX + scrollX,
        startY + scrollY,
        endX - startX,
        endY - startY
      );

      let newCanvas = document.createElement("canvas");
      let newCtx = newCanvas.getContext("2d");
      newCanvas.width = endX - startX;
      newCanvas.height = endY - startY;
      newCtx.putImageData(data, 0, 0);

      let url = newCanvas.toDataURL("image/png");
      chrome.runtime.sendMessage({ image:url, message: "image file" });
      let link = document.createElement("a");
      link.href = url;
      link.download = "screenshot.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = request.image;
  }
});

function mouseMove(e) {
  if (drawBox !== null) {
    endX = e.pageX;
    endY = e.pageY;

    drawBox.style.width = `${endX - startX}px`;
    drawBox.style.height = `${endY - startY}px`;
  }
}
function mouseDown(e) {
  startX = e.pageX;
  startY = e.pageY;

  drawBox = document.createElement("div");
  drawBox.style.border = "2px solid red";
  drawBox.style.position = "absolute";
  drawBox.style.zIndex = "99999";
  drawBox.style.left = `${startX}px`;
  drawBox.style.top = `${startY}px`;
  drawBox.id = "screenshotBox";
  document.body.style.userSelect = "none";

  document.body.appendChild(drawBox);
}

function mouseUp(e) {
  endX = e.pageX;
  endY = e.pageY;

  drawBox.style.width = `${endX - startX}px`;
  drawBox.style.height = `${endY - startY}px`;

  setTimeout(function () {
    if (drawBox !== null) {
      document.body.removeChild(drawBox);
      drawBox = null;
    }

    document.body.style.userSelect = "";

    chrome.runtime.sendMessage({ message: "capture" });
  }, 100);
}
