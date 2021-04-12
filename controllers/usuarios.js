const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosPost = async (req, res) => 
{

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña (Hash)
        // Crear el salt con el número de vueltas de encriptado (Default: 10)
    const salt = bcryptjs.genSaltSync();
        // Almacenarla en la instancia que creamos de Usuario
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.json
    ({
        usuario
    });
};

const usuariosGet = async(req = request, res = response) => 
{

    //const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // Forma 1: Funciona pero tarda un poquito más

    // const usuarios = await Usuario.find( query )
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments( query );

    // Forma 2: Óptima

    const [ total, usuarios ] = await Promise.all
    ([
        Usuario.countDocuments( query ),
        Usuario.find( query ).skip(Number(desde)).limit(Number(limite))
    ]);

    res.json
    ({
        total,
        usuarios
    });
};

const usuariosPut = async(req, res) => 
{
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO Validar contra base de datos
    if ( password )
    {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
};

const usuariosDelete = async( req, res = response ) =>
{

    const { id } = req.params;

    // Borrado físico
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });

    res.json( usuario );
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