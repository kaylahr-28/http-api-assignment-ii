const users = {};


const respondJSON = (request, response, status, obj) => {
    const content = JSON.stringify(obj);

    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    //body only for 'get'
    if (request.method !== "HEAD" && status !== 204) {
        response.write(content);
    }

    response.end();
};

const getUsers = (request, response) => {
    const responseJSON = {
        users,
    };
    //may need to update for head?
    respondJSON(request, response, 200, responseJSON);
}

const addUsers = (request, response) => {

    const responseJSON = {
        message: 'Please provide both a name and an age.',
    };

    const { name, age } = request.body;

    //both needed
    if (!name || !age) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    };

    //204: updated
    let responseCode = 204;

    //new user
    if (!users[name]) {
        responseCode = 201;
        users[name] = {
            name: name,
        };
    };

    users[name].age = age;

    if (responseCode === 201) {
        responseJSON.message = 'User created successfully!';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    //204: updated user (no response)
    return respondJSON(request, response, responseCode, {});
}

module.exports = {
    getUsers,
    addUsers
}