import Joi, { AnySchema, ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class Plan extends Base {
  protected interval(): AnySchema {
    let schema = Joi.when('recurring', {
      is: true,
      then: Joi.string().valid('day', 'week', 'month', 'year').required(),
      otherwise: Joi.optional(),
    });

    return schema;
  }
  public getCheckoutPlanVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.plan = this.isString(true);
    schema.opt = this.isString(true);
    return Joi.object(schema);
  }
  public getCheckoutIconVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.id = this.id(true);
    schema.searchKeyword = this.isString(true);
    schema.isCopy = this.isBoolean(false);
    return Joi.object(schema);
  }
  public getSuccessPlanVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.session_id = this.isString(true);
    return Joi.object(schema);
  }
  public getCreateProductVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.name = this.isString(true);
    schema.price = this.isNumber(true);
    schema.currency = this.isString(true);
    schema.recurring = this.isBoolean(true);
    schema.interval = this.interval();
    schema.planName = this.isString(true);
    schema.priceName = this.isString(true);
    return Joi.object(schema);
  }
}
