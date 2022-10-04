const express = require('express');
const connectDB = require('./config/db')
const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json({extended: false}));

app.get('/', (req ,res) => {
    res.status(200).json({msg:"This ia MERN SOCIAL APP"})
})

app.use('/api/auth' , require('./routes/auth'));
app.use('/api/users' , require('./routes/users'));
app.use('/api/posts' , require('./routes/posts'));

app.listen(PORT , () => {
    console.log("Server is running on port" , PORT)
});