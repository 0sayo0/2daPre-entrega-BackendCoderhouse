const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb+srv://jonathansme01:Jonymaxter16@cluster0.g3e49py.mongodb.net/proyectoCH?retryWrites=true&w=majority');
    console.log('Conectado a la base de datos MongoDB');
  } catch (error) {
    console.error('Error al conectar a la base de datos MongoDB', error);
  }
}

module.exports = { connect };