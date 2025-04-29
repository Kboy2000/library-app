const express = require("express")
const router = express.Router();
var users = [
    {
      id: 1,
      name: "Joel",
      email: "joel@gmail.com",
      role: "user",
    },
    {
      id: 2,
      name: "Emmanuel",
      email: "emmanuel@gmail.com",
      role: "admin",
    },
    {
      id: 3,
      name: "Samuel",
      email: "samuel@gmail.com",
      role: "user",
    },
    {
      id: 4,
      name: "Ebuka",
      email: "ebuka@gmail.com",
      role: "admin",
    },
  ];
  
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
    return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  };
  
  //INPUT VALIDATION MIDDLEWARE
  const validateUserInput = (req, res, next) => {
    const { name, email, role } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Name is required and must be a string",
      });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "A valid email is required",
      });
    }
    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({
        status: "error",
        message: "Role must either be 'user' or 'admin' ",
      });
    }
    next();
  };
  const checkDuplicate = (req, res, next) => {
    let newUser = req.body;
    let user = users.find((user) => user.email === newUser.email); //make the id a number
    if (user) {
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
      data:users
    })
    })
  
  router.get("/:id", (req, res) => {
    let id = parseInt(req.params.id); //gets the id of the user to be updated
    user = users.find((user) => user.id === id); //make the id a number
    if (!user) {
      res.status(404).json({
        status: "failure",
        message: "user not found",
        data: "",
      });
    }
    res.status(200).json({
      status: "success",
      message: "user found",
      data: user,
    });
  });
  //SEND A GET REQUEST TO ALL USERS OR READ
  router.get("", (req, res) => {
    //EXTRACT QUERY PARAMETER FROM FILTERING
    const { role } = req.query;
  
    //FILTER USERS IF QUERY PARAM EXISTS
    let filteredUsers = users;
    if (role) {
      filteredUsers = users.filter(
        (user) => user.role.toLowerCase() === role.toLowerCase()
      );
    }
  
    res.status(200).json({
      status: "success",
      message: filteredUsers.length> 0 ? "users retrieved successfully" : "users not found",
      data: filteredUsers,
      total: filteredUsers.length,
    });
  });
  
  //ADD USER OR CREATE
  router.post("", validateUserInput, checkDuplicate, (req, res) => {
    let newUser = req.body; //gets the new user from the request body
    newUser.id = generateId(); //gives the id of the new user
    if (!newUser.role) {
      newUser.role = "user";
    }
  
    users.push(newUser); //add the new user to the list of users
    res.status(201).json(newUser); //send the new user back to the client
  });
  
  //UPDATE USER OR UPDATE
  router.patch("/:id", (req, res) => {
    let id = parseInt(req.params.id); //gets the id of the user to be updated
    user = users.find((user) => user.id === id); //make the id a number
  
    if (!user) {
      return res.status(404).json({ 
        status: "error",
        message: `No user with ID ${id} found` }); //if the user is not found
    }
    user.name = req.body.name || user.name; //use the name from the request body or the current name
    user.email = req.body.email || user.email; //use the email from the request body or the current email
    res.send(user);
  
    res.status(200).json({
      status: "success",
      message: "user successfully updated",
      data: user,
    });
  });
  
  //DELETE USER OR DELETE
  router.delete("/:id", (req, res) => {
    let id = parseInt(req.params.id); //gets the id of the user to be deleted
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      return res.status(404).json({
        status: "error",
        message: "user not found ",
      });
    }
    // users.deleteOne({id: id})
    users.splice(index, 1);
    // user= users.filter(u=>u.id===id);
    res.status(200).json({
      status: "success",
      message: `user with id ${id} successfully deleted` });
  });
  
module.exports=router