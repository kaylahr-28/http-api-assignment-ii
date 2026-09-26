const http = require('http');
const query = require('querystring');
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const htmlHandler = require('./htmlResponses');
const jsonHandler = require('./jsonResponses');

// for POST request
const parseBody = (request, response, handler) => {
    //pieces of request will go here
    const body = [];

    //error
    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    //add data to array
    request.on('data', (chunk) => {
        body.push(chunk);
    });

    //when we have all the info
    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const type = request.headers['content-type'];
        console.log("request.body", body);
        //turn into obj
        if (type === 'application/json') {
            request.body = JSON.parse(bodyString);
        } else {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'invalid data format' }));
            return response.end();
        }

        handler(request, response);
    });
};

//for the get user form
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
        case '/getUsers':
            jsonHandler.getUsers(request, response);
            break;
        case '/addUser':
            jsonHandler.addUser(request, response);
            break;
        case '/notReal':
            jsonHandler.notFound(request, response);
            break;
        default:
            jsonHandler.notFound(request, response);
            break;
    }
}

//for the add user form
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addUser') {

        parseBody(request, response, jsonHandler.addUser);
    }
};

const onRequest = (request, response) => {
    const protocol = request.connection.ecrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    //first form
    if (request.method === "POST") {
        handlePost(request, response, parsedUrl);

        //second form (get/head)
    } else {
        handleGet(request, response, parsedUrl);
    }
}
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
})
