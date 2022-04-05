//Dependencias

const express = require("express");
const app = express();
app.listen(3000, () => console.log("Servidor activo http://localhost:3000"));
const fs = require("fs").promises;
const { v4 } = require("uuid");
const { nuevoRoommates, modificarRoommates } = require("./roommates.js");
const enviar = require('./correo.js');
const res = require("express/lib/response");
app.use(express.json());

//Mostrar archivo html

app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/index.html`);
  });


//Agregar nuevo Roommate

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

//Mostrar listado de roommates con sus respectivas cuentas

app.get("/roommates", async (request, response)=>{
  try {
    response.setHeader("content-type", "application/json");
  const dataGasto = JSON.parse(await fs.readFile(`${__dirname}/data/gastos.json`));
  const dataRoommates = JSON.parse(await fs.readFile(`${__dirname}/data/roommate.json`));
  let cantidadRoommates = dataRoommates.roommates.length;  
  const debeRoommates = (dataGasto.gastos.map(item => item.monto).reduce((acum, costo) => acum + costo, 0)) / cantidadRoommates;   
  
  dataRoommates.roommates.map((roommate)=>{
    roommate.debe = debeRoommates

    return roommate
  });

  dataGasto.gastos.map((aporte)=>{  
    let indice= dataRoommates.roommates.findIndex((roommate)=>roommate.nombre == aporte.roommate);      

    dataRoommates.roommates[indice].debe-= (aporte.monto)/cantidadRoommates;
      if (dataRoommates.roommates[indice].recibe) {     
        dataRoommates.roommates[indice].recibe += aporte.monto/cantidadRoommates;
      } else {      
        dataRoommates.roommates[indice].recibe = aporte.monto/cantidadRoommates;
      }    
    });
      
    response.json(dataRoommates).status(200);

  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
  
});

//Envio de archivo gastos 

app.get("/gastos", (request, response) => {
  response.sendFile(`${__dirname}/data/gastos.json`);
});

//Agregar nuevo gasto

app.post("/gasto", async (request, response) => {
  try {
    response.setHeader("content-type", "application/json");
    let { roommate, descripcion, monto } = request.body;
    const id = v4().slice(7);
      if (!descripcion || !monto) {
            response.json({ message: "complete los datos para agregar el gasto" })
      } else {
        let nuevoGasto = { id, roommate, descripcion, monto };
          let gastos = JSON.parse(await fs.readFile(`${__dirname}/data/gastos.json`));
          gastos.gastos.push(nuevoGasto);
          await fs.writeFile(
            `${__dirname}/data/gastos.json`,
            JSON.stringify(gastos, null, 4),
            "utf8"
          );
          response.json({ message: "Gasto registrado exitosamente" }).status(201);
      }    
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

//Editar gasto

app.put("/gasto", async (request, response) => {
  try {
    response.setHeader("content-type", "application/json");
    let { roommate, descripcion, monto, id } = request.body;
        if (!descripcion || !monto) {
          response.json({ message: "complete los datos para editar el gasto" })
      }else {
        let gastos = JSON.parse(await fs.readFile(`${__dirname}/data/gastos.json`));
        gastos.gastos.map((gasto) => {
          if (gasto.id == id) {        
            gasto.descripcion = descripcion;
            gasto.monto = monto;
          }
          return roommate;
        });
        await fs.writeFile(`${__dirname}/data/gastos.json`,JSON.stringify(gastos, null, 4));
        response.json({ message: "Gasto registrado exitosamente" }).status(201);
      }
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

//Eliminacion de gastos

app.delete("/gasto",async (request,response)=>{
  try {
    response.setHeader("content-type", "application/json");
    const id = request.query.id   
    let data = JSON.parse(await fs.readFile(`${__dirname}/data/gastos.json`));    
    let index = data.gastos.findIndex((gasto)=> id == gasto.id)   
    data.gastos.splice(index,1);     
     await fs.writeFile(`${__dirname}/data/gastos.json`,JSON.stringify(data, null, 4));
    response.json({ message: "Gasto eliminado exitosamente" }).status(200);

  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

//Envio de correos

app.get('/enviar', async (request, response)=>{
  try {
    let correos = ['betsytoyo23@gmail.com','betsy_toyo@hotmail.com'];
    let asunto = "Prueba modulo 6 aplicaciones con Node.Js"
    let contenido = "<h3>Prueba Roommates - Desarrollo de aplicaciones web Node Express</h3>"

    await enviar(correos, asunto, contenido);
    response.json({message: 'Correo enviado exitosamente'}).status(200);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  };  
});
