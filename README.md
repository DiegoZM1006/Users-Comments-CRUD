# Proyecto de Computación en Internet III

## Integrantes del Grupo

- **Juan David Patiño - A00381293**
- **Daniel Montezuma - A00382231**
- **Diego Fernando Mueses - A00382021**

## Descripción del Proyecto

Este proyecto se centra en la implementación de una API RESTful utilizando tecnologías modernas en el ecosistema de Node.js. A lo largo de su desarrollo, se abordaron conceptos como la autenticación, la gestión de usuarios y comentarios, y la estructuración de rutas de manera eficiente y segura. Además, se incluyó la implementación de comentarios anidados, permitiendo la creación de discusiones complejas.

## Configuración del Proyecto

Para garantizar un entorno de desarrollo consistente y eficiente, se emplearon diversos paquetes tanto para el entorno de producción como de desarrollo. A continuación, se detallan las dependencias utilizadas:

## Configuración de la Base de Datos y Puertos de Ejecución

Para configurar el proyecto, es necesario crear un archivo `.env` , al nivel de `src`. Este archivo debe contener las siguientes variables de entorno:

### Variables de Entorno

- **`PORT=3000`**: Define el puerto en el que la aplicación se ejecutará. En este caso, se utiliza el puerto `3000`. Puedes modificar este valor según las necesidades de tu entorno.

- **`MONGO_URL=mongodb+srv://admin:admin@cluster0.tccpibc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`**: Proporciona la URL de conexión a la base de datos MongoDB. Esta URL incluye las credenciales y el enlace al clúster donde se almacenan los datos. Asegúrate de proteger esta información y actualizarla si es necesario.

- **`JWT_SECRET=TMCDiegoZM`**: Especifica la clave secreta utilizada para la firma y verificación de los tokens JWT (JSON Web Tokens). Esta clave es crucial para garantizar la seguridad de los tokens y prevenir la falsificación.

### Modelado de Base de datos

- Se encuentra en la carpeta `/doc`.

### Test postman

- Los test de postman se encuentran en la carpeta `/doc`.

### Notas Adicionales

- **Seguridad**: No compartas el archivo `.env` en repositorios públicos ni en ningún otro lugar accesible para el público, ya que puede contener información sensible.

- **Gestión de Secretos**: En entornos de producción, considera usar herramientas de gestión de secretos para mantener tus variables de entorno seguras y protegidas.

Este archivo de configuración es esencial para el funcionamiento adecuado del proyecto, por lo que es importante que ajustes y mantengas estas variables de entorno según tus requisitos específicos.

### Dependencias de Producción

```json
"dependencies": {
    "bcrypt": "^5.1.1",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "mongoose": "^8.5.2",
    "nodeapp": "file:",
    "zod": "^3.23.8"
}
```

### Dependencias de Desarrollo

```json
"devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^22.1.0",
    "nodemon": "^3.1.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.4"
}
```

### Instalación

Para configurar el entorno de desarrollo, es necesario instalar todas las dependencias mencionadas. Esto se puede lograr utilizando el siguiente comando:

```bash
npm install
```

Este comando descargará y configurará automáticamente todos los paquetes necesarios para que el proyecto funcione correctamente.

## Ejecución del Proyecto

Para ejecutar el proyecto, siga estos pasos:

1. **Clonar el repositorio:** Obtenga una copia local del repositorio desde GitHub.
2. **Acceder al directorio:** Navegue hasta la carpeta donde clonó el repositorio.
3. **Abrir la terminal:** Inicie una terminal dentro de la carpeta del proyecto.
4. **Iniciar el servidor:** Ejecute el siguiente comando para iniciar el servidor en modo de desarrollo:

   ```bash
   npx yarn dev
   ```

> **Nota:** Si se encuentra con un error relacionado con paquetes no encontrados, puede ser necesario ejecutar nuevamente `npm install` para asegurarse de que todos los paquetes requeridos estén instalados.

## Funcionalidad del Proyecto

El proyecto abarca varias funcionalidades clave, organizadas en dos áreas principales: **gestión de usuarios** y **gestión de comentarios**. A continuación, se detalla cada una de estas áreas:

### Gestión de Usuarios

La gestión de usuarios se estructura en roles con diferentes niveles de acceso:

1. **Superadmin**:
   - **Permisos**: Puede modificar o eliminar usuarios. Tiene acceso completo para gestionar todos los aspectos relacionados con los usuarios en la aplicación.
2. **Usuario Regular**:
   - **Permisos**: Solo puede ver la lista de usuarios que están autenticados. No tiene permisos para modificar ni eliminar otros usuarios.

Estas funcionalidades están implementadas en el archivo `users.router.ts`, el cual se encargará de las rutas y operaciones relacionadas con la gestión de usuarios.

### Gestión de Comentarios

La gestión de comentarios es una parte integral del proyecto y ofrece varias funcionalidades:

- **Creación de Comentarios**: Los usuarios pueden crear nuevos comentarios.
- **Edición y Eliminación de Comentarios**: Los usuarios tienen la capacidad de editar o eliminar solo los comentarios que han creado. No pueden modificar o eliminar comentarios de otros usuarios.
- **Comentarios Anidados**: Los usuarios pueden responder a comentarios de otros usuarios o a sus propios comentarios, creando hilos de discusión similares a los de redes sociales como Twitter (ahora conocida como X).
- **Reacciones a Comentarios**: Los usuarios pueden reaccionar a los comentarios con opciones como Like, Dislike o Love, lo que fomenta una interacción más rica con el contenido.

