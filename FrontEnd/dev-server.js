const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 5500;
const host = "127.0.0.1";
const root = __dirname;
const contentTypes = {
    ".html": "text/html;charset=utf-8",
    ".js": "text/javascript;charset=utf-8",
    ".css": "text/css;charset=utf-8",
};

http.createServer((request, response) => {
    const url = new URL(request.url, `http://${host}:${port}`);
    const requestedPath = url.pathname === "/" ? "index.html" : url.pathname;
    const filePath = path.join(root, requestedPath);

    if (!filePath.startsWith(root)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(404);
            response.end("Not found");
            return;
        }

        response.writeHead(200, {
            "Content-Type": contentTypes[path.extname(filePath)] || "text/plain;charset=utf-8",
        });
        response.end(content);
    });
}).listen(port, host, () => {
    console.log(`TechConnect frontend: http://${host}:${port}`);
});
