// import express from "express";
// import pool from "../db.js";
// import { successResponse, errorResponse } from "../utils/apiResponse.js";
// import { isValidUrl } from "../utils/validators.js";
// import { generateMeaningfulCode, generateShortCode } from "../utils/validators.js"

// const router = express.Router();

// /**
//  * @route   GET /api/links
//  * @desc    Fetch all short links (safe fields only)
//  */
// router.get("/", async (req, res) => {
//   try {
//     const query = `
//       SELECT code,url,total_clicks,last_clicked,created_at
//       FROM links
//       ORDER BY created_at DESC
//     `;

//     const { rows } = await pool.query(query);

//     return res
//       .status(200)
//       .json(successResponse(rows, "Links fetched successfully.", { count: rows.length }));

//   } catch (error) {
//     console.error("❌ Error fetching links:", error);

//     const err = errorResponse(
//       "Internal server error while fetching links.",
//       "INTERNAL_ERROR",
//       500
//     );

//     return res.status(err.status).json(err);
//   }
// });


// // /**
// //  * @route   POST /api/links
// //  * @desc    Create a new short link
// //  * @access  Public
// //  */
// // router.post("/", async (req, res) => {
// //     const { url, code: customCode } = req.body;
  
// //     // 1. Validate URL
// //     if (!url || !isValidUrl(url)) {
// //       return res.status(400).json(
// //         errorResponse("Invalid URL format.", "INVALID_URL", 400)
// //       );
// //     }
  
// //     // 2. Generate or use custom code
// //     let shortCode = customCode;

// //     if (!shortCode) {
// //         shortCode = generateMeaningfulCode(url);
// //     }
  
// //     try {
// //       // 3. Check if code already exists
// //       const existing = await pool.query(
// //         "SELECT code FROM links WHERE code = $1",
// //         [shortCode]
// //       );
  
// //       if (existing.rowCount > 0) {
// //         const err = errorResponse(
// //           "Short code already exists.",
// //           "CODE_ALREADY_EXISTS",
// //           409
// //         );
// //         return res.status(err.status).json(err);
// //       }
  
// //       // 4. Insert new link
// //       const insertQuery = `
// //         INSERT INTO links (code, url)
// //         VALUES ($1, $2)
// //         RETURNING code, url, total_clicks, last_clicked, created_at
// //       `;
  
// //       const { rows } = await pool.query(insertQuery, [shortCode, url]);
// //       const createdLink = rows[0];
  
// //       // 5. Return success response
// //       return res.status(201).json(
// //         successResponse(
// //           createdLink,
// //           "Short link created successfully."
// //         )
// //       );
  
// //     } catch (error) {
// //       console.error("❌ Error creating link:", error);
  
// //       const err = errorResponse(
// //         "Internal server error while creating link.",
// //         "INTERNAL_ERROR",
// //         500,
// //         error.message
// //       );
  
// //       return res.status(err.status).json(err);
// //     }
// //   });





// /**
//  * @route   POST /api/links
//  * @desc    Create a new short link
//  */

// router.post("/", async (req, res) => {
//     const { url, code: customCode } = req.body;
  
//     // 1. Validate URL
//     if (!url || !isValidUrl(url)) {
//       return res.status(400).json(
//         errorResponse("Invalid URL format.", "INVALID_URL", 400)
//       );
//     }
  
//     try {
//       /**
//        * ----------------------------------------------------------------------------------
//        * CASE 1: USER PROVIDES CUSTOM CODE
//        * ----------------------------------------------------------------------------------
//        */
//       if (customCode) {
//         // A. Check if URL already exists
//         const urlCheck = await pool.query(
//           "SELECT code, url, total_clicks, last_clicked, created_at FROM links WHERE url = $1 LIMIT 1",
//           [url]
//         );
  
//         if (urlCheck.rowCount > 0) {
//           // URL exists → return existing
//           return res.status(200).json(
//             successResponse(
//               urlCheck.rows[0],
//               "URL already exists. Returning existing short link."
//             )
//           );
//         }
  
