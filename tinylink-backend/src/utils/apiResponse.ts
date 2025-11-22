// /**
//  * Utility functions to standardize API responses across the application.
//  * Ensures consistency and reduces duplicate code inside controllers/routes.
//  */

// /**
//  * Standard success response
//  *
//  * @param {object|array|null} data - The success payload
//  * @param {string} message - Human-readable success message
//  * @param {object} meta - Additional metadata (count, pagination, etc.)
//  */
// export const successResponse = (data = null, message = "Success", meta = {}) => {
//     return {
//       success: true,
//       message,
//       data,
//       meta
//     };
//   };
  
//   /**
//    * Standard error response
//    *
//    * @param {string} message - Human-readable safe error message
//    * @param {string} code - Machine-friendly error identifier
//    * @param {number} status - HTTP status code
//    * @param {string|object} details - Optional internal error details
//    */
//   export const errorResponse = (
//     message = "An error occurred.",
//     code = "ERROR",
//     status = 400,
//     details = null
//   ) => {
//     return {
//       success: false,
//       message,
//       error: {
//         code,
//         details
//       },
//       status
//     };
//   };
  














/**
 * Utility functions to standardize API responses across the application.
 * Ensures consistency and reduces duplicate code across controllers/routes.
 */

/**
 * Shape of a standard API success response.
 */
export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta: Record<string, unknown>;
}

/**
 * Shape of a standard API error response.
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details: unknown;
  };
  status: number;
}

/**
 * Standard success response creator
 *
 * @param data - success payload (object, array, or null)
 * @param message - human-readable success message
 * @param meta - additional metadata (count, pagination, etc.)
 */
export const successResponse = <T>(
  data: T,
  message = "Success",
  meta: Record<string, unknown> = {}
): SuccessResponse<T> => {
  return {
    success: true,
    message,
    data,
    meta,
  };
};

/**
 * Standard error response creator
 *
 * @param message - safe message for clients
 * @param code - machine-friendly error identifier
 * @param status - HTTP status code
 * @param details - optional internal details (not exposed to clients)
 */
export const errorResponse = (
  message = "An error occurred.",
  code = "ERROR",
  status = 400,
  details: unknown = null
): ErrorResponse => {
  return {
    success: false,
    message,
    error: {
      code,
      details,
    },
    status,
  };
};
