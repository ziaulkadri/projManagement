import {ApiResponse} from "../utils/api-response.js";

import { asyncHandler } from "../utils/async-handler.js";

/**
 *  
 const healthCheck = async(req, res,next) => {
    try {
        const user = await getuserfromdb();
        // You can add any additional checks here (e.g., database connection, external service status
            res.status(200).json(new ApiResponse(200, {message:"server is running"}));

    } catch (error) {
        console.error("Health check failed:", error);
        next(error);
    }
};
*/



const healthCheck = asyncHandler(async(req, res,next) => {
    res.status(200).json(new ApiResponse(200, {message:"server is running"}));
});

export {healthCheck}