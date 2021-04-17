// Terceros
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => 
{

    return new Promise( (resolve, reject) => 
    {
        const { archivo } = files;

        // Obtener la extensión
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length-1 ];

        // Validar la extensión

        if ( !extensionesValidas.includes( extension ))
        {
            return reject(`La extensión ${ extension }, no es una extensión válida, ${ extensionesValidas }`);
        }


        // Asginarle un nombre único al archivo subido
        const nombreTemp = uuidv4() + '.' + extension;

        // Ruta donde se encuentra la carpeta que almacenará el archivo
        const uploadPath = path.join( __dirname + '/../uploads/', carpeta, nombreTemp );


        // Comprobación de existencia de errores y/o mensaje de éxito
        // mv = mover
        archivo.mv(uploadPath, (err) => 
        {
            if (err) 
            {
                return reject(err);
            }

            resolve( nombreTemp );
        });
    });
}

module.exports = 
{
    subirArchivo
}