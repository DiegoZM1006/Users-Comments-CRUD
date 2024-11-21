# Proyecto de Computación en Internet III

## Integrantes del Grupo

- **Juan David Patiño - A00381293**
- **Daniel Montezuma - A00382231**
- **Diego Fernando Mueses - A00382021**

## Descripción del Proyecto


## Configuración del Proyecto

Para garantizar un entorno de desarrollo consistente y eficiente, se emplearon diversos paquetes tanto para el entorno de producción como de desarrollo. A continuación, se detallan las dependencias utilizadas:

## Configuración de la Base de Datos y Puertos de Ejecución

Para configurar el proyecto, es necesario crear un archivo `.env` , al nivel de `src`. Este archivo debe contener las siguientes variables de entorno:

### Variables de Entorno

- **`PORT=3000`**: Define el puerto en el que la aplicación se ejecutará. En este caso, se utiliza el puerto `3000`. Puedes modificar este valor según las necesidades de tu entorno.

- **`MONGO_URL=mongodb+srv://admin:admin@cluster0.tccpibc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`**: Proporciona la URL de conexión a la base de datos MongoDB. Esta URL incluye las credenciales y el enlace al clúster donde se almacenan los datos. Asegúrate de proteger esta información y actualizarla si es necesario.

- **`JWT_SECRET=TMCDiegoZM`**: Especifica la clave secreta utilizada para la firma y verificación de los tokens JWT (JSON Web Tokens). Esta clave es crucial para garantizar la seguridad de los tokens y prevenir la falsificación.

### Notas Adicionales

- **Seguridad**: No compartas el archivo `.env` en repositorios públicos ni en ningún otro lugar accesible para el público, ya que puede contener información sensible.

- **Gestión de Secretos**: En entornos de producción, considera usar herramientas de gestión de secretos para mantener tus variables de entorno seguras y protegidas.

Este archivo de configuración es esencial para el funcionamiento adecuado del proyecto, por lo que es importante que ajustes y mantengas estas variables de entorno según tus requisitos específicos.


### Dependencias de Producción

```json
"dependencies": {
    "@apollo/server": "^4.11.2",
    "bcrypt": "^5.1.1",
    "compunet-3": "file:",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "mongoose": "^8.5.2",
    "yarn": "^1.22.22",
    "zod": "^3.23.8"
}
```

### Dependencias de Desarrollo

```json
"devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^22.0.2",
    "nodemon": "^3.1.4",
    "ts-node": "^10.9.2",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3"
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
   npm run dev
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

---

### Algunas Consultas

### **Usuarios**
1. Obtener un usuario por ID:
   ```graphql
   query {
     getUser(id: "673e8a32d4c6f1d3fd573ff6") {
       id
       name
       email
       role
     }
   }
   ```

2. Obtener todos los usuarios:
   ```graphql
   query {
     getUsers {
       id
       name
       email
       role
     }
   }
   ```

### **Comentarios**
1. Obtener todos los comentarios:
   ```graphql
   query {
     getComments {
       id
       content
       author
       createdAt
     }
   }
   ```

2. Obtener un comentario por ID:
   ```graphql
   query {
     getCommentById(id: "673ea7b96bda5fd8da81e431") {
       id
       content
       author
       reply {
         id
         content
       }
     }
   }
   ```

---

## **Mutaciones principales**

### **Usuarios**
1. Crear usuario:
   ```graphql
   mutation {
     createUser(input: {
       name: "Juan Perez"
       email: "juan@example.com"
       password: "securepassword"
       role: "user"
     }) {
       id
       name
       email
       role
     }
   }
   ```

2. Iniciar sesión:
   ```graphql
   mutation {
     login(input: {
       email: "juan@example.com"
       password: "securepassword"
     }) {
       token
       name
       role
     }
   }
   ```

### **Comentarios**
1. Crear comentario:
   ```graphql
   mutation {
  createComment(input: {
    content: "Este es un comentario de prueba2"
    author: "id_usuario"
    reply: [] 
    reaction: []   
  }) {
    id
    content
    author
    createdAt
  }
   ```

2. Responder a un comentario:
   ```graphql
   mutation {
  addReplyToComment(commentId: "id_comentario", input: {
    content: "Esta es una respuesta al comentario."
    author: "id_autor" 
  }) {
    id
    content
    reply {
      id
      content
      author
      createdAt
    }
  }
   }
   ```



   2. Reaccionar a un comentario:
   ```graphql
   mutation {
    reactToComment(commentId: "id_comentario", input: {
      userId: "12345" # ID del usuario que está reaccionando
      type: "like"    # Tipo de reacción (p. ej., "like", "love", "dislike")
    }) {
      id
      content
      reaction {
        id
        userId
        type
      }
    }
  }
   ```

---


## Dificultades Encontradas

1. **Validaciones complejas**: Implementar validaciones como la verificación de autoría en comentarios anidados fue desafiante.
2. **Autorización**: Gestionar los permisos en base a roles y garantizar que ciertas mutaciones solo puedan ser ejecutadas por usuarios con privilegios específicos.
3. **Optimización**: El manejo de comentarios anidados y sus reacciones demandó ajustes para evitar sobrecargar la base de datos.
4. **Implementación inicial con GraphQL**: Enfrentar la implementación de una API GraphQL desde cero fue desafiante, debido al poco conocimiento previo del equipo en esta tecnología. Este reto implicó aprender y aplicar conceptos como resolvers, esquemas, y validaciones específicas de GraphQL.

## Conclusión

El proyecto destacó por un desarrollo colaborativo eficiente, donde roles claros permitieron implementar funcionalidades robustas como la gestión de usuarios, comentarios anidados y reacciones. La configuración segura con herramientas como `dotenv` y la integración de JWT garantizó un sistema protegido y funcional. A pesar de la falta de experiencia inicial con GraphQL, el equipo superó desafíos técnicos, adquiriendo conocimientos clave y sentando una base sólida para futuras mejoras, como la implementación de paginación, pruebas automatizadas y un manejo más avanzado de errores. La experiencia demuestra capacidad de adaptación y crecimiento frente a nuevas tecnologías.

