import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./db/index.js";

dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 3000;



connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port  http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process with an error code
});
