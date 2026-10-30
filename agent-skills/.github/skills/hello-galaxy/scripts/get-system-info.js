const os = require("os");
console.log("User OS:", os.platform());
console.log("OS Type:", os.type());
console.log("OS Architecture:", os.arch());
console.log("Free Memory:", os.freemem(), "bytes");
console.log("Total Memory:", os.totalmem(), "bytes");