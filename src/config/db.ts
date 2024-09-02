// Importa Mongoose para la conexión con MongoDB y dotenv para cargar variables de entorno
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno desde un archivo .env

// Define la cadena de conexión, utilizando una variable de entorno o un valor por defecto
const connectionString: string = process.env.MONGO_URL || "mongodb://localhost:27017/nodejs";

// Conecta a la base de datos MongoDB, mostrando un mensaje si tiene éxito o saliendo si hay un error
export const db = mongoose.connect(connectionString).then(() => {
    console.log("Connected to database");
}).catch((error) => {
    console.log(error);
    process.exit(1);
});
