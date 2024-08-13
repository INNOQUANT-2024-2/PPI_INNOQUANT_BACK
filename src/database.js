import oracle from 'oracledb';

const database = {
    user: "us_ppiReact",
    password: "0123",
    connectString: "localhost/XE"
}

export async function iniciardb(){
    
    try
    {
        const pool = await oracle.createPool(database);

        console.log('DB esta conectada');
        return pool;

    }catch(error)
    {
        console.log('Error en la conexión de la DB ',error)
    }

}

iniciardb();
export default iniciardb;