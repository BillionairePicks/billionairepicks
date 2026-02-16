router.get("/crypto/:symbol", async (req,res)=>{
    const {symbol} = req.params
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    )
    res.json(response.data)
})
