const getColors = require("get-image-colors");
var sizeOf = require("image-size");
var Jimp = require("jimp");
const fs = require("fs");

const jsonPath = "imagePixel.json";
const pathSource = "images/n.jpg";
const pathBuild = "build/n.jpg";
const pixelW = 10;
const pixelH = 10;
const size = sizeOf(pathSource);
let iterationX = size.width
let iterationY = size.height

console.log(size, size.width / pixelW);

let imageInfo = {
  pixels: [],
  pixelW: pixelW,
  pixelH: pixelH,
  width: size.width,
  height: size.height
};

function getColor(image, x, y, w, h) {
  const mime = image.getMIME();
  image.crop(x, y, w, h);
  // image.write("build/x" + x + ".jpg");
  image.getBufferAsync(mime).then(buffer => {
    getColors(buffer, mime).then(colors => {
      const color = colors[1].css();
      imageInfo.pixels.push(color);
      return color;
    });
  });
}

function saveJson(obj) {
  let json = JSON.stringify(obj);
  fs.writeFile(jsonPath, json, "utf8", () => {
    console.log("Savt to Json");
  });
}

function getImage(x, y, w, h) {
  Jimp.read(pathSource)
    .then(image => {
      getColor(image, x, y, w, h);
    })
    .catch(err => {
      console.log("err read", err);
    });
}

// getImage(0, 0, 10, 10);

for (let h = -10; h < iterationY; h=h+pixelH) {
  for (let w = -10; w < iterationX; w=w+pixelW) {
    getImage(w, h, pixelW, pixelH);
  }
}

setTimeout(() => {
  saveJson(imageInfo);
}, 5000);
