const Client = require('../../model/client');

const getAllClients = async (req, res) => {
    let clients = await Client.find();
    res.send(clients);
};


module.exports = {
    getAllClients,

}