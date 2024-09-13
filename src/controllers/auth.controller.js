import bcrypt from "bcryptjs";
import oracledb from "oracledb";
import jwt from "jsonwebtoken";
const SECRET_KEY = 'your_secret_key'
import {validateToken} from "../middlewares/validateToken.js";

/* funciones */
/* async function getUserById(userId) {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "us_ppiReact",
            password: "0123",
            connectionString: "localhost/xe",
            stmtCacheSize: 0,
          });
        const result = await connection.execute(
            `SELECT id, nombre_usu, apellido1_usu, apellido2_usu, rol_usu
             FROM users
             WHERE id = :id`,
            [userId]
        );

        return result.rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
} */


/* base de datos */
const dbConfig = {
    user: "us_ppiReact_3n",
    password: "123",
    connectionString: "localhost/xe",
    stmtCacheSize: 0
};


/* rutas */
export const home = (req, res) => {
    res.send('Bienvenido a la API de autenticación');
}


export const getUsers = async (req, res) => {
  let connection;
  try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
          `SELECT * FROM USUARIOS`,
          [], // Puedes pasar aquí los parámetros si es necesario
          {
              outFormat: oracledb.OUT_FORMAT_OBJECT // Configurar para obtener un array de objetos
          }
      );

      console.log("Usuarios encontrados con éxito:", result.rows);
      res.json(result.rows); // Asegurarse de enviar solo las filas
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener los usuarios: ' + err.message });
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (err) {
              console.error(err);
          }
      }
  }
};

