const express = require ('express'); 

const app = express();

const mongoose = require ('mongoose');
const cors = require ('cors');

let PORT = 3001;

app.use (express.json());
app.use (express.urlencoded ({extended:true}));
app.use (cors());

const userRoutes = require ("./routes/userRoutes");
const productRoutes = require ("./routes/productRoutes");



app.use ("/products", productRoutes);
app.use ("/users", userRoutes);


mongoose.connect ('mongodb+srv://admin:admin1234@zuitt-bootcamp.ktm2j.mongodb.net/csp2?retryWrites=true&w=majority', 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log ('Connected to Database'));

app.use('/api/users', userRoutes )
app.use ('/api/products', productRoutes)

app.listen(process.env.PORT || 3001, () => console.log (`Server is running at ${PORT}`));