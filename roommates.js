const axios = require("axios");
const { v4 } = require("uuid");
const fs = require("fs").promises;


const nuevoRoommates = () => {
  return new Promise((resolve,reject)=>{
      axios
      .get("https://randomuser.me/api")
      .then((respuesta) => {
        const roommates = respuesta.data.results[0];
        let roommate = {
          id: v4().slice(7),
          nombre: `${roommates.name.first} ${roommates.name.last}`,
        };
        resolve( roommate);
      })
      .catch((error) => {
        reject(error);
    });
  });  
};


const modificarRoommates = async (roommate) => {
  let roommatesJson =  JSON.parse(
    await fs.readFile(`${__dirname}/data/roommate.json`)
  );
  roommatesJson.roommates.push(roommate);
  await fs.writeFile(
    `${__dirname}/data/roommate.json`,
    JSON.stringify(roommatesJson, null, 4)
  );
};

module.exports = { nuevoRoommates, modificarRoommates };
