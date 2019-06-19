/**
 * @description Function to check that input is not empty, undefined or null
 * @param {any} value The data type to be checked
 * @returns {boolean} true or false
 */
export default value => value === undefined
  || value === null
  || (typeof value === 'object' && Object.keys(value).length === 0)
  || (typeof value === 'string' && value.trim().length === 0);
