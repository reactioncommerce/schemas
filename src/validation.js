/*
 * @name luhnValid
 * @method
 * @memberOf Helpers
 * @summary Checks if a number passes Luhn's test
 * @param {String} cardNumber The card number to check
 * @returns {Boolean} The result of the test
 */
export function luhnValid(cardNumber) {
  return [...cardNumber].reverse().reduce((sum, c, i) => {
    let d = parseInt(c, 10);
    if (i % 2 !== 0) { d *= 2; }
    if (d > 9) { d -= 9; }
    return sum + d;
  }, 0) % 10 === 0;
}

// Regex to do credit card validations
export const ValidCardNumber = (x) => /^[0-9]{12,19}$/.test(x) && luhnValid(x.toString());

export const ValidExpireMonth = (x) => /^[0-9]{1,2}$/.test(x);

export const ValidExpireYear = (x) => /^[0-9]{4}$/.test(x);

export const ValidCVV = (x) => /^[0-9]{3,4}$/.test(x);

/**
 * Validation class
 * @summary Helper to streamline getting simple-schema validation in react components
 */
export class Validation {
  /**
   * Instantiate with a schema to validate against
   * @param  {SimpleSchema} schema aldeed:simpleschema class
   * @param  {Object} options extra options such as { pick: ["fieldName"] }
   */
  constructor(schema, options) {
    if (options && options.pick) {
      this.validationContext = schema.pick(options.pick).newContext();
    } else {
      this.validationContext = schema.namedContext();
    }

    this.schema = schema;
    this.options = options;
    this.validationStatus = {
      isValid: undefined,
      fields: {},
      messages: {},
      isFieldValid: this.isFieldValid
    };
  }

  get cleanOptions() {
    return (this.options && this.options.cleanOptions) || { getAutoValues: false };
  }

  /**
   * validate
   * @param  {Object} objectToValidate Object to validate against schema
   * @return {Object} object containting {isValid: true|false, validationMessages: undefined|object}
   */
  validate(objectToValidate) {
    const messages = {};
    const fields = {};

    // clean object, removing fields that aren't in the schema, and convert types
    // based on schema
    const cleanedObject = this.schema.clean(objectToValidate, this.cleanOptions);

    // Validate the cleaned object
    const isValid = this.validationContext.validate(cleanedObject);

    // Avoiding the reactive-stuff built into simple-schema, grab invalid
    // keys from the private var _validationErrors, and create a new object with
    // the validation error and message.
    this.validationContext._validationErrors
      .forEach((validationError) => {
        messages[validationError.name] = {
          ...validationError,
          isValid: false,
          message: this.validationContext.keyErrorMessage(validationError.name)
        };
      });

    for (const fieldName of Object.keys(cleanedObject)) {
      const hasMessage = messages[fieldName];

      fields[fieldName] = {
        isValid: !hasMessage,
        value: cleanedObject[fieldName]
      };
    }


    // Set the current validation status of the validated object on class instance
    this.validationStatus = {
      isValid,
      fields,
      messages,
      isFieldValid: this.isFieldValid
    };

    // Return object validation status, fields, and helpers
    return this.validationStatus;
  }

  /**
   * isFieldValid - get status of a field after running `validate`
   * @param  {String} fieldName Name of field to check status
   * @return {Boolean} `true` if valid / `false` if not valid / `undefined` if unknown or not yet tested
   */
  isFieldValid = (fieldName) => {
    const field = this.validationStatus.fields[fieldName];
    return field && field.isValid;
  }
}
