// Terceros
const { response, request } = require('express');

// Propios
const { Usuario, Categoria, Producto } = require('../models');

// Funciones

const crearProducto = async( req = request, res = response ) =>
{
    const { nombre, estado, precio, categoria, desc, disponible } = req.body;

    console.log('----------------------------');
    console.log( req.body );
    console.log('----------------------------');

    try
    {
        // Generar la data a guardar
        const data = 
        {
            nombre: (nombre.toUpperCase()),
            estado,
            usuario: req.usuario._id,
            precio,
            categoria, 
            desc, 
            disponible
        }

        const producto = await new Producto( data );
        
        // Guardar en base de datos
        await producto.save();

        res.status(201).json( producto );
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

// obtenerProductos - paginado - total - populate

const obtenerProductos = async( req = request, res = response ) => 
{

    const { limite = 10, desde = 0 } = req.params;
    const query = { estado:true };

    try 
    {
        // Obtener el total de registros y las categorías
        const [ total, productos ] = await Promise.all
        ([
            Producto.countDocuments( query ),
            Producto.find( query )
                .skip(Number(desde))
                .limit(Number(limite))
                .populate( 'usuario', 'nombre' )
        ]);

        res.status(201).json
        ({
            total, 
            productos
        });

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

// ObtenerProducto - populate

const obtenerProducto = async(req = request, res = response) => 
{

    const { id } = req.params;

    const populateQuery = 
    [
        {
            path:'usuario',
            select: 'nombre'
        },
        {
            path:'categoria',
            select: 'nombre'
        }
    ]

    try 
    {
        const producto = await Producto.findById( id ).populate( populateQuery );

        res.status(201).json
        ({
            producto
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

const actualizarProducto = async(req = request, res = response) =>
{

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    try 
    {
        if ( data.nombre )
        {
            data.nombre = data.nombre.toUpperCase();
        }
        data.usuario = req.usuario._id;

        const producto = await Producto.findByIdAndUpdate( id, data, { new: true } );

        res.json( producto );
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

const borrarProducto = async ( req = request, res = response ) =>
{
    const { id } = req.params;

    try
    {
        const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true });

        res.json( productoBorrado );
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
    actualizarProducto,
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    borrarProducto
}