import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class Role extends Base {
  public getCreateRoleVS(isUpdated: boolean): ObjectSchema {
    const schema: PartialSchemaMap = {};

    schema.name = this.isString(!isUpdated);
    if (isUpdated) {
      schema.id = this.id(true);
    }
    return Joi.object(schema);
  }
}
