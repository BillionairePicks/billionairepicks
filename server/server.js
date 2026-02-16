require("dotenv").config()
const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth")
const marketRoutes = require("./routes/market")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/market", marketRoutes)

app.listen(5000, () => console.log("Server running on port 5000"))
