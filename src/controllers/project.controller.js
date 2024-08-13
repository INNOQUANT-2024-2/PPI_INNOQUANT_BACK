/* import bcrypt from "bcryptjs";
import oracledb from "oracledb"; */

/* base de datos */
/* const dbConfig = {
  user: "us_ppiReact",
  password: "0123",
  connectionString: "localhost/xe",
  stmtCacheSize: 0,
};
 */
// Obtener todos los proyectos
/* export const getProjects = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM PROYECTOS`,
      [], // Puedes pasar aquí los parámetros si es necesario
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT, // Configurar para obtener un array de objetos
      }
    );

    console.log("Proyecto encontrado con exito:", result.rows);
    res.json(result.rows); // Asegurarse de enviar solo las filas
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al obtener los proyectos: " + err.message });
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

//crear un proyecto
/* export const createProject = async (req, res) => {
  const { nombre_proyec, requerimiento_proyec, id_usu_pro } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Verificar que el usuario existe
    const userCheck = await connection.execute(
      `SELECT 1 FROM USUARIOS WHERE ID_USU = :id_usu_pro`,
      { id_usu_pro }
    );

    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no existe" });
    }

    //insertar nuevo proyecto
    const result = await connection.execute(
      `INSERT INTO PROYECTOS (ID_PROYEC, NOMBRE_PROYEC, REQUERIMIENTO_PROYEC,  ID_USU_PRO)
            VALUES (secuencia_proyectos_react.nextval, :nombre_proyec, :requerimiento_proyec, :id_usu_pro)`,
      {
        nombre_proyec,
        requerimiento_proyec,
        id_usu_pro,
      },
      { autoCommit: true }
    );
    res.status(201).json({ message: "Proyecto creado con éxito" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al crear el proyecto: " + err.message });
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

/* //Actualizar un proyecto
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { nombre_proyec, requerimiento_proyec, id_usu_pro } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE PROYECTOS
            SET NOMBRE_PROYEC = :nombre_proyec, REQUERIMIENTO_PROYEC = :requerimiento_proyec, ID_USU_PRO = :id_usu_pro
            WHERE ID_PROYEC = :id`,
      {
        id,
        nombre_proyec,
        requerimiento_proyec,
        id_usu_pro,
      },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).json({ message: "Proyecto no encontrado" });
    } else {
      res.json({ message: "Proyecto actualizado con éxito" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al actualizar el proyecto: " + err.message });
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

//Eliminar un proyecto
export const deleteProject = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM PROYECTOS WHERE ID_PROYEC = :id`,
      [id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).json({ message: "Proyecto no encontrado" });
    } else {
      res.json({ message: "Proyecto eliminado con éxito" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al eliminar el proyecto: " + err.message });
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