//         // B. Check if code already exists
//         const codeCheck = await pool.query(
//           "SELECT 1 FROM links WHERE code = $1 LIMIT 1",
//           [customCode]
//         );
  
//         if (codeCheck.rowCount > 0) {
//           return res.status(409).json(
//             errorResponse(
//               "The custom short code already exists. Please enter a new code.",
//               "CUSTOM_CODE_EXISTS",
//               409
//             )
//           );
//         }
  
//         // C. Insert with custom code
//         const insertQuery = `
//           INSERT INTO links (code, url)
//           VALUES ($1, $2)
//           RETURNING code, url, total_clicks, last_clicked, created_at
//         `;
  
//         const { rows } = await pool.query(insertQuery, [customCode, url]);
  
//         return res.status(201).json(
//           successResponse(rows[0], "Short link created successfully.")
//         );
//       }
  
//       /**
//        * ----------------------------------------------------------------------------------
//        * CASE 2: USER DOES NOT PROVIDE CUSTOM CODE
//        * ----------------------------------------------------------------------------------
//        */
  
//       // A. Check if URL already exists
//       const existingUrl = await pool.query(
//         "SELECT code, url, total_clicks, last_clicked, created_at FROM links WHERE url = $1 LIMIT 1",
//         [url]
//       );
  
//       if (existingUrl.rowCount > 0) {
//         return res.status(200).json(
//           successResponse(
//             existingUrl.rows[0],
//             "URL already exists. Returning existing short link."
//           )
//         );
//       }
  
//       // B. Generate meaningful code
//       let generatedCode = generateMeaningfulCode(url);
  
//       // C. Ensure generated code is unique
//       let codeExists = await pool.query(
//         "SELECT 1 FROM links WHERE code = $1 LIMIT 1",
//         [generatedCode]
//       );
  
//       if (codeExists.rowCount > 0) {
//         // fallback → random 6-character code
//         generatedCode = generateShortCode(6);
//       }
  
//       // D. Insert with generated code
//       const insertQuery = `
//         INSERT INTO links (code, url)
//         VALUES ($1, $2)
//         RETURNING code, url, total_clicks, last_clicked, created_at
//       `;
  
//       const { rows } = await pool.query(insertQuery, [generatedCode, url]);
  
//       return res.status(201).json(
//         successResponse(rows[0], "Short link created successfully.")
//       );
  
//     } catch (error) {
//       console.error("❌ Error creating link:", error);
  
//       return res.status(500).json(
//         errorResponse(
//           "Internal server error while creating the short link.",
//           "INTERNAL_ERROR",
//           500,
//           error.message
//         )
//       );
//     }
//   });
  


// /**
//  * @route   GET /api/links/:code
//  * @desc    Get stats/details for a single short link by its code
//  * @access  Public
//  */
// router.get("/:code", async (req, res) => {
//     const { code } = req.params;
  
//     try {
//       /**
//        * Step 1: Fetch the link record
//        */
//       const findQuery = `
//         SELECT 
//           code,
//           url,
//           total_clicks,
//           last_clicked,
//           created_at,
//           expiry_date
//         FROM links
//         WHERE code = $1
//         LIMIT 1
//       `;
  
//       const { rows, rowCount } = await pool.query(findQuery, [code]);
  
//       // If link is not found → 404
//       if (rowCount === 0) {
//         return res.status(404).json(
//           errorResponse(
//             "Short code not found.",
//             "LINK_NOT_FOUND",
//             404
//           )
//         );
//       }
  
//       const link = rows[0];
  
//       /**
//        * Step 2: Determine if expired (for display only)
//        * Redirect API handles blocking expired usage.
//        */
//       const isExpired =
//         link.expiry_date && new Date(link.expiry_date) < new Date();
  
//       const stats = {
//         ...link,
//         isExpired
//       };
  
