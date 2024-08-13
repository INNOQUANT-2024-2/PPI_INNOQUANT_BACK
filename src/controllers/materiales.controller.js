import bcrypt from "bcryptjs";
import oracledb from "oracledb";


/* base de datos */
const dbConfig = {
    user: "us_ppiReact",
    password: "0123",
    connectionString: "localhost/xe",
    stmtCacheSize: 0
};


export const test = (req, res) => {
  res.send('Bienvenido al test mat');
}

export const getMaterials = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT * FROM MATERIALES`,
            [], // Puedes pasar aquí los parámetros si es necesario
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT // Configurar para obtener un array de objetos
            }
        );
  
        console.log("materiales encontrados con éxito:", result.rows);
        res.json(result.rows); // Asegurarse de enviar solo las filas
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los materiales: ' + err.message });
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

export const createMaterials = async (req, res) => {
    const  { codigo_mat, nombre_mat,  precio_mat } = req.body;
    console.log("Datos recibidos",req.body);
  
    /* logica para crear usuario  */
  
    let connection;
  
    try {
      connection = await oracledb.getConnection(dbConfig);    
       // Inserción del usuario
       const insercion = await connection.execute(
          `INSERT INTO MATERIALES (CODIGO_MAT, NOMBRE_MAT, PRECIO_MAT) VALUES (:codigo_mat, :nombre_mat, :precio_mat)`,
          {
            codigo_mat,
            nombre_mat,
            precio_mat,
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

// Actualizar un material
export const updateMaterials = async (req, res) => {
  const { codigo_mat } = req.params;
  const { nombre_mat, precio_mat } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE MATERIALES
       SET NOMBRE_MAT = :nombre_mat,
           PRECIO_MAT = :precio_mat
       WHERE CODIGO_MAT = :codigo_mat`,
      { codigo_mat, nombre_mat, precio_mat },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).json({ message: 'Material no encontrado' });
    } else {
      res.json({ message: 'Material actualizado con éxito' });
    }
  } catch (err) {
    console.error('Error updating material:', err);
    res.status(500).json({ message: 'Error al actualizar el material: ' + err.message });
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

// Eliminar un material
export const deleteMaterials = async (req, res) => {
  const { codigo_mat } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM MATERIALES WHERE CODIGO_MAT = :codigo_mat`,
      { codigo_mat },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).json({ message: 'Material no encontrado' });
    } else {
      res.json({ message: 'Material eliminado con éxito' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el material: ' + err.message });
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