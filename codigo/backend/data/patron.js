// Buscador de la pagina : convierte "texto" en "%texto%" (que contenga el texto en cualquier parte).
// Si alguien busca "%" o "_", se buscan como letras comunes.
function patronLike(texto) {
  return `%${texto.replace(/[\\%_]/g, (c) => '\\' + c)}%`;
}

module.exports = { patronLike };