//       /**
//        * Step 3: Return success response
//        */
//       return res.status(200).json(
//         successResponse(stats, "Link stats fetched successfully.")
//       );
  
//     } catch (error) {
//       console.error("❌ Error fetching link stats:", error);
  
//       return res.status(500).json(
//         errorResponse(
//           "Internal server error while fetching link stats.",
//           "INTERNAL_ERROR",
//           500,
//           error.message
//         )
//       );
//     }
//   });


  

// /**
//  * @route   DELETE /api/links/:code
//  * @desc    Delete an existing short link by its code.
//  * @access  Public
//  */
// router.delete("/:code", async (req, res) => {
//     const { code } = req.params;
  
//     try {
//       /**
//        * Step 1: Check if link exists
//        */
//       const checkQuery = `
//         SELECT code 
//         FROM links 
//         WHERE code = $1
//         LIMIT 1
//       `;
  
//       const checkResult = await pool.query(checkQuery, [code]);
  
//       if (checkResult.rowCount === 0) {
//         return res.status(404).json(
//           errorResponse(
//             "Short code not found.",
//             "LINK_NOT_FOUND",
//             404
//           )
//         );
//       }
  
//       /**
//        * Step 2: Delete the link
//        */
//       const deleteQuery = `
//         DELETE FROM links
//         WHERE code = $1
//       `;
  
//       await pool.query(deleteQuery, [code]);
  
//       /**
//        * Step 3: Return success message
//        */
//       return res.status(200).json(
//         successResponse(
//           null,
//           "Short link deleted successfully."
//         )
//       );
  
//     } catch (error) {
//       console.error("❌ Error deleting link:", error);
  
//       return res.status(500).json(
//         errorResponse(
//           "Internal server error while deleting link.",
//           "INTERNAL_ERROR",
//           500,
//           error.message
//         )
//       );
//     }
//   });
  

//   /**
//  * @route   GET /api/links/stats
//  * @desc    Get dashboard stats + stats for all links
//  * @access  Public
//  */
// router.get("/stats/all", async (req, res) => {
//     try {
//       /**
//        * Step 1: Fetch all links (complete public stats)
//        */
//       const allLinksQuery = `
//         SELECT 
//           code,
//           url,
//           total_clicks,
//           last_clicked,
//           created_at,
//           expiry_date
//         FROM links
//         ORDER BY created_at DESC
//       `;
  
//       const { rows: links } = await pool.query(allLinksQuery);
  
//       /**
//        * Step 2: Provide an expiration flag in each record
//        */
//       const processedLinks = links.map((link) => ({
//         ...link,
//         isExpired:
//           link.expiry_date && new Date(link.expiry_date) < new Date()
//       }));
  
//       /**
//        * Step 3: Dashboard summary stats
//        */
//       const totalLinks = processedLinks.length;
//       const totalClicks = processedLinks.reduce(
//         (sum, link) => sum + link.total_clicks,
//         0
//       );
  
//       const avgClicks = totalLinks > 0
//         ? Number((totalClicks / totalLinks).toFixed(2))
//         : 0;
  
//       const summary = {
//         total_links: totalLinks,
//         total_clicks: totalClicks,
//         avg_clicks: avgClicks
//       };
  
//       /**
//        * Step 4: Return standardized response
//        */
//       return res.status(200).json(
//         successResponse(
//           {
//             summary,
//             links: processedLinks
//           },
//           "Dashboard stats fetched successfully."
//         )
//       );
  
//     } catch (error) {
//       console.error("❌ Error fetching dashboard stats:", error);
  
//       return res.status(500).json(
//         errorResponse(
//           "Internal server error while fetching dashboard stats.",
//           "INTERNAL_ERROR",
//           500,
//           error.message
//         )
//       );
//     }
//   });

// export default router;



























import express, { Request, Response } from "express";
import pool from "../db.js";
import {
  successResponse,
  errorResponse,
  SuccessResponse,
  ErrorResponse,
} from "../utils/apiResponse.js";

