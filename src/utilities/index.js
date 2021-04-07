const fs = require("fs");
const multer = require("multer");

//MULTER DISK STORAGE
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const fileUpload = multer({ storage });

//READ UPLOADED FILE TO JSON
const readFile = (filename) => {
  const readPath = fs.readFileSync(filename);
  const stringFile = readPath.toString();
  const content = JSON.stringify({ content: stringFile });
  return JSON.parse(content);
};

//UPDATE ARRAY WITHOUT CHANGING ORDER
const updateArray = (array, newObj, index) => {
  index === 0
    ? (array = [newObj, ...array.slice(index + 1)])
    : (array = [...array.slice(0, index), newObj, ...array.slice(index + 1)]);
  return array;
};
module.exports = { updateArray, readFile, fileUpload };
