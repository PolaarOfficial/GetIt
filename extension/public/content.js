let box = null;
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
      sendResponse({image:url, response:'image file'})
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
  if (box !== null) {
    endX = e.pageX;
    endY = e.pageY;

    box.style.width = `${endX - startX}px`;
    box.style.height = `${endY - startY}px`;
  }
}
function mouseDown(e) {
  startX = e.pageX;
  startY = e.pageY;

  box = document.createElement("div");
  box.style.border = "2px solid red";
  box.style.position = "absolute";
  box.style.zIndex = "99999";
  box.style.left = `${startX}px`;
  box.style.top = `${startY}px`;
  box.id = "screenshotBox";
  document.body.style.userSelect = "none";

  document.body.appendChild(box);
}

function mouseUp(e) {
  endX = e.pageX;
  endY = e.pageY;

  box.style.width = `${endX - startX}px`;
  box.style.height = `${endY - startY}px`;

  setTimeout(function () {
    if (box !== null) {
      document.body.removeChild(box);
      box = null;
    }

    document.body.style.userSelect = "";

    chrome.runtime.sendMessage({ message: "capture" });
  }, 100);
}

function sendBase64ToServer(image){
  console.log('here')
  let path = "http://127.0.0.1:5000/digest";
  const formData = new FormData();
  formData.append('image', new Blob([image],{type: 'image/jpeg'}));
  fetch(path, {
    method:"POST",
    headers: {"Content-type":"application/json"},
    body: formData
  }).then(response => response.json())
    .then(data => console.log(data))
    .then(error => console.error(error));

  // var httpPost = new XMLHttpRequest(),
  // data = JSON.stringify({image: base64});
  // httpPost.onreadystatechange = function(err){
  //   if(httpPost.readyState == 4 && httpPost.readyState == 200){
  //     console.log(httpPost.responseText);
  //   } else {
  //     console.log(err);
  //   }
  // };
  // httpPost.setRequestHeader('Content-Type', 'application/json');
  // httpPost.open("POST", path, true);
  // httpPost.send(data);
}