import {
  isValidUrl,
  generateMeaningfulCode,
  generateShortCode,
} from "../utils/validators.js";

const router = express.Router();

/**
 * Interface representing a DB link record
 */
export interface LinkRecord {
  code: string;
  url: string;
  total_clicks: number;
  last_clicked: string | null;
  created_at: string;
  expiry_date?: string | null;
}

/**
 * @route   GET /api/links
 * @desc    Fetch all short links (safe fields only)
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const query = `
      SELECT code, url, total_clicks, last_clicked, created_at
      FROM links
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query<LinkRecord>(query);

    return res.status(200).json(
      successResponse(rows, "Links fetched successfully.", {
        count: rows.length,
      })
    );
  } catch (error: unknown) {
    console.error("❌ Error fetching links:", error);

    return res.status(500).json(
      errorResponse(
        "Internal server error while fetching links.",
        "INTERNAL_ERROR",
        500,
        error instanceof Error ? error.message : null
      )
    );
  }
});

// /**
//  * @route   POST /api/links
//  * @desc    Create a new short link
//  */
// router.post("/", async (req: Request, res: Response) => {
//   const { targetUrl, code: customCode } = req.body as {
//     url: string;
//     code?: string;
//   };
//   console.log("validating url: ",url)
//   if (!url || !isValidUrl(url)) {
//     return res
//       .status(400)
//       .json(errorResponse("Invalid URL format.", "INVALID_URL", 400));
//   }

//   try {
//     /**
//      * ---------------------------------------------------------------------
//      * CASE 1: USER PROVIDES CUSTOM CODE
//      * ---------------------------------------------------------------------
//      */
//     if (customCode) {
//       // Check if URL already exists
//       const urlCheck = await pool.query<LinkRecord>(
//         "SELECT code, url, total_clicks, last_clicked, created_at FROM links WHERE url = $1 LIMIT 1",
//         [url]
//       );

//       if (urlCheck.rows.length > 0) {
//         return res.status(200).json(
//           successResponse(
//             urlCheck.rows[0],
//             "URL already exists. Returning existing short link."
//           )
//         );
//       }

//       // Check if custom code exists
//       const codeCheck = await pool.query("SELECT 1 FROM links WHERE code = $1", [
//         customCode,
//       ]);

//       if (codeCheck.rows.length > 0) {
//         return res.status(409).json(
//           errorResponse(
//             "The custom short code already exists. Please enter a new code.",
//             "CUSTOM_CODE_EXISTS",
//             409
//           )
//         );
//       }

//       // Insert new link
//       const insertQuery = `
//         INSERT INTO links (code, url)
//         VALUES ($1, $2)
//         RETURNING code, url, total_clicks, last_clicked, created_at
//       `;

//       const { rows } = await pool.query<LinkRecord>(insertQuery, [
//         customCode,
//         url,
//       ]);

//       return res
//         .status(201)
//         .json(successResponse(rows[0], "Short link created successfully."));
//     }

//     /**
//      * ---------------------------------------------------------------------
//      * CASE 2: USER DOES NOT PROVIDE CUSTOM CODE
//      * ---------------------------------------------------------------------
//      */

//     // Check if URL exists
//     const existingUrl = await pool.query<LinkRecord>(
//       "SELECT code, url, total_clicks, last_clicked, created_at FROM links WHERE url = $1 LIMIT 1",
//       [url]
//     );

//     if (existingUrl.rows.length > 0) {
//       return res.status(200).json(
//         successResponse(
//           existingUrl.rows[0],
//           "URL already exists. Returning existing short link."
//         )
//       );
//     }

//     // Generate meaningful code
//     let generatedCode = generateMeaningfulCode(url) || generateShortCode(6);

//     // Ensure code is unique
//     const codeExists = await pool.query(
//       "SELECT 1 FROM links WHERE code = $1 LIMIT 1",
//       [generatedCode]
//     );

