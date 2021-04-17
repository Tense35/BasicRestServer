// Terceros
const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

// Propios 
const { Usuario, Categoria, Producto  } = require('../models')

const coleccionesPermitidas = 
[
    'categorias',
    'productos',
    'roles',
    'usuarios'
]

const buscarUsuarios = async( termino = '', res = response ) => 
{
    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID )
    {
        const usuario = await Usuario.findById(termino);
        return res.json 
        ({
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    // Búsqueda independiente de mayúsculas/minúsculas

    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find
    ({  
        $or: [{ nombre: regex }, { correo: regex } ],
        $and: [{ estado: true }]
    });

    return res.json 
    ({
        results: usuarios
    })

}

const buscarCategorias = async( termino = '', res = response ) => 
{
    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID )
    {
        const categoria = await Categoria.findById(termino).populate('categoria', 'nombre');
        return res.json 
        ({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    // Búsqueda independiente de mayúsculas/minúsculas

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    return res.json 
    ({
        results: categorias 
    });
}

const buscarProductos = async( termino = '', res = response ) => 
{
    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID )
    {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json 
        ({
            results: ( producto ) ? [ producto ] : []
        });
    }

    // Búsqueda independiente de mayúsculas/minúsculas

    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ nombre: regex, estado: true });

    return res.json 
    ({
        results: productos
    })
}


const buscar = ( req = request, res = response ) => 
{
    const { coleccion, termino } =  req.params;

    if ( !coleccionesPermitidas.includes(coleccion) )
    {
        return res.status(400).json
        ({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch ( coleccion ) 
    {
        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;

        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        default:
        res.status(500).json 
        ({
            msg: 'Se me olvidó hacer esta búsqueda'
        })
    }

}

module.exports = 
{
    buscar
}