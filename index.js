const express = require("express");
const app = express();
app.listen(3000, () => console.log("Servidor activo http://localhost:3000"));
const fs = require("fs").promises;

const { nuevoRoommates, modificarRoommates } = require("./roommates.js");

app.use(express.json());

app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/index.html`);
});

app.post("/roommate", async (request, response) => {
  try {
    response.setHeader("content-type", "application/json");
    const roommate = await nuevoRoommates();
    await modificarRoommates(roommate);
    response.json({ message: "Roommate agregado exitosamente" }).status(201);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

app.get("/roommates", (request, response) => {
  response.sendFile(`${__dirname}/data/roommate.json`);
});

app.get("/gastos", (request, response) => {
  response.sendFile(`${__dirname}/data/gastos.json`);
});

app.post("/gasto", async (request, response) => {
  try {
    response.setHeader("content-type", "application/json");
    let { roommate, descripcion, monto } = request.body;
    let nuevoGasto = { roommate, descripcion, monto };
    let gastos = JSON.parse(await fs.readFile(`${__dirname}/data/gastos.json`));
    gastos.gastos.push(nuevoGasto);
    await fs.writeFile(
      `${__dirname}/data/gastos.json`,
      JSON.stringify(gastos, null, 4),
      "utf8"
    );
    response.json({ message: "Gasto registrado exitosamente" }).status(201);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

app.put("/gasto", async (request, response) => {
  try {
    response.setHeader("content-type", "application/json");
    let { roommate, descripcion, monto,id } = request.body;
    let gastos = JSON.parse(await fs.readFile(`${__dirname}/data/gastos.json`));
    gastos.gastos.map((gasto) => {
      if (gasto.id == id) {
        gasto.roommate = roommate;
        gasto.descripcion = descripcion;
        gasto.monto = monto;
      }
      return roommate;
    });
    await fs.writeFile(`${__dirname}/data/gastos.json`,JSON.stringify(gastos, null, 4));
    response.json({ message: "Gasto registrado exitosamente" }).status(201);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});
