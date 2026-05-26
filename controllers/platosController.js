const store = require("../data/store");
const {
  buscarPlato,
  normalizarIngredientesPlato,
  detallePlato
} = require("../helpers/platosHelper");

const { buscarIngrediente } = require("../helpers/ingredientesHelper");

function obtenerPlatos(req, res) {
  res.json(store.platos.map(detallePlato));
}

function crearPlato(req, res) {
  const { nombre, precio, ingredientes } = req.body;

  // TODO: validar nombre
  if(nombre.length == 0){
    return res.status(400).json({mensaje: "El nombre del plato no puede estar vacío!"})
  }

  // TODO: validar precio numérico y mayor que 0
  if(!Number.isInteger(precio)){
    return res.status(400).json({mensaje: "El precio debe ser un número!"})
  } else if(!precio > 0) {
    return res.status(400).json({mensaje: "El precio debe ser  mayor a 0!"})
  }

  // TODO: validar que ingredientes exista y sea un arreglo
  if(!ingredientes){
    return res.status(400).json({mensaje: "La lista de ingredientes debe pasarse!"})
  } else if(!Array.isArray(ingredientes)) {
    return res.status(400).json({mensaje: "Se debe agregar una lista de ingredientes!"})
  }

  // TODO: validar que ingredientes no esté vacío
  if(ingredientes.length == 0){
    return res.status(400).json({mensaje: "La lista de ingredientes debe tener elementos!"})
  }

  // TODO: validar que cada item tenga ingredienteId
  ingredientes.map((ingrediente) => {
    if(!ingrediente.ingredienteId){
      return res.status(400).json({mensaje: "Faltan id de ingredientes en la lista!"})
    }
  });

  // TODO: validar que cada ingredienteId exista
  ingredientes.map((ingrediente) => {
    if(!buscarIngrediente(ingrediente.ingredienteId)){
      return res.status(404).json({mensaje: "Un ingrediente no existe!"})
    }
  });

  // TODO: validar que cada cantidad sea numérica y mayor que 0
  ingredientes.map((ingrediente) => {
    if(!Number.isInteger(ingrediente.cantidad)){
      return res.status(400).json({mensaje: "La cantidad debe ser un número!"})
    } else if(!ingrediente.cantidad > 0){
      return res.status(400).json({mensaje: "La cantidad debe ser mayor a 0!"})
    }
  });


  const nuevoPlato = {
    id: store.nextPlatoId++,
    nombre: nombre,
    precio: Number(precio),
    ingredientes: normalizarIngredientesPlato(ingredientes)
  };

  store.platos.push(nuevoPlato);


  // TODO: Devolver el detalle de nuevoPlato usando la función detallePlato(), un 201 y un mensaje de éxito.
  res.status(201).json({
    mensaje: "Plato creado correctamente!",
    plato: {
      nombre: nuevoPlato.nombre,
      precio: nuevoPlato.precio,
      ingredientes: nuevoPlato.ingredientes.map((ingrediente) => {
        const ing = buscarIngrediente(ingrediente.ingredienteId)
        return {
          nombre: ing.nombre,
          cantidad: ingrediente.cantidad
        }
      })
    }
  })
}

function actualizarPlato(req, res) {
  const plato = buscarPlato(req.params.id);

  if (!plato) {
    return res.status(404).json({ mensaje: "Plato no encontrado" });
  }

  plato.nombre = req.body.nombre;
  plato.precio = Number(req.body.precio);
  plato.ingredientes = normalizarIngredientesPlato(req.body.ingredientes);

  return res.json(detallePlato(plato));
}

function eliminarPlato(req, res) {
  store.platos = store.platos.filter((plato) => plato.id !== Number(req.params.id));
  res.json({ mensaje: "Plato eliminado" });
}

module.exports = {
  obtenerPlatos,
  crearPlato,
  actualizarPlato,
  eliminarPlato
};
