const showSnackbar = (message) => {
    let x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = message;
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

const request = async (path, method = 'GET', body) => {
    const url = `http://localhost:3000${path}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body),
    }
    const response = await fetch(url, options);
    return {
        body: await response.json(),
        message: response.message,
        statusCode: response.statusCode,
    }
};