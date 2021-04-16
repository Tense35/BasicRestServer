// Terceros
const { response, request } = require('express');

// Propios
const { Usuario, Categoria } = require('../models');
const usuario = require('../models/usuario');

// Funciones

// Crear una categoría

const crearCategoria = async( req = request, res = response ) =>
{

    if ( !req.body.nombre )
    {
        return res.status(400).json
        ({
            msg: 'El nombre de la categoría es obligatorio.'
        });
    }

    const nombre = req.body.nombre.toUpperCase();

    try
    {
        // Revisar si existe la categoría
        const categoriaDB = await Categoria.findOne({ nombre });

        if ( categoriaDB )
        {
            return res.status(400).json
            ({
                msg: `La categoría ${ categoriaDB.nombre }, ya existe`
            });
        }

        // Generar la data a guardar
        const data = 
        {
            nombre,
            usuario: req.usuario._id
        }

        const categoria = await new Categoria( data );
        
        // Guardar en base de datos
        await categoria.save();

        res.status(201).json( categoria );
    }
    catch ( error )
    {
        console.log( error );
        return res.status(500).json
        ({
            msg: 'Contacta con el administrador'
        });
    }
    

}

// ObtenerCategorías - paginado - total - populate

const obtenerCategorias = async(req = request, res = response) => 
{

    const { limite = 10, desde = 0 } = req.params;
    const query = { estado:true };
    const populateQuery = 
    {
        path:'usuario',
        select: 'nombre'
    }

    try 
    {
        // Obtener el total de registros y las categorías
        const [ total, categorias ] = await Promise.all
        ([
            Categoria.countDocuments( query ),
            Categoria.find( query ).skip(Number(desde)).limit(Number(limite)).populate( populateQuery )
        ]);

        res.status(201).json
        ({
            total, 
            categorias
        })

    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json
        ({
            msg: 'Error del servidor - Contacte con el administrador'
        })
    }

}

// ObtenerCategoría - populate

const obtenerCategoria = async(req = request, res = response) => 
{

    const { id } = req.params;
    const populateQuery = 
    {
        path:'usuario',
        select: 'nombre'
    }

    try 
    {
        // Obtener el total de registros y las categorías
        const nombre = id.toUpperCase();
        const categoria = await Categoria.find({ nombre }).populate( populateQuery );

        res.status(201).json
        ({
            categoria
        })

    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json
        ({
            msg: 'Error del servidor - Contacte con el administrador'
        })
    }

}

// ActualizarCategoría - Recibe el nombre

const actualizarCategoria = async(req = request, res = response) =>
{

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    try 
    {
        const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

        res.json( categoria );
    }
    catch( error )
    {
        console.log(error);
        res.status(500).json
        ({
            msg: 'Error del servidor - Contacte con el administrador'
        })
    }
    
}

// BorrarCategoría - estado: false

const borrarCategoria = async ( req = request, res = response ) =>
{
    const { id } = req.params;

    try
    {
        const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true });

        res.json( categoriaBorrada );
    }
    catch (error)
    {
        console.log(error);
        res.status(500).json
        ({
            msg: 'Error del servidor - Contacte con el administrador'
        })
    }
    
}



module.exports = 
{
    actualizarCategoria,
    borrarCategoria,
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias
}