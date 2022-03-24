const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();



app.set("view engine", "ejs");

//must use to parse from body
app.use(bodyParser.urlencoded({extended: true}));

//use static files in the folder named public
app.use(express.static("public"));



app.get("/", function(req, res) {

//call the function get date stored in the date variable
const day = date.getDate();

  res.render("list", {
    listTitle: day,
    newListItems: items
  });
});

app.post("/", function(req, res){

const item = req.body.newItem;

if (req.body.list === "Work List"){

workItems.push(item);
  res.redirect("/work");
}else{
  items.push(item);

  res.redirect("/");

}

});


app.get("/work", function(req, res){

  res.render("list", {listTitle: "Work List", newListItems: workItems});
});


app.get("/about", function(req, res){

res.render("about");

});


app.listen(port, function() {

  console.log("Server started on port 3000");

});


// switch (currentDay) {
//   case 0:
//     day = "Sunday";
//     break;
//
//   case 1:
//     day = "Monday";
//     break;
//
//   case 2:
//     day = "Tuesday";
//     break;
//   case 3:
//     day = "Wednesday";
//     break;
//   case 4:
//     day = "Thursday";
//     break;
//
//   case 5:
//     day = "Friday";
//     break;
//   case 6:
//     day = "Saturday";
//     break;
//   default:
//     console.log(day);
// }
