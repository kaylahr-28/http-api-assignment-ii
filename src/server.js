const http = require('http');
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const htmlHandler = require('./htmlResponses');
//const jsonHandler = require('./jsonResponses');


const handleGet = (request, response, parsedUrl) => {

    switch (parsedUrl.pathname) {
        case '/client.html':
            htmlHandler.getIndex(request, response);
            break;
        case '/style.css':
            htmlHandler.getCSS(request, response);
            break;
        case '/':
            htmlHandler.getIndex(request, response);
            break;
        default:
            htmlHandler.getIndex(request, response);
            response.status === 404;
            break;
    }
}

const onRequest = (request, response) => {
    const protocol = request.connection.ecrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if (request.method === "POST") {
        handleGet(request, response, parsedUrl);

    } else {
        handleGet(request, response, parsedUrl);
    }
}
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
})
