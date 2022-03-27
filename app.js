const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();



app.set("view engine", "ejs");

//must use to parse from body
app.use(bodyParser.urlencoded({
  extended: true
}));

//use static files in the folder named public
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/toDoListDB");

//create items schema
const itemsSchema = new mongoose.Schema({
  name: String
});

//create Item model
const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: "Welcome to your To do list!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

//store default items in an array
const defaultItems = [item1, item2, item3];

//when the browser requests the home page..
app.get("/", function(req, res) {

//look in the DB for foundItems
  Item.find({}, function(err, foundItems) {
    //if the foundItems is empty
    if (foundItems.length === 0) {
      //insert the default items
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted default items list.");
        }
      });
      res.redirect("/");
    }
    //if default items are already present, then render them to the screen
    else {
      res.render("list", {
        listTitle: day,
        newListItems: foundItems
      });
    }

  });


  //call the function get date stored in the date variable
  const day = date.getDate();


});

//When a new item is added (when plus button is pressed)
app.post("/", function(req, res) {

//store the new item in const itemName
  const itemName = req.body.newItem;

//create new item document using the item name model
  const item = new Item({
    name: itemName
  });
//insert new item into collection
item.save();
//after inserting the new item, redirect to the home route to display it
res.redirect("/");
});

//When the an item is marked as complete, post to the delete route
app.post("/delete", function(req, res){

//store the Id of the checked item
const checkedItemId = req.body.checkbox;

//delete the checked item from the collection
Item.findByIdAndRemove(checkedItemId, function(err){
  //if there are no errors, let the console know the item was deleted
  //and update the home page.
  if(!err){
    console.log("Successfully deleted item!");
    res.redirect("/");
  }else{
    console.log(err);
  }

});

});

app.get("/work", function(req, res) {

  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});


app.get("/about", function(req, res) {

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
