// /**
//  * Validate a URL format
//  * Allows http://, https:// and prevents invalid URI.
//  */
// export const isValidUrl = (url) => {
//     try {
//       new URL(url);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };
  




// /**
//  * Generate a meaningful short code using the hostname + first path segment.
//  * Ensures the result matches [A-Za-z0-9]{6,8}.
//  */
// export const generateMeaningfulCode = (url) => {
//     try {
//       const parsed = new URL(url);
  
//       // Extract hostname (e.g., "github.com" → "github")
//       let host = parsed.hostname.replace("www.", "").split(".")[0];
  
//       // Extract first path segment (e.g., "/docs/api" → "docs")
//       let path = parsed.pathname
//         .split("/")
//         .filter(Boolean)[0] || "";
  
//       // Combine host + path
//       let clean = (host + path)
//         .replace(/[^a-zA-Z0-9]/g, "") // alphanumeric only
//         .toLowerCase();
  
//       // Ensure length 6–8
//       if (clean.length < 6) {
//         clean = clean.padEnd(6, "x"); // pad with 'x'
//       }
//       if (clean.length > 8) {
//         clean = clean.substring(0, 8); // trim
//       }
  
//       return clean;
  
//     } catch (error) {
//       return null;
//     }
//   };



// /**
//  * Generate a secure random alphanumeric short code.
//  * Matches the pattern requirement: [A-Za-z0-9]{6,8}
//  *
//  * Uses crypto.randomBytes instead of Math.random for better randomness.
//  *
//  * @param {number} length - desired code length (default 6)
//  * @returns {string} - generated short code
//  */
// export const generateShortCode = async (length = 6) => {
//     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     const charactersLength = characters.length;
  
//     // Using crypto for more secure randomness
//     const crypto = await import("crypto");
//     const randomBytes = crypto.randomBytes(length);
  
//     let result = "";
  
//     for (let i = 0; i < length; i++) {
//       // Convert each byte to a valid index inside characters string
//       const index = randomBytes[i] % charactersLength;
//       result += characters.charAt(index);
//     }
  
//     return result;
//   };
  
  




import crypto from "crypto";

/**
 * Validate a URL format.
 * Allows http://, https:// and prevents invalid URI.
 */
export const isValidUrl = (url: string): boolean => {
  try {
    console.log("checking url: ",url)
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate a meaningful short code using hostname + first path segment.
 * Ensures the result matches [A-Za-z0-9]{6,8}.
 *
 * @returns string | null
 */
export const generateMeaningfulCode = (url: string): string | null => {
  try {
    const parsed = new URL(url);

    // Extract hostname (e.g., "github.com" → "github")
    const host = parsed.hostname.replace("www.", "").split(".")[0];

    // Extract first path segment (e.g., "/docs/api" → "docs")
    const path =
      parsed.pathname
        .split("/")
        .filter(Boolean)[0] || "";

    // Combine host + path
    let clean = (host + path)
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

    // Ensure length 6–8
    if (clean.length < 6) {
      clean = clean.padEnd(6, "x");
    }
    if (clean.length > 8) {
      clean = clean.substring(0, 8);
    }

    return clean;
  } catch (error) {
    return null;
  }
};

/**
 * Generate a secure random alphanumeric short code.
 * Matches [A-Za-z0-9]{6,8}.
 *
 * Uses crypto.randomBytes for strong randomness.
 */
export const generateShortCode = (length: number = 6): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  const randomBytes = crypto.randomBytes(length);

  let result = "";

  for (let i = 0; i < length; i++) {
    const byte = randomBytes[i];

    // TS strict safety — will never actually happen
    if (byte === undefined) {
      continue;
    }

    const index = byte % charactersLength;
    result += characters.charAt(index);
  }

  return result;
};
