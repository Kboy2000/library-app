// const http = require('http');

// const server = http.createServer((req, res)=>{
//    res.writeHead(200,{"content-Type":"text/plain"});
//    res.end("Hello you are welcome to node js classes");
// });

// server.listen(3000, ()=>{
//   console.log("server is running on http://localhost:3000");

// })

// const http = require('http');

// const server = http.createServer((req, res)=>{
//    res.writeHead(200,{"content-Type":"text/plain"});
//    res.end("Hello Ebuka, Remember to always show up");
// });

// server.listen(4000, ()=>{
//   console.log("server is running on http://localhost:4000");

// })

// var count = 1;
// const greetUser = (greetnow, count) => {
//   greetnow(count);
// };

// greetUser(
//   (count) =>
//     count <= 3
//       ? setInterval(() => {
//           console.log("hello " + count);
//           count += 1;
//         }, 3000)
//       : ()=>console.log("hello " + count),
//   count
// );

// const increaseCount=(count,()=>{return setTimeout(()=>count+=1,3000)})
// console.log(increaseCount(1));

// SIMPLE API W I T H   E X P R E S S

// var products=[
//   {
//     productId:1,
//     Price:200000,
//     name: "sage perfume"
//   },
//   {
//     productId:2,
//     Price:50000,
//     name: "sage hair oil"
//   },
//   {
//     productId:2,
//     Price:10000,
//     name: "sage body spray"
//   }
// ];

// app.get('/', (req, res) => res.json({message:'Hello Ebuka, remeber to always show up'}))
// app.get('/about', (req, res)=>{
//   res.json({
//     developer: "Chukwuebuka Akumuo",
//     stack:"Full-stack Developer",
//     language: "Javasript"
//   })
// })
// app.get('/product', (req, res)=>{
//   res.json(products)
// })

// app.post('/product',(req,res)=>{
//  const product= req.body
//   products.push(product)
//   console.log(req.body);
//   res.send(product)
// })

require("dotenv").config();
const express = require("express");
const app = express();
const usersRoute= require("./routes/users.route.js")
const productsRoute= require("./routes/products.route.js")
const booksRoute= require("./routes/books.route.js")
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.get("/", (req,res)=>{
  res.status(200).json({
    status: "success",
    message: "welcome home",
  })
})
app.use("/users", usersRoute)
app.use("/products", productsRoute)
app.use("/books", booksRoute)



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
