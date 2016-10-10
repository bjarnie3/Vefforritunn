(function() {
  console.log("Javascript loaded");
  var addItemButton = document.getElementById("addItem");
  var deleteAllButton = document.getElementById("deleteAll");
  var textField = document.getElementById("Name");
  var itemList = document.getElementById("TextiTexti");
  var items = document.getElementById("items");

  addItemButton.addEventListener("click", appendItemToList);
  deleteAllButton.addEventListener("click", deleteAllItems);

  function appendItemToList(e){
    e.preventDefault();
    var text = textField.value;
    var item = itemList.value;
    console.log("Content of text field:" + text);
    var toDoContainer = document.createElement("div");

    
    var toDoContent = document.createElement("h2");
    var toDoList = document.createElement("p");
    var deleteButton = document.createElement("button");
    deleteButton.addEventListener("click", deleteItem);
    deleteButton.className += "deleteItem";
    toDoContainer.className += "toDoItem";
    toDoContent.textContent = text;
    deleteButton.textContent = "Delete Item";
    toDoList.textContent = item;
    toDoContainer.appendChild(toDoContent);
    toDoContainer.appendChild(toDoList);
    toDoContainer.appendChild(deleteButton);
    items.appendChild(toDoContainer);
  }

  function deleteItem(){
    console.log("Deleting item")
    var itemToDelete = this.parentNode;
    itemList.removeChild(itemToDelete);
  }

  function deleteAllItems() {
    console.log("Removing all items");
    var itemsToDelete = document.getElementsByClassName("toDoItem");
       while(itemsToDelete[0]) {
      itemsToDelete[0].parentNode.removeChild(itemsToDelete[0]);
    }
  }

})();