/* Create a self-firing function that is activated when the JavaScript
 * code is loaded. This prevents the global scope of the site from
 * being cluttered with variables that are not needed and prevents
 * other global functions/variables from being overridden.
 */
(function() {
  console.log("Javascript loaded");

  // Find the following elements in the DOM tree and make them accessible to
  // JavaScript as variables
  var addItemButton = document.getElementById("addItem");
  var deleteAllButton = document.getElementById("deleteAll");
  var textField = document.getElementById("thingToDo");
  var itemList = document.getElementById("items");

  addItemButton.addEventListener("click", appendItemToList);
  deleteAllButton.addEventListener("click", deleteAllItems);



  function appendItemToList(){
    console.log("Appending item to list");

    var text = textField.value;
    console.log("Content of text field:" + text);

    // Create elements needed to add an item to the to-do list
    var toDoContainer = document.createElement("div");
    var toDoContent = document.createElement("p");
    var deleteButton = document.createElement("button");

    deleteButton.addEventListener("click", deleteItem);

    // Add classes dynamically to the delete button and container
    // for each to do item
    deleteButton.className += "deleteItem";
    toDoContainer.className += "toDoItem";

    toDoContent.textContent = text;
    deleteButton.textContent = "Delete Item";

    // Add button and content to container. Note: So far, this element is
    // not visible because it is not part of the DOM (i.e. the page)
    toDoContainer.appendChild(toDoContent);
    toDoContainer.appendChild(deleteButton);

    // Add the container (and its content) to the itemList. Once this is
    // complete, the content is visible since it is now part of the
    // document (and its DOM tree)
    itemList.appendChild(toDoContainer);
  }



  function deleteItem(){
    console.log("Deleting item")
    // "this" is the Delete Item button in this case ("this" refers to the
    // item that called the function). We don't just want to delete the button,
    // we want to delete the container and everything in it. So, we take the
    // parent element of the button (the container) and remove that item
    // from the item list in stead. Now the entire list item and its
    // content is deleted.
    var itemToDelete = this.parentNode;
    itemList.removeChild(itemToDelete);
  }



  function deleteAllItems() {
    console.log("Removing all items");

    // Note: When using getElementsByClassName(), the function does not
    // return a single DOM element. It returns an array containing
    // all the elements of a specific class.
    var itemsToDelete = document.getElementsByClassName("toDoItem");

    // The array is "live" meaning that when we remove an element from the
    // array, the deleted element is popped from the array itself. Using a for
    // loop would be difficult here. It is better to use a while loop and pop
    // the first element until there are no further elements to be removed.
    while(itemsToDelete[0]) {
      itemsToDelete[0].parentNode.removeChild(itemsToDelete[0]);
    }
  }

})();