### Middleware y Seguridad

Para asegurar la correcta ejecución de las operaciones y la protección de los datos, se utilizan diversos middleware:

- **Autorización de Acciones**: El middleware regula y verifica que solo los usuarios autorizados puedan realizar ciertas acciones. Por ejemplo, un usuario puede eliminar su propio comentario, pero no puede actualizar ni eliminar los comentarios de otros.
- **Autenticación con JWT**: Se emplea JSON Web Tokens (JWT) para autenticar a los usuarios y proteger las rutas y operaciones. Los tokens JWT proporcionan una capa adicional de seguridad al validar la identidad del usuario en cada solicitud.

Estas medidas garantizan que el sistema opere de manera segura y eficiente, respetando los permisos y protegiendo los datos de los usuarios.

### Rutas de Comentarios (`comments.router.ts`)

Estas rutas gestionan todas las operaciones relacionadas con los comentarios en la API:

- `GET /` - Obtener todos los comentarios.
- `POST /` - Crear un nuevo comentario.
- `PUT /:id` - Actualizar un comentario existente.
- `DELETE /:id` - Eliminar un comentario.

#### Reacciones a Comentarios

- `POST /:id/reactions` - Reaccionar a un comentario.
- `DELETE /:id/reactions/:reactionId` - Quitar una reacción de un comentario.

#### Comentarios Anidados

- `POST /:id/comments/:targetId` - Crear un comentario anidado.
- `PUT /:id/comments/:targetId` - Actualizar un comentario anidado.
- `DELETE /:id/comments/:targetId` - Eliminar un comentario anidado.

#### Reacciones a Comentarios Anidados

- `POST /:id/comments/:targetId/reactions` - Reaccionar a un comentario anidado.
- `DELETE /:id/comments/:targetId/reactions/:reactionId` - Quitar una reacción de un comentario anidado.

### Rutas de Usuarios (`users.router.ts`)

Estas rutas gestionan las operaciones relacionadas con los usuarios:

- `POST /login` - Iniciar sesión.
- `GET /` - Obtener todos los usuarios.
- `POST /` - Crear un nuevo usuario.
- `PUT /:id` - Actualizar un usuario existente.
- `DELETE /:id` - Eliminar un usuario.

---

### Resumen API RESTful

Claro, aquí tienes las rutas organizadas en dos tablas, una para `comments.router.ts` y otra para `users.router.ts`:

### Rutas de `comments.router.ts`

| NAME                    | PATH                                            | HTTP VERB | PURPOSE                     |
| ----------------------- | ----------------------------------------------- | --------- | --------------------------- |
| Get Comments            | `/`                                             | GET       | GET ALL COMMENTS            |
| Create Comment          | `/`                                             | POST      | CREATE A NEW COMMENT        |
| Update Comment          | `/:id`                                          | PUT       | UPDATE A COMMENT            |
| Delete Comment          | `/:id`                                          | DELETE    | DELETE A COMMENT            |
| React to Comment        | `/:id/reactions`                                | POST      | REACT TO A COMMENT          |
| Unreact Comment         | `/:id/reactions/:reactionId`                    | DELETE    | UNREACT TO A COMMENT        |
| Create Nested Comment   | `/:id/comments/:targetId`                       | POST      | CREATE A NESTED COMMENT     |
| Update Nested Comment   | `/:id/comments/:targetId`                       | PUT       | UPDATE A NESTED COMMENT     |
| Delete Nested Comment   | `/:id/comments/:targetId`                       | DELETE    | DELETE A NESTED COMMENT     |
| React to Nested Comment | `/:id/comments/:targetId/reactions`             | POST      | REACT TO A NESTED COMMENT   |
| Unreact Nested Comment  | `/:id/comments/:targetId/reactions/:reactionId` | DELETE    | UNREACT TO A NESTED COMMENT |

### Rutas de `users.router.ts`

| NAME        | PATH     | HTTP VERB | PURPOSE           |
| ----------- | -------- | --------- | ----------------- |
| Login       | `/login` | POST      | LOGIN             |
| Get Users   | `/`      | GET       | GET ALL USERS     |
| Create User | `/`      | POST      | CREATE A NEW USER |
| Update User | `/:id`   | PUT       | UPDATE A USER     |
| Delete User | `/:id`   | DELETE    | DELETE A USER     |

## Dificultades Encontradas

Una de las mayores dificultades que enfrentamos durante el desarrollo fue la implementación de hilos de discusión a través de comentarios anidados. Dado que los comentarios se almacenan de manera embebida, fue necesario desarrollar funciones recursivas para añadir, actualizar o eliminar comentarios hijos sin comprometer la integridad del comentario padre. Este enfoque presentó desafíos técnicos significativos, pero al final se logró una implementación funcional y eficiente.

## Conclusión

Este proyecto no solo reforzó nuestro conocimiento en el desarrollo de APIs RESTful, sino que también nos permitió explorar soluciones avanzadas para manejar estructuras de datos complejas, como los comentarios anidados. A pesar de los desafíos, el resultado es una API robusta y flexible que puede adaptarse a múltiples casos de uso en aplicaciones web modernas.
