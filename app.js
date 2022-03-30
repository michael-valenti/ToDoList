const express = require("express");
const bodyParser = require("body-parser");

require('dotenv').config();
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const app = express();
const mongoPass = process.env.MONGO_DB_PASS;


app.set("view engine", "ejs");

//must use to parse from body
app.use(bodyParser.urlencoded({
  extended: true
}));

//use static files in the folder named public
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-mike:"+mongoPass+"@cluster0.bsfp4.mongodb.net/toDoListDB");

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

//List Schema that will store item documents
const listSchema = {
  name: String,
  items: [itemsSchema]
};

//list model based on list schema
const List = mongoose.model("List", listSchema);


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

//get the requested list name from the url
app.get("/:customListName", function(req, res){
//store requested list name into a const
const customListName = _.capitalize(req.params.customListName);
//Search List model to see if the list name exists
List.findOne({name: customListName}, function(err, foundList){
  if(!err){
    //If the requested list name doesn't exist
    if(!foundList){
      //Create a new list with that name
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      //Insert new list to collection
      list.save();
      res.redirect("/" + customListName);
    } else {
      //If the requested list does exist..
      //Render it to the screen
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items
      });
    }
  }
});

//insert new list containing the custom list name
//and our default items that we created already.

});


//When a new item is added (when plus button is pressed)
app.post("/", function(req, res) {

  //store the new item in const itemName
  const itemName = req.body.newItem;

  const listName = req.body.list;

  //create new item document using the item name model
  const item = new Item({
    name: itemName
  });

  //check if user is at the home route
  if(listName === date.getDate()){
    //insert new item into collection
    item.save();
    //after inserting the new item, redirect to the home route to display it
    res.redirect("/");
  }else { //find the list that matches the list name
    List.findOne({name: listName}, function(err, foundList){
      //insert new item to items array
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })

  }

});

//When the an item is marked as complete, post to the delete route
app.post("/delete", function(req, res) {

  //store the Id of the checked item
  const checkedItemId = req.body.checkbox;

  const listName = req.body.listName;

//check if user is at the home route
  if(listName === date.getDate()){
    //delete the checked item from the collection
    Item.findByIdAndRemove(checkedItemId, function(err) {
      //if there are no errors, let the console know the item was deleted
      //and update the home page.
      if (!err) {
        console.log("Successfully deleted item!");
        res.redirect("/");
      }
  });
} else {
  //search List for matching name. Delete item to the list.
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
    if(!err){
      res.redirect("/"+listName);
    }
  })
}

});

app.get("/about", function(req, res) {

  res.render("about");

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}


app.listen(port, function() {

  console.log("Server has started successfully!");


});
