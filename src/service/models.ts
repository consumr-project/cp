import models from '../record/models';
import connect from './dbms';

export var conn = connect();
export default models(conn);
