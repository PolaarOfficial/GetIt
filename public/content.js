let box = null;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let scrollX = 0;
let scrollY = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "activate") {
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);
    scrollX = window.scrollX;
    scrollY = window.scrollY;
  } else if (request.message === "deactivate") {
    document.removeEventListener("mousedown", mouseDown);
    document.removeEventListener("mouseup", mouseUp);
    if (box !== null) {
      document.body.removeChild(box);
      box = null;
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

function mouseDown(e) {
  startX = e.pageX;
  startY = e.pageY;

  box = document.createElement("div");
  box.style.border = "2px solid red";
  box.style.position = "absolute";
  box.style.zIndex = "99999";
  box.style.left = `${startX}px`;
  box.style.top = `${startY}px`;
  document.body.appendChild(box);
}
function mouseUp(e) {
  endX = e.pageX;
  endY = e.pageY;

  box.style.width = `${endX - startX}px`;
  box.style.height = `${endY - startY}px`;

  chrome.runtime.sendMessage({ message: "capture" }, function (response) {
    if (box !== null) {
      document.body.removeChild(box);
      box = null;
    }
    // This will make the icon inactive after the screenshot
    chrome.runtime.sendMessage({ message: "deactivate" });
  });
}
