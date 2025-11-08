/**
 * Utilidades para validación de formularios
 */

/**
 * Valida un email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que un campo no esté vacío
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.trim() !== "";
};

/**
 * Valida que todos los campos requeridos estén presentes
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !data[field]);
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Valida una fecha
 */
export const isValidDate = (dateString) => {
  return !isNaN(new Date(dateString).getTime());
};

/**
 * Valida que una fecha de entrada sea posterior a la de salida
 */
export const validateDateRange = (fechaSalida, fechaEntrada) => {
  if (!fechaSalida || !fechaEntrada) return true;
  
  const salida = new Date(fechaSalida);
  const entrada = new Date(fechaEntrada);
  
  return entrada > salida;
};

/**
 * Valida un número de teléfono
 */
export const validatePhone = (phone) => {
  return phone && !isNaN(parseInt(phone));
};

/**
 * Valida la longitud de una contraseña
 */
export const validatePasswordLength = (password, minLength = 6) => {
  return password && password.length >= minLength;
};

