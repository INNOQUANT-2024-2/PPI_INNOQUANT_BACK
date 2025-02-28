import app from './app.js';
import {iniciardb} from './database.js';


iniciardb()
app.listen(3002)
console.log('Server on port', 3002);

