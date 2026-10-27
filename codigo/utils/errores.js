// Una regla del club que no se cumple (por ej: DNI repetido en el grupo).
class ErrorDeNegocio extends Error {}

// Un dato mal, que solo se sabe mirando la base (por ej: el profesor indicado no existe). 
class ErrorDeDatos extends Error {}

module.exports = { ErrorDeNegocio, ErrorDeDatos };