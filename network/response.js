exports.success = (req, res, status, message) => {
    res.status(status || 200).send({
        error: '',
        body: message
    });
}

exports.error = (req, res, status, error, details) => {

    console.error("[Response Error]: ", details)

    res.status(status || 500).send({
        error: error,
        body: ''
    });
}