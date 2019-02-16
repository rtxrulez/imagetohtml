const getColors = require("get-image-colors");
var sizeOf = require("image-size");
var Jimp = require("jimp");
const fs = require("fs");

const jsonPath = "imagePixel.json";
const pathSource = "images/n.jpg";
const pathBuild = "build/n.jpg";
const pixelW = 16;
const pixelH = 16;
const size = sizeOf(pathSource);
// let iterationX = size.width
// let iterationY = size.height

console.log(size, size.height / pixelH);

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
  return image.getBufferAsync(mime).then(buffer => {
    getColors(buffer, mime).then(colors => {
      const color = colors[0].css();
      imageInfo.pixels.push(color);
      return color;
    });
  });
}

let cursorPos = 0;
let cursorPosY = 0;

function getImage(x, y, w, h) {
  console.log('xxx', x, y)
  y = 59;
  Jimp.read(pathSource)
    .then(image => {
      const mime = image.getMIME();
      return image.getBufferAsync(mime).then(buffer => {
        return getColors(buffer, mime).then(colors => {
          const color = colors[0].css();
          imageInfo.pixels.push(color);
        });
      });
    })
    .then(color => {
      cursorPos = cursorPos + pixelW;
      if (cursorPos >= size.width) {
        // cursorPosY = cursorPosY + pixelH;
        // if (cursorPosY < size.height) {
        //   getImage(cursorPos, cursorPosY, pixelW, pixelH);
        // } else {
        //   saveJson(imageInfo);
        //   return;
        // }
        return
      } else {
        // getImage(cursorPos, cursorPosY, pixelW, pixelH);
      }
      console.log("color", imageInfo.pixels);
      return color;
    })
    .catch(err => {
      console.log("err read", err);
    });
}

getImage(0, 0, pixelW, pixelH);
getImage(300, 300, pixelW, pixelH);

function saveJson(obj) {
  let json = JSON.stringify(obj);
  fs.writeFile(jsonPath, json, "utf8", () => {
    console.log("Savt to Json");
  });
}
