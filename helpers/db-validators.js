const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');

const esRoleValido = async( rol = '' ) => 
{
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol )
    {
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }
}

const emailExiste = async( correo = '' ) =>
{
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail )
    {
        throw new Error(`El correo ${ correo } ya se encuentra registrado en la base de datos`);
    }
}

const existeUsuarioPorId = async( id ) =>
{
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario )
    {
        throw new Error(`El id ${ id } no existe en la base de datos`);
    }
}

// Categorías

const noExisteCategoriaPorNombre = async ( categoria ) => 
{
    categoria = categoria.toUpperCase();
    const query = { nombre: categoria };
    
    const existeCat = await Categoria.find( query );

    if ( existeCat.length === 0 )
    {
        throw new Error(`La categoría ${ categoria } no existe en la base de datos.`);
    }
    
}

const noExisteCategoria = async ( categoria ) => 
{
    
    const existeCat = await Categoria.findById( categoria );

    if ( !existeCat )
    {
        throw new Error(`La categoría ${ categoria } no existe en la base de datos.`);
    }
    
}

// Productos

const existeProducto = async( producto ) =>
{
    if ( !producto )
    {
        throw new Error('El nombre es obligatorio');
    }

    producto = producto.toUpperCase();
    query = { nombre: producto }
    const existeProducto = await Producto.find( query );

    if ( existeProducto.length > 0 )
    {
        throw new Error(`El producto ${ producto } ya existe en la base de datos.`);
    }
}

const existeProductoPorId = async( producto ) => 
{
    const existeProducto = await Producto.findById( producto );

    if ( !existeProducto )
    {
        throw new Error(`El producto ${ producto } no existe en la base de datos.`);
    }

}

// Validar colecciones permitidas

const coleccionesPermitidas = ( coleccion = '', colecciones = []) =>
{

    const incluida = colecciones.includes( coleccion );
    if ( !incluida )
    {
        throw new Error(`La colección ${ coleccion }, no es permitida, ${ colecciones }`);
    }

    return true;
}

module.exports = 
{
    coleccionesPermitidas,
    emailExiste,
    esRoleValido,
    existeProducto,
    existeProductoPorId,
    existeUsuarioPorId,
    noExisteCategoria,
    noExisteCategoriaPorNombre,
}