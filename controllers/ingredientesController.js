const store = require("../data/store");
const { buscarIngrediente } = require("../helpers/ingredientesHelper");

function obtenerIngredientes(req, res) {
  res.json(store.ingredientes);
}

function crearIngrediente(req, res) {

  const { nombre, stock } = req.body;

  // TODO: validar nombre
  if(nombre.length == 0){
    return res.status(400).json({mensaje: "Se debe pasar un nombre y no debe estar vacío!"})
  }

  // TODO: validar stock numérico
  if(!Number.isInteger(stock)){
    res.status(400).json({mensaje: "El stock debe ser un número!"})
  }
  
  // TODO: validar stock >= 0
  if(stock < 0){
    return res.status(400).json({mensaje: "El stock debe ser mayor o igual a 0!"})
  }

  const nuevoIngrediente = {
    id: store.nextIngredienteId++,
    nombre: nombre,
    stock: Number(stock)
  };

  store.ingredientes.push(nuevoIngrediente);
  res.status(201).json({
    mensaje: "El ingrediente se ha creado correctamente!",
    ingrediente: {
      nombre: nuevoIngrediente.nombre,
      stock: nuevoIngrediente.stock
    },

    
  });
}

function actualizarIngrediente(req, res) {
  const ingrediente = buscarIngrediente(req.params.id);

  if (!ingrediente) {
    return res.status(404).json({ mensaje: "Ingrediente no encontrado" });
  }

  ingrediente.nombre = req.body.nombre;
  ingrediente.stock = Number(req.body.stock);

  return res.json(ingrediente);
}

function eliminarIngrediente(req, res) {
  store.ingredientes = store.ingredientes.filter(
    (ingrediente) => ingrediente.id !== Number(req.params.id)
  );

  res.json({ mensaje: "Ingrediente eliminado" });
}

module.exports = {
  obtenerIngredientes,
  crearIngrediente,
  actualizarIngrediente,
  eliminarIngrediente
};