export const createUser = async (req, res) => {
  const  { identificacion_usu, nombre_usu, apellido1_usu, apellido2_usu, rol_usu, contra_usu } = req.body;
  console.log("Datos recibidos",req.body);

  /* logica para crear usuario  */

  let connection;

  try {
    const passwordHash = await bcrypt.hash(contra_usu, 10);
    connection = await oracledb.getConnection(dbConfig);    
     // Inserción del usuario
     const insercion = await connection.execute(
        `INSERT INTO USUARIOS (ID_USU, IDENTIFICACION_USU, NOMBRE_USU, APELLIDO1_USU, APELLIDO2_USU, CONTRA_USU, CODIGO_ROL_USU)
        VALUES (secuencia_usuarios_react_3n.nextval, :identificacion_usu, :nombre_usu,  :apellido1_usu, :apellido2_usu, :contra_usu, :rol_usu)`,
        {
          identificacion_usu,
          nombre_usu,
          apellido1_usu,
          apellido2_usu,
          contra_usu: passwordHash,
          rol_usu
        },
        { autoCommit: true }
      );
      console.log("Usuario creado con éxito:", insercion);

  res.status(201).json({ message: 'Usuario creado con éxito' });
  console.log('Usuario creado con éxito');
} catch (err) {
  console.error(err);
  res.status(500).json({ exito: false, mensaje: 'Error al crear el usuario: ' + err.message });
} finally {
  if (connection) {
    try {
      await connection.close();
    } catch (err) {
      console.error(err);
    }
  }
}

  console.log(req.body);

  /* res.send('Registrando'); */
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre_usu, apellido1_usu, apellido2_usu, rol_usu, contra_usu } = req.body;
  let connection;
  try {
    const passwordHash = await bcrypt.hash(contra_usu, 10);
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE USUARIOS
       SET NOMBRE_USU = :nombre_usu,
           APELLIDO1_USU = :apellido1_usu,
           APELLIDO2_USU = :apellido2_usu,
           CONTRA_USU = :contra_usu,
           CODIGO_ROL_USU = :rol_usu
       WHERE ID_USU = :id`,
      {
        id,
        nombre_usu,
        apellido1_usu,
        apellido2_usu,
        contra_usu: passwordHash,
        rol_usu
      },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario actualizado con éxito' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Error updating user' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
          `DELETE FROM USUARIOS WHERE ID_USU = :id`,
          [id],
          { autoCommit: true }
      );
      if (result.rowsAffected === 0) {
          res.status(404).json({ message: 'Usuario no encontrado' });
      } else {
          res.json({ message: 'Usuario eliminado con éxito' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el usuario: ' + err.message });
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (err) {
              console.error(err);
          }
      }
  }
};

export const loginUser = async (req, res) => {
  const { nombre_usu, contra_usu } = req.body;
  let connection;

  try {
      // Conexión a la base de datos Oracle
      connection = await oracledb.getConnection(dbConfig);

      // Consulta para encontrar al usuario por nombre de usuario
      const userQuery = await connection.execute(
          `SELECT ID_USU, NOMBRE_USU, APELLIDO1_USU, APELLIDO2_USU, CONTRA_USU, CODIGO_ROL_USU
           FROM USUARIOS
           WHERE NOMBRE_USU = :nombre_usu`,
          { nombre_usu }
      );

      // Verificar si el usuario fue encontrado
      if (userQuery.rows.length === 0) {
          return res.status(400).json({ message: "Usuario no encontrado" });
      }

      // Extraer datos del usuario encontrado
      const userFound = userQuery.rows[0];
      const user = {
          id: userFound[0],
          nombre_usu: userFound[1],
          apellido1_usu: userFound[2],
          apellido2_usu: userFound[3],
          contra_usu: userFound[4],
          rol_usu: userFound[5]
      };
      console.log(user);

      // Comparar la contraseña ingresada con la almacenada
      const isMatch = await bcrypt.compare(contra_usu, user.contra_usu);

      if (!isMatch) {
          return res.status(400).json({ message: "Contraseña incorrecta" });
      }

      // Generar un token JWT
      const token = jwt.sign(
          {
              id: user.id,
              nombre_usu: user.nombre_usu,
              apellido1_usu: user.apellido1_usu,
              apellido2_usu: user.apellido2_usu,
              rol_usu: user.rol_usu
          },
          SECRET_KEY,
          { expiresIn: '1h' } // El token expira en 1 hora
      );

      // Responder con el token y los datos del usuario autenticado
      res.json({
          token,
          user: {
              id: user.id,
              nombre_usu: user.nombre_usu,
              apellido1_usu: user.apellido1_usu,
              apellido2_usu: user.apellido2_usu,
              rol_usu: user.rol_usu
          }
      });
      console.log(token, user);
      console.log("Usuario autenticado con éxito y token generado");
  } catch (err) {
      console.error(err);
      res.status(500).send({ exito: false, mensaje: "Error al autenticar el usuario" });
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (err) {
              console.error(err);
          }
      }
  }
};

/* export const login = async (req, res) => {
    const { nombre_usu, contra_usu } = req.body;
  
    let connection;
  
    try {
      // Conexión a la base de datos Oracle
      connection = await oracledb.getConnection({
        user: 'us_ppi',
        password: '123',
        connectionString: 'localhost/xe',
        stmtCacheSize: 0,
      });
  
      // Consulta para encontrar al usuario por nombre de usuario
      const userQuery = await connection.execute(
        `SELECT ID_USU, NOMBRE_USU, APELLIDO1_USU, APELLIDO2_USU, CONTRA_USU, CODIGO_ROL_USU
         FROM USUARIOS
         WHERE NOMBRE_USU = :nombre_usu`,
        { nombre_usu }
      );
  
      // Verificar si el usuario fue encontrado
      if (userQuery.rows.length === 0) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }
  
      // Extraer datos del usuario encontrado
      const userFound = userQuery.rows[0];
      const user = {
        id: userFound[0],
        nombre_usu: userFound[1],
        apellido1_usu: userFound[2],
        apellido2_usu: userFound[3],
        contra_usu: userFound[4],
        rol_usu: userFound[5]
      };
  
      // Comparar la contraseña ingresada con la almacenada
      const isMatch = await bcrypt.compare(contra_usu, user.contra_usu);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }
  
      // Responder con los datos del usuario autenticado
      res.json({
        id: user.id,
        nombre_usu: user.nombre_usu,
        apellido1_usu: user.apellido1_usu,
        apellido2_usu: user.apellido2_usu,
        rol_usu: user.rol_usu,
      });
      console.log("Usuario encontrado con éxito");
    } catch (err) {
      console.error(err);
      res.status(500).send({ exito: false, mensaje: "Error al autenticar el usuario" });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
}; */

/* export const profile = async (req, res) => {
    try {
        const userFound = await getUserById(req.user.id);

        if (!userFound) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        return res.json({
            id: userFound.ID,
            nombre_usu: userFound.NOMBRE_USU,
            apellido1_usu: userFound.APELLIDO1_USU,
            apellido2_usu: userFound.APELLIDO2_USU,
            rol_usu: userFound.ROL_USU
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}; */

/* const login2 = async (req, res) => {
    const { nombre_usu, contra_usu } = req.body;
    let connection;
  
    try {
      // Establecer la conexión a la base de datos
      connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING
      });
  
      // Buscar el usuario en la base de datos
      const result = await connection.execute(
        `SELECT ID, NOMBRE_USU, APELLIDO1_USU, APELLIDO2_USU, CONTRA_USU, ROL_USU 
         FROM USUARIOS 
         WHERE NOMBRE_USU = :nombre_usu`,
        { nombre_usu }
      );
  
      // Verificar si se encontró el usuario
      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }
  
      const userFound = result.rows[0];
      const userObject = {
        id: userFound[0],
        nombre_usu: userFound[1],
        apellido1_usu: userFound[2],
        apellido2_usu: userFound[3],
        contra_usu: userFound[4],
        rol_usu: userFound[5]
      };
  
      // Comparar la contraseña encriptada
      const isMatch = await bcrypt.compare(contra_usu, userObject.contra_usu);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }
  
      res.json({
        message: "Usuario encontrado con éxito",
        user: {
          id: userObject.id,
          nombre_usu: userObject.nombre_usu,
          apellido1_usu: userObject.apellido1_usu,
          apellido2_usu: userObject.apellido2_usu,
          rol_usu: userObject.rol_usu
        }
      });
      console.log("Usuario encontrado con éxito");
    } catch (err) {
      console.error(err);
      res.status(500).send({ exito: false, mensaje: "Error al iniciar sesión" });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
    console.log(req.body);
}; */
  