//     if (codeExists.rows.length > 0) {
//       generatedCode = generateShortCode(6);
//     }

//     // Insert
//     const insertQuery = `
//       INSERT INTO links (code, url)
//       VALUES ($1, $2)
//       RETURNING code, url, total_clicks, last_clicked, created_at
//     `;

//     const { rows } = await pool.query<LinkRecord>(insertQuery, [
//       generatedCode,
//       url,
//     ]);

//     return res
//       .status(201)
//       .json(successResponse(rows[0], "Short link created successfully."));
//   } catch (error: unknown) {
//     console.error("❌ Error creating link:", error);

//     return res.status(500).json(
//       errorResponse(
//         "Internal server error while creating the short link.",
//         "INTERNAL_ERROR",
//         500,
//         error instanceof Error ? error.message : null
//       )
//     );
//   }
// });









// router.post("/", async (req: Request, res: Response) => {
//   const { targetUrl, customCode } = req.body as {
//     targetUrl: string;
//     customCode?: string;
//   };

//   const url = targetUrl; // map frontend field to backend expected variable

//   console.log("validating url:", url);

//   if (!url || !isValidUrl(url)) {
//     return res
//       .status(400)
//       .json(errorResponse("Invalid URL format.", "INVALID_URL", 400));
//   }

//   try {
//     // CASE 1: user provides custom short code
//     if (customCode) {
//       const urlCheck = await pool.query<LinkRecord>(
//         "SELECT code, url, total_clicks, last_clicked, created_at FROM links WHERE url = $1 LIMIT 1",
//         [url]
//       );

//       if (urlCheck.rows.length > 0) {
//         return res.status(200).json(
//           successResponse(
//             urlCheck.rows[0],
//             "URL already exists. Returning existing short link."
//           )
//         );
//       }

//       const codeCheck = await pool.query("SELECT 1 FROM links WHERE code = $1", [
//         customCode,
//       ]);

//       if (codeCheck.rows.length > 0) {
//         return res.status(409).json(
//           errorResponse(
//             "The custom short code already exists. Please enter a new code.",
//             "CUSTOM_CODE_EXISTS",
//             409
//           )
//         );
//       }

//       const insertQuery = `
//         INSERT INTO links (code, url)
//         VALUES ($1, $2)
//         RETURNING code, url, total_clicks, last_clicked, created_at
//       `;

//       const { rows } = await pool.query<LinkRecord>(insertQuery, [
//         customCode,
//         url,
//       ]);

//       return res
//         .status(201)
//         .json(successResponse(rows[0], "Short link created successfully."));
//     }

//     // CASE 2: no custom code
//     const existingUrl = await pool.query<LinkRecord>(
//       "SELECT code, url, total_clicks, last_clicked, created_at FROM links WHERE url = $1 LIMIT 1",
//       [url]
//     );

//     if (existingUrl.rows.length > 0) {
//       return res.status(200).json(
//         successResponse(
//           existingUrl.rows[0],
//           "URL already exists. Returning existing short link."
//         )
//       );
//     }

//     let generatedCode = generateMeaningfulCode(url) || generateShortCode(6);

//     const codeExists = await pool.query(
//       "SELECT 1 FROM links WHERE code = $1 LIMIT 1",
//       [generatedCode]
//     );

//     if (codeExists.rows.length > 0) {
//       generatedCode = generateShortCode(6);
//     }

//     const insertQuery = `
//       INSERT INTO links (code, url)
//       VALUES ($1, $2)
//       RETURNING code, url, total_clicks, last_clicked, created_at
//     `;

//     const { rows } = await pool.query<LinkRecord>(insertQuery, [
//       generatedCode,
//       url,
//     ]);

//     return res
//       .status(201)
//       .json(successResponse(rows[0], "Short link created successfully."));
//   } catch (error: unknown) {
//     console.error("❌ Error creating link:", error);

