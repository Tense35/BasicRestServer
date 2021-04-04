const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => 
{

    const { q, nombre, apikey, page = 1, limit } = req.query;

    res.json
    ({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey,
        page, 
        limit
    });
};

const usuariosPut = (req, res) => 
{
    const id = req.params.id;

    res.json
    ({
        msg: 'put API - Controlador',
        id
    });
};

const usuariosPost = (req, res) => 
{
    const { nombre, edad } = req.body;

    res.json
    ({
        msg: 'post API - Controlador',
        nombre, 
        edad
    });
};

const usuariosDelete = (req, res) =>
{
    res.json({
        msg: 'delete API - Controlador'
    });
};

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API'
    });
};

module.exports = 
{
    usuariosDelete,
    usuariosGet,
    usuariosPatch,
    usuariosPost,
    usuariosPut
}