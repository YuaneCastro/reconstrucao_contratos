const app = require('./app');
const dotenv=require('dotenv');

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
});