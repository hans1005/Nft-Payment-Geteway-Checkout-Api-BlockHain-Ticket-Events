const Role = require("../models/Role");
const Categories = require("../models/Categories");

const createRoles = async () => {
  // apenas carge la app, crea en la db
  try {
    const count = await Role.estimatedDocumentCount(); // se fija si ya existen roles (documentos) en la db,

    if (count > 0) return; // si es mayor a 0, significa que hay roles.

    const values = await Promise.all([
      // sino hay ningun rol, los crea.
      new Role({ name: "user" }).save(),
      new Role({ name: "admin" }).save(),
      new Role({ name: "moderator" }).save(),
    ]);
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

const createCategories = async () => {
  // apenas carge la app, crea en la db
  try {
    const count = await Categories.estimatedDocumentCount(); // se fija si ya existen roles (documentos) en la db,

    if (count > 0) return; // si es mayor a 0, significa que hay roles.

    const values = await Promise.all([
      // sino hay ningun rol, los crea.
      new Categories({ name: "funny" }).save(),
      new Categories({ name: "Animals" }).save(),
      new Categories({ name: "Sport" }).save(),
      new Categories({ name: "Music" }).save(),
      new Categories({ name: "Cute" }).save(),
      new Categories({ name: "Abstract art" }).save(),
      new Categories({ name: "Utopy" }).save(),
    ]);
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};
//holiss

module.exports = { createRoles, createCategories };

