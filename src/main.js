const Schemas = {}; // populated with all Schemas

/**
 * @file **Reaction Schemas** - Use these methods to register and fetch Reaction Core schemas.
 * See {@link https://docs.reactioncommerce.com/reaction-docs/master/simple-schema full documentation}.
 *
 * @module collections
 */

/**
 * @name registerSchema
 * @method
 * @summary Register a schema. Adds schema to Schemas object.
 * @param {String} name The name of the schema to register.
 * @param {Array} schema Schema data.
 * @returns {void}
 */
export function registerSchema(name, schema) {
  if (typeof name !== "string") {
    throw new TypeError("A name string is required for the first arg of registerSchema");
  }

  if (typeof schema !== "object") {
    throw new TypeError("A schema object is required for the second arg of registerSchema");
  }

  // store the component in the table
  Schemas[name] = schema;
}

export { default as Validation } from "./validation";

export default Schemas;
