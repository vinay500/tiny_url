// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import linkRoutes from "./routes/linkRoutes.js";
// import { successResponse, errorResponse } from "./utils/apiResponse.js";
// import pool from "./db.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // API routes
// app.use("/api/links", linkRoutes);

// // Healthcheck
// app.get("/healthz", (req, res) => {
//   res.status(200).json({
//     ok: true,
//     version: "1.0",
//   });
// });


// // Redirect Link
// /**
//  * @route   GET /:code
//  * @desc    Redirect to the original URL for the given short code.
//  *          Also increments the click count and updates last_clicked timestamp.
//  * @access  Public
//  */
// app.get("/:code", async (req, res) => {
//   const { code } = req.params;

//   try {
//     /**
//      * Step 1: Fetch the link record
//      * Only public-safe fields.
//      */
//     const findQuery = `
//       SELECT 
//         url,
//         expiry_date,
//         total_clicks
//       FROM links
//       WHERE code = $1
//       LIMIT 1
//     `;

//     const { rows, rowCount } = await pool.query(findQuery, [code]);

//     if (rowCount === 0) {
//       // No link found → 404 JSON
//       return res.status(404).json(
//         errorResponse(
//           "Short code not found.",
//           "LINK_NOT_FOUND",
//           404
//         )
//       );
//     }

//     const link = rows[0];

//     /**
//      * Step 2: Check expiry
//      */
//     if (link.expiry_date && new Date(link.expiry_date) < new Date()) {
//       return res.status(410).json(
//         errorResponse(
//           "This short link has expired.",
//           "LINK_EXPIRED",
//           410
//         )
//       );
//     }

//     /**
//      * Step 3: Update click count & last_clicked
//      */
//     const updateQuery = `
//       UPDATE links
//       SET 
//         total_clicks = total_clicks + 1,
//         last_clicked = NOW()
//       WHERE code = $1
//     `;

//     await pool.query(updateQuery, [code]);

//     /**
//      * Step 4: Perform the 302 redirect
//      */
//     return res.redirect(302, link.url);

//   } catch (error) {
//     console.error("❌ Error in redirect logic:", error);

//     return res.status(500).json(
//       errorResponse(
//         "Internal server error while redirecting.",
//         "INTERNAL_ERROR",
//         500,
//         error.message
//       )
//     );
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });














import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import linkRoutes from "./routes/linkRoutes.js";
import { successResponse, errorResponse } from "./utils/apiResponse.js";
import pool from "./db.js";

dotenv.config();

/**
 * Type describing a single link record fetched from DB.
 */
interface LinkRecord {
  url: string;
  expiry_date: string | null;
  total_clicks: number;
}

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/links", linkRoutes);

// Healthcheck
app.get("/healthz", (_req: Request, res: Response) => {
  return res.status(200).json({
    ok: true,
    version: "1.0",
  });
});

/**
 * Redirect Link
 * @route GET /:code
 */
app.get("/:code", async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    /**
     * Step 1: Fetch the link record
     */
    const findQuery = `
      SELECT 
        url,
        expiry_date,
        total_clicks
      FROM links
      WHERE code = $1
      LIMIT 1
    `;

    const findResult = await pool.query<LinkRecord>(findQuery, [code]);
    const { rows } = findResult;

    // if (rowCount === 0) {
    //   return res.status(404).json(
    //     errorResponse(
    //       "Short code not found.",
    //       "LINK_NOT_FOUND",
    //       404
    //     )
    //   );
    // }

    if (rows.length === 0) {
      return res.status(404).json(
        errorResponse("Short code not found.", "LINK_NOT_FOUND", 404)
      );
    }

    const link:LinkRecord = rows[0];

    /**
     * Step 2: Check expiry
     */
    if (link.expiry_date && new Date(link.expiry_date) < new Date()) {
      return res.status(410).json(
        errorResponse(
          "This short link has expired.",
          "LINK_EXPIRED",
          410
        )
      );
    }

    /**
     * Step 3: Update click count
     */
    const updateQuery = `
      UPDATE links
      SET 
        total_clicks = total_clicks + 1,
        last_clicked = NOW()
      WHERE code = $1
    `;

    await pool.query(updateQuery, [code]);

    /**
     * Step 4: Redirect to original URL
     */
    return res.redirect(302, link.url);

  } catch (error: unknown) {
    console.error("❌ Error in redirect logic:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json(
      errorResponse(
        "Internal server error while redirecting.",
        "INTERNAL_ERROR",
        500,
        errorMessage
      )
    );
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