//     return res.status(500).json(
//       errorResponse(
//         "Internal server error while creating the short link.",
//         "INTERNAL_ERROR",
//         500,
//         error instanceof Error ? error.message : null
//       )
//     );
//   }
// });





router.post("/", async (req: Request, res: Response) => {
  const { targetUrl, customCode } = req.body as {
    targetUrl: string;
    customCode?: string;
  };

  const url = targetUrl;

  console.log("Validating URL:", url);

  // 1. Validate URL format
  if (!url || !isValidUrl(url)) {
    return res
      .status(400)
      .json(errorResponse("Invalid URL format.", "INVALID_URL", 400));
  }

  // 2. Validate custom code length (if provided)
  if (customCode && (customCode.length < 6 || customCode.length > 8)) {
    return res.status(400).json(
      errorResponse(
        "Short code must be between 6 and 8 characters.",
        "INVALID_CODE_LENGTH",
        400
      )
    );
  }

  try {
    /* -----------------------------------------------------------
     * CASE 1: USER PROVIDES CUSTOM CODE
     * ----------------------------------------------------------- */
    if (customCode) {
      // A. Check if URL already exists
      const urlCheck = await pool.query<LinkRecord>(
        `SELECT code, url, total_clicks, last_clicked, created_at 
         FROM links 
         WHERE url = $1 
         LIMIT 1`,
        [url]
      );

      if (urlCheck.rows.length > 0) {
        return res.status(200).json(
          successResponse(
            urlCheck.rows[0],
            "URL already exists. Returning existing short link."
          )
        );
      }

      // B. Check if custom code already exists
      const codeCheck = await pool.query(
        "SELECT 1 FROM links WHERE code = $1 LIMIT 1",
        [customCode]
      );

      if (codeCheck.rows.length > 0) {
        return res.status(409).json(
          errorResponse(
            "The custom short code already exists. Please enter a new code.",
            "CUSTOM_CODE_EXISTS",
            409
          )
        );
      }

      // C. Insert with custom code
      const insertQuery = `
        INSERT INTO links (code, url)
        VALUES ($1, $2)
        RETURNING code, url, total_clicks, last_clicked, created_at
      `;

      const { rows } = await pool.query<LinkRecord>(insertQuery, [
        customCode,
        url,
      ]);

      return res
        .status(201)
        .json(successResponse(rows[0], "Short link created successfully."));
    }

    /* -----------------------------------------------------------
     * CASE 2: USER DOES NOT PROVIDE CUSTOM CODE
     * ----------------------------------------------------------- */

    // A. Check if URL already exists
    const existingUrl = await pool.query<LinkRecord>(
      `SELECT code, url, total_clicks, last_clicked, created_at 
       FROM links 
       WHERE url = $1 
       LIMIT 1`,
      [url]
    );

    if (existingUrl.rows.length > 0) {
      return res.status(200).json(
        successResponse(
          existingUrl.rows[0],
          "URL already exists. Returning existing short link."
        )
      );
    }

    // B. Generate a meaningful short code
    let generatedCode: string =
      generateMeaningfulCode(url) || (await generateShortCode(6));

    // Ensure code is within allowed limits
    if (generatedCode.length > 8) {
      generatedCode = generatedCode.substring(0, 8);
    }
    if (generatedCode.length < 6) {
      generatedCode = generatedCode.padEnd(6, "x");
    }

    // C. Ensure generated code is unique
    const codeExists = await pool.query(
      "SELECT 1 FROM links WHERE code = $1 LIMIT 1",
      [generatedCode]
    );

    if (codeExists.rows.length > 0) {
      generatedCode = await generateShortCode(6);
    }

    // D. Insert new link
    const insertQuery = `
        INSERT INTO links (code, url)
        VALUES ($1, $2)
        RETURNING code, url, total_clicks, last_clicked, created_at
    `;

    const { rows } = await pool.query<LinkRecord>(insertQuery, [
      generatedCode,
      url,
    ]);

    return res
      .status(201)
      .json(successResponse(rows[0], "Short link created successfully."));
  } catch (error: any) {
    console.error("❌ Error creating link:", error);

    // Handle VARCHAR(8) overflow error (Postgres code 22001)
    if (error.code === "22001") {
      return res.status(400).json(
        errorResponse(
          "Short code exceeds the maximum length of 8 characters.",
          "CODE_TOO_LONG",
          400
        )
      );
    }

    return res.status(500).json(
      errorResponse(
        "Internal server error while creating the short link.",
        "INTERNAL_ERROR",
        500,
        error.message
      )
    );
  }
});










