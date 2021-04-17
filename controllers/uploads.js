// Terceros
const cloudinary = require('cloudinary').v2
const { request, response } = require("express");
const path = require('path');
const fs = require('fs');

cloudinary.config( process.env.CLAUDINARY_URL );


// Propios
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async ( req = request, res = response ) => 
{

    try 
    {
        const extensiones = ['txt', 'md'];
        //const nombre = await subirArchivo( req.files, extensiones, 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        //const nombre = await subirArchivo( req.files );

        res.json
        ({
            nombre
        }); 
    } 
    catch (msg) 
    {
        res.status(400).json
        ({
            msg
        })
    }

    
    
}

const actualizarImagen = async ( req = request, res = response ) => 
{

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) 
    {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo )
            {
                return res.status(400).json 
                ({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }



        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo )
            {
                return res.status(400).json 
                ({
                    msg: `No existe un producto con el id ${ id }`
                })
            }


        break;
    
        default:
            return res.status(500).json
            ({
                msg: 'Se me olvidó validar esto'
            }); 
        break;
    }

    try 
    {
        // Limpiar imágenes previas
        if ( modelo.img )
        {
            // Hay que borrar la imagen del servisor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

            if ( fs.existsSync( pathImagen) )
            {
                fs.unlinkSync( pathImagen );
            }
        }

        // Guardar el archivo en la base de datos
        const nombre = await subirArchivo( req.files, undefined, coleccion );
        modelo.img = nombre;

        await modelo.save();

        res.json
        ({
            modelo
        }); 
    } 
    catch (msg) 
    {
        res.status(400).json
        ({
            msg
        })
    }

    res.json 
    ({
        id,
        coleccion
    })
}

const mostrarImagen = async(req = request, res = response ) => 
{
    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) 
    {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo )
            {
                return res.status(400).json 
                ({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo )
            {
                return res.status(400).json 
                ({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;
    
        default:
            return res.status(500).json
            ({
                msg: 'Se me olvidó validar esto'
            }); 
        break;
    }

    try 
    {
        // Limpiar imágenes previas
        if ( modelo.img )
        {
            // Hay que borrar la imagen del servisor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

            if ( fs.existsSync( pathImagen) )
            {
                return res.sendFile( pathImagen );
            }
        }

    } 
    catch (msg) 
    {
        res.status(400).json
        ({
            msg
        })
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg' );
    return res.sendFile( pathImagen );
}

const actualizarImagenClaudinary = async ( req = request, res = response ) => 
{

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) 
    {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo )
            {
                return res.status(400).json 
                ({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }



        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo )
            {
                return res.status(400).json 
                ({
                    msg: `No existe un producto con el id ${ id }`
                })
            }


        break;
    
        default:
            return res.status(500).json
            ({
                msg: 'Se me olvidó validar esto'
            }); 
        break;
    }

    try 
    {
        // Limpiar imágenes previas
        if ( modelo.img )
        {
            // Hay que borrar la imagen del servisor
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');

            await cloudinary.uploader.destroy( public_id );
        }

        // Obtener el path temporal del archivo enviado
        const { tempFilePath } = req.files.archivo;

        // Guardar el archivo en la base de datos

        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

        modelo.img = secure_url;

        await modelo.save();

        res.json
        ( modelo ); 
    } 
    catch (msg) 
    {
        res.status(400).json
        ({
            msg
        })
    }
}



module.exports = 
{
    actualizarImagen,
    actualizarImagenClaudinary,
    cargarArchivo,
    mostrarImagen
}