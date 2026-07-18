const http = require("http");

http.createServer((req, res) => {
    res.end("Hello Campus Tech Hub!");
}).listen(3000, () => {
    console.log("Test server running on port 3000");
});

