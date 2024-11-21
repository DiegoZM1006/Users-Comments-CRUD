import mongoose from 'mongoose';

// Interfaz que define la estructura de entrada para un usuario
export interface UserInput {
    name: string;      // Nombre del usuario
    email: string;     // Correo electrónico del usuario
    password: string;  // Contraseña del usuario
    role: string;      // Rol del usuario (por ejemplo, admin, usuario)
}

// Enumeración para los tipos de reacciones
export enum TypeReaction {
    like = 'like',     // Reacción de "me gusta"
    dislike = 'dislike', // Reacción de "no me gusta"
    love = 'love',     // Reacción de "amor"
}

// Interfaz que define la estructura de una reacción de usuario
export interface UserReaction {
    id: string;        // ID de la reacción
    userId: string;    // ID del usuario que hizo la reacción
    type: TypeReaction; // Tipo de reacción (usando la enumeración TypeReaction)
}

// Interfaz que extiende UserInput para incluir propiedades adicionales de un documento de Mongoose
export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;   // Fecha de creación del documento
    updatedAt: Date;   // Fecha de última actualización del documento
    deletedAt: Date;   // Fecha de eliminación del documento (si aplica)
}

// Esquema de Mongoose para el documento de usuario
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },    // Nombre, obligatorio
    email: { type: String, required: true, index: true, unique: true }, // Correo electrónico, obligatorio, único y indexado
    password: { type: String, required: true }, // Contraseña, obligatoria
    role: { type: String, required: true },     // Rol, obligatorio
}, { timestamps: true, collection: 'users' }); // Timestamps para fechas de creación y actualización, colección 'users'

// Creación del modelo de Mongoose para el usuario
const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;
