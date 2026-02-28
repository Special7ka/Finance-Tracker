import "dotenv/config";
import app from "./app";

const PORT = 3000

app.listen(PORT, ()=>{console.log(`server started at Port ${PORT}` )});
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "OK" : "MISSING")