/**
 * @route   GET /api/links/:code
 * @desc    Get stats for a single link
 */
router.get("/:code", async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const findQuery = `
      SELECT code, url, total_clicks, last_clicked, created_at, expiry_date
      FROM links
      WHERE code = $1
      LIMIT 1
    `;

    const { rows } = await pool.query<LinkRecord>(findQuery, [code]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json(errorResponse("Short code not found.", "LINK_NOT_FOUND", 404));
    }

    const link = rows[0];

    const isExpired =
      link.expiry_date && new Date(link.expiry_date) < new Date();

    return res.status(200).json(
      successResponse(
        { ...link, isExpired },
        "Link stats fetched successfully."
      )
    );
  } catch (error: unknown) {
    console.error("❌ Error fetching link stats:", error);

    return res.status(500).json(
      errorResponse(
        "Internal server error while fetching link stats.",
        "INTERNAL_ERROR",
        500,
        error instanceof Error ? error.message : null
      )
    );
  }
});

/**
 * @route   DELETE /api/links/:code
 * @desc    Delete link
 */
router.delete("/:code", async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const checkQuery = `
      SELECT code FROM links WHERE code = $1 LIMIT 1
    `;

    const checkResult = await pool.query(checkQuery, [code]);

    if (checkResult.rows.length === 0) {
      return res
        .status(404)
        .json(errorResponse("Short code not found.", "LINK_NOT_FOUND", 404));
    }

    await pool.query("DELETE FROM links WHERE code = $1", [code]);

    return res
      .status(200)
      .json(successResponse(null, "Short link deleted successfully."));
  } catch (error: unknown) {
    console.error("❌ Error deleting link:", error);

    return res.status(500).json(
      errorResponse(
        "Internal server error while deleting link.",
        "INTERNAL_ERROR",
        500,
        error instanceof Error ? error.message : null
      )
    );
  }
});

/**
 * @route   GET /api/links/stats/all
 * @desc    Dashboard stats + all links
 */
router.get("/stats/all", async (_req: Request, res: Response) => {
  try {
    const allLinksQuery = `
      SELECT code, url, total_clicks, last_clicked, created_at, expiry_date
      FROM links
      ORDER BY created_at DESC
    `;

    const { rows: links } = await pool.query<LinkRecord>(allLinksQuery);

    const processedLinks = links.map((link) => ({
      ...link,
      isExpired:
        link.expiry_date != null &&
        new Date(link.expiry_date) < new Date(),
    }));

    const totalLinks = processedLinks.length;
    const totalClicks = processedLinks.reduce(
      (sum, link) => sum + link.total_clicks,
      0
    );

    const summary = {
      total_links: totalLinks,
      total_clicks: totalClicks,
      avg_clicks: totalLinks ? Number((totalClicks / totalLinks).toFixed(2)) : 0,
    };

    return res.status(200).json(
      successResponse(
        { summary, links: processedLinks },
        "Dashboard stats fetched successfully."
      )
    );
  } catch (error: unknown) {
    console.error("❌ Error fetching dashboard stats:", error);

    return res.status(500).json(
      errorResponse(
        "Internal server error while fetching dashboard stats.",
        "INTERNAL_ERROR",
        500,
        error instanceof Error ? error.message : null
      )
    );
  }
});

export default router;

