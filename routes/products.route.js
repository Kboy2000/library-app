const express = require("express")
const router = express.Router();

  var products= [
    {
      productId: 1,
      productName: "sage oil",
      price: "$5.99",
      category: "Kitchen",
      description: "for cooking and frying with low cholesterol"
    },
    {
      productId: 2,
      productName: "sage pots",
      price: "$15.99",
      category: "Kitchen",
      description: "for cooking without burning the food"
    },
    {
      productId: 3,
      productName: "sage perfume",
      price: "$11.99",
      category: "Beauty",
      description: "to help you always smell like your best"
    },
    {
      productId: 4,
      productName: "sage Denims",
      price: "$14.99",
      category: "Fashion",
      description: "to help you look fly"
    },
    {
      productId: 5,
      productName: "sage sports gear",
      price: "$7.99",
      category: "Sports",
      description: "to help you keep your cool while playing the sport you love"
    },
    {
      productId: 6,
      productName: "sage phones",
      price: "$199.99",
      category: "Technology",
      description: "to help you keep up with the latest technology trends"
    }
  ]
  
  //HELPER FUNCYION TO GENERATE UNIQUE IDS
  const generateId = () => {
    return products.length > 0 ? Math.max(...products.map((u) => u.productId)) + 1 : 1;
  };
  
  //INPUT VALIDATION MIDDLEWARE
  const validateUserInput = (req, res, next) => {
    const { productName, price, category, description } = req.body;
    if (!productName ||!price||!category||!description|| typeof productName !== "string"|| typeof category !== "string"|| typeof description !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Fields are required and must be a string",
      });
    }

    next();
  };
  const checkDuplicate = (req, res, next) => {
    let newProduct = req.body;
    let product = products.find((product) => product.email === newProduct.email); //make the productId a number
    if (product) {
      res.status(400).json({
        status: "error",
        message: "email taken",
      });
    }
    next();
  };
  
  //middleware for authorization
  
  const authorizationMiddleware= (req,res,next)=>{
    const myToken = process.env.MY_SECRET;
    const token = req.headers["authorization"]
    if (!token||token!==myToken) {
      res.status(401).json({
        status:"error",
        message:"Access denied",
      })
    }
    next()
    
    }
    
    
    router.get("/protected", authorizationMiddleware,(req,res)=>{
    res.status(200).json({
      status:"success",
      message:"Access Granted",
      data:products
    })
    })
  
  router.get("/:productId", (req, res) => {
    let productId = parseInt(req.params.productId); //gets the productId of the product to be updated
    product = products.find((product) => product.productId === productId); //make the productId a number
    if (!product) {
      res.status(404).json({
        status: "failure",
        message: "product not found",
        data: "",
      });
    }
    res.status(200).json({
      status: "success",
      message: "product found",
      data: product,
    });
  });
  //SEND A GET REQUEST TO ALL products OR READ
  router.get("/", (req, res) => {
    //EXTRACT QUERY PARAMETER FROM FILTERING
    const { category } = req.query;
  
    //FILTER products IF QUERY PARAM EXISTS
    let filteredproducts = products;
    if (category) {
      filteredproducts = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }
  
    res.status(200).json({
      status: "success",
      message: filteredproducts.length> 0 ? "products retrieved successfully" : "products not found",
      data: filteredproducts,
      total: filteredproducts.length,
    });
  });
  
  //ADD product OR CREATE
  router.post("/", (req, res) => {
    let newProduct = req.body; //gets the new product from the request body
    newProduct.productId = generateId(); //gives the productId of the new product
    if (!newProduct.category) {
      newProduct.category = "item";
    }
  
    products.push(newProduct); //add the new product to the list of products
    res.status(201).json(newProduct); //send the new product back to the client
  });
  
  //UPDATE product OR UPDATE
  router.patch("/:productId", (req, res) => {
    let productId = parseInt(req.params.productId); //gets the productId of the product to be updated
    product = products.find((product) => product.productId === productId); //make the productId a number
  
    if (!product) {
      return res.status(404).json({ 
        status: "error",
        message: `No product with productId ${productId} found` }); //if the product is not found
    }
    product.name = req.body.name || product.name; //use the name from the request body or the current name
    product.email = req.body.email || product.email; //use the email from the request body or the current email
    res.send(product);
  
    res.status(200).json({
      status: "success",
      message: "product successfully updated",
      data: product,
    });
  });
  
  //DELETE product OR DELETE
  router.delete("/:productId", (req, res) => {
    let productId = parseInt(req.params.productId); //gets the productId of the product to be deleted
    const index = products.findIndex((product) => product.productId === productId);
    if (index === -1) {
      return res.status(404).json({
        status: "error",
        message: "product not found ",
      });
    }
    // products.deleteOne({productId: productId})
    products.splice(index, 1);
    // product= products.filter(u=>u.productId===productId);
    res.status(200).json({
      status: "success",
      message: `product with productId ${productId} successfully deleted` });
  });
  
module.exports=router