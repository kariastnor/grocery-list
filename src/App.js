import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

// First check if there's a local list stored on computer
function getLocalStorage() {
  let storedList = localStorage.getItem("groc_list_22_10z");
  if (storedList) {
    // Need to convert back from string to object
    return JSON.parse(storedList);
  } else {
    return [];
  }
}

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  function handleSubmit(event) {
    event.preventDefault();
    if (!name) {
      handleAlert(true, "Please enter a value", "danger");
    } else if (name && isEditing) {
      setList((prevList) => {
        return prevList.map((listItem) => {
          if (listItem.id === editID) {
            return { ...listItem, title: name };
          } else {
            return listItem;
          }
        });
      });
      setName("");
      setIsEditing(false);
      setEditID(null);
      handleAlert(true, "Item edited", "success");
    } else {
      handleAlert(true, "Item added to grocery list", "success");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList((prevList) => [...prevList, newItem]);
      setName("");
    }
  }

  // Set up default values in the inputs, which are used if nothing is entered as inputs
  function handleAlert(show = false, msg = "", type = "") {
    setAlert({ show, msg, type });
  }

  function clearList() {
    handleAlert(true, "Empty list", "danger");
    setList([]);
  }

  function removeItem(id) {
    handleAlert(true, "Item removed", "danger");
    setList((prevList) => {
      return prevList.filter((item) => item.id !== id);
    });
  }

  function editItem(id) {
    const editedItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(editedItem.title);
  }

  useEffect(() => {
    // Save all list changes to local storage. Need to be in string format.
    // Should use unique local key name since it can cause issues if other websites use the same name
    localStorage.setItem("groc_list_22_10z", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <div className="alert-box">
        {alert.show && <Alert {...alert} handleAlert={handleAlert} />}
      </div>
      <form className="grocery-form" onSubmit={handleSubmit}>
        <h3>Grocery list</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            // placeholder="e.g. eggs"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "Save" : "Add"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
