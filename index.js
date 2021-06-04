const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const mongoose = require("mongoose");
const dbonline = 'mongodb+srv://Miguel:sdMiguel@cluster0.t3upt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const alunosRouter = require("./routes/alunos");
const cadeirasRouter = require("./routes/cadeiras");


//Import Mongoose
//let mongoose = require('mongoose');
let app = express();
const PORT = process.env.PORT || 4000;



//const FileSync = require("lowdb/adapters/FileSync");
//const adapter = new FileSync("db.json");
//const db = low(adapter);


// Connect to BD
const dbPath = 'mongodb://localhost/Presencas';
const optionsMongo = {useNewUrlParser: true, useUnifiedTopology: true}
const mongo = mongoose.connect(dbPath, optionsMongo);
mongo.then(()=>{
    console.log('ligado a bd');
}, error => {
    console.log(console.error(), 'error');
});
// Check Connection
var db = mongoose.connection;
if (!db)
    console.log("Error connecting db");
else
    console.log("Base de dados criada com sucesso");

//db.defaults({ alunos: [] }).write();

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Presenças API",
			version: "1.0.0",
			description: "Marcação de presenças",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.db = db;
app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

app.use("/alunos", alunosRouter);
app.use("/cadeiras", cadeirasRouter);

app.listen(PORT, () => console.log(`The server is running on port http://localhost:4000/api-docs`));

mongoose.Promise = global.Promise;
/*
mongoose.connect(dbonline,{useNewUrlParser:true,useUnifiedTopology:true}).then(console.log('connected to atlas'));
*/
