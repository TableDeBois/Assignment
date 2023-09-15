import express from "express";
import path from "path";

const app = express();
const port = 3000;

app.use("/client", express.static('./client/'));
app.use("/node_modules", express.static('./node_modules/'));
app.use("/ressources", express.static('./ressources/'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('client/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
