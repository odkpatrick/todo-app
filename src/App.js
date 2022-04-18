import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './App.css';

function App() {
  const [newItem, setNewItem] = useState('');
  const [todoList, setTodoList] = useState([
    {
      complete: true,
      text: "Complete online JavaScript course",
      id:0
    },
    {
      complete: false,
      text: "Jog around the park 3x",
      id:1
    },
    {
      complete: false,
      text: "10 minutes meditation",
      id:2
    },
    {
      complete: false,
      text: "Read for 1 hour",
      id:3
    },
    {
      complete: false,
      text: "Pick up groceries",
      id:4
    },
    {
      complete: false,
      text: "Complete Todo App on Frontend Mentor",
      id:5
    },
  ]);
  const [displayList, setDisplayList] = useState(todoList);
  const [itemsCount, setItemsCount] = useState(displayList.length);
  const [filter, setFilter] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  const updateItemsCount = myList => setItemsCount(myList.length);

  const handleOnChange = event => setNewItem(event.target.value);

  const filterWithList = itemList => {
    let filterValue = filter;

    if(filterValue!==0) {
      let tempList = [];

      if(filterValue===1) {
        for(var i=0; i<itemList.length; i++) {
          if(itemList[i].complete===false) {
            tempList.push(itemList[i]);
          }
        }
      }
      
      if(filterValue===2) {
        for(i=0; i<itemList.length; i++) {
          if(itemList[i].complete===true) {
            tempList.push(itemList[i]);
          }
        }
      }

      setDisplayList(tempList.slice(0));
      updateItemsCount(tempList.slice(0));
    } else {
      setDisplayList(itemList.slice(0));
      updateItemsCount(itemList.slice(0));
    }

  }

  const handleSubmit = event => {
    let userInput = newItem;

    if(userInput.length > 0) {
      let listLength = todoList.length;
      let tempList = todoList.slice(0);
      tempList.push({
        complete: false,
        text: newItem,
        id: listLength
      });
      setTodoList(tempList.slice(0));
      setNewItem('');
      filterWithList(tempList.slice(0));
    }

    event.preventDefault();
  }

  const toggleComplete = itemId => {
    let tempList = todoList.slice(0);
    let completeStatus = tempList[itemId].complete;
    tempList[itemId].complete = !completeStatus;
    setTodoList(tempList.slice(0));
    filterWithList(tempList.slice(0));
  }

  const deleteItem = itemId => {
    let tempList1 = todoList.slice(0);
    let tempList2 = [];

    if(itemId===tempList1.length-1) {
      tempList2 = tempList1.slice(0, itemId);
    }

    if(itemId===0) {
      tempList2 = tempList1.slice(1);
      tempList2.forEach((item) => { item.id -= 1; })
    }

    if(itemId>0 && itemId<tempList1.length-1) {
      let tempOtherHalf = [];

      tempList2 = tempList1.slice(0, itemId);
      tempOtherHalf = tempList1.slice(itemId+1);
      tempOtherHalf.forEach((item) => {
        item.id -= 1; 
        tempList2.push(item);
      });
    }
    
    setTodoList(tempList2.slice(0));
    filterWithList(tempList2.slice(0));
  }

  const filterList = filterValue => {
    let currentList = todoList.slice(0);
    let tempList = [];

    if(filterValue !== filter) {
      if(filterValue===0) {
        tempList = currentList.slice(0);
      }
      
      if(filterValue===1) {
        for(var i=0; i<currentList.length; i++) {
          if(currentList[i].complete===false) {
            tempList.push(currentList[i]);
          }
        }
      }
      
      if(filterValue===2) {
        for(i=0; i<currentList.length; i++) {
          if(currentList[i].complete===true) {
            tempList.push(currentList[i]);
          }
        }
      }
      setDisplayList(tempList.slice(0));
      updateItemsCount(tempList.slice(0));
      setFilter(filterValue);
    }
  }

  const clearCompleted = () => {
    let currentList = todoList.slice(0);
    let tempList = [];
    let j = 0;
    for(var i=0; i<currentList.length; i++) {
      if(currentList[i].complete===false) {
        tempList.push({
          complete: false,
          text: currentList[i].text,
          id: j
        });
        j += 1;
      }
    }

    setTodoList(tempList.slice(0));
    filterWithList(tempList.slice(0));
  }

  const toggleTheme = () => {
    let currentDarkMode = darkMode;
    setDarkMode(!currentDarkMode);
  }

  const handleOnDragEnd = result => {
    let items = Array.from(displayList);
    const filterValue = filter;

    if (filterValue===0) {
      items = Array.from(todoList);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      for(let i=0; i<items.length; i++) {
        items[i].id = i;
      }
      setTodoList(items);
      setDisplayList(items);
    } else {
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setDisplayList(items);
    }
  }

  const title = (<h1 className="title">todo</h1>);
  
  const ToggleButton = (props) => (
    <button 
    className={"toggle-btn" + ((props.darkMode) ? " dark" : "")}
    onClick={() => {props.toggleTheme();}}
    >
      <span className="sr-only">Toggle page color theme</span>
    </button>
  );

  const ClearButton = (props) => (
    <button 
    className="clear-btn"
    onClick={() => { props.clearCompleted(); }}
    >
      clear completed
    </button>
  );

  const ListDisplayDetail = (props) => (
    <div  className="items-details-container">
      <p className="items-left-detail">{props.count} items left</p>
      <ClearButton clearCompleted={props.clearCompleted}/>
    </div>
  );

  const ListDisplayControl = (props) => (
    <div  className="items-details-controls-container">
      <button
      className={"control-btn" + ((props.filter===0) ? " active" : "")}
      onClick={() => {props.filterList(0)}}
      >all</button>
      <button
      className={"control-btn" + ((props.filter===1) ? " active" : "")}
      onClick={() => {props.filterList(1)}}
      >active</button>
      <button
      className={"control-btn" + ((props.filter===2) ? " active" : "")}
      onClick={() => {props.filterList(2)}}
      >completed</button>
    </div>
  );

  const CheckButton = (props) => (
    <button
    className={"list-item-check-btn" + ((props.complete) ? " done" : "")}
    onClick={() => {props.toggleComplete(props.id)}}
    >
      <span className="sr-only">check</span>
    </button>
  );

  const DeleteButton = (props) => (
    <button
    className="list-item-delete-btn"
    onClick={() => {props.deleteItem(props.id)}}
    >
      <span className="sr-only">delete</span>
    </button>
  );

  const ListDisplayTop = (props) => {
    const listItems = props.myList.map((item, index) => (
      <Draggable key={item.id} draggableId={item.text} index={index}>
        {(provided) => (
          <li 
          ref={provided.innerRef} 
          {...provided.draggableProps} 
          {...provided.dragHandleProps}
          >
            <div className={"list-item-container-" + item.id}>
              <div>
                <CheckButton 
                complete={item.complete}
                id={item.id}
                toggleComplete={props.toggleComplete} 
                />
                <p 
                className={"list-item-text" + ((item.complete) ? " done" : "")}
                onClick={() => {props.toggleComplete(item.id)}}
                >
                  {item.text}
                </p>
              </div>
              <DeleteButton 
              complete={item.complete} 
              id={item.id}
              deleteItem={props.deleteItem}
              />
            </div>
          </li>
        )}
      </Draggable>
    ));

    return (
      <div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul 
              className="tasks" 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              >
                { listItems }
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  };

  const ListDisplayBottom = (props) => (
    <div  className="list-display-bottom-container">
      <ListDisplayDetail 
      count={props.count} 
      clearCompleted={props.clearCompleted}
      />
      <ListDisplayControl 
      filterList={props.filterList} 
      filter={props.filter}
      />
    </div>
  );

  const ListDisplay = (props) => {
    return (
      <div  className="list-display-container">
        <ListDisplayTop 
        myList={props.myList} 
        toggleComplete={props.toggleComplete}
        deleteItem={props.deleteItem}
        />
        <ListDisplayBottom 
        count={props.count} 
        clearCompleted={props.clearCompleted}
        filter={props.filter}
        filterList={props.filterList}
        />
      </div>
    );
  };

  const footer = (
    <footer className="footer-wrapper">
      <p className="footer-text">Drag and drop to reorder list</p>
    </footer>
  );

  return (
    <div 
    className={"body-wrapper" + ((darkMode) ? " dark" : "")}
    >
      <header 
      className={"header" + ((darkMode) ? " dark" : "")}
      >
        <div className="header-content-wrapper">
          <div className="title-bar">
            { title }
            <ToggleButton 
            toggleTheme={toggleTheme}
            darkMode={darkMode}
            />
          </div>
          <div className="form-bar">
            <form 
            className="main-form"
            onSubmit={handleSubmit}
            >
              <div className="input-container">
                <label className="input-icon">
                  <span className="sr-only">Enter new todo item:</span>
                </label>
                <input 
                type="text" 
                className="input" 
                placeholder="Create a new todo..."
                value={newItem}
                onChange={handleOnChange}
                />
              </div>
            </form>
          </div>
        </div>
      </header>
      <div className="main-content-wrapper">
        <div>
          <ListDisplay 
          myList={displayList} 
          toggleComplete={toggleComplete}
          deleteItem={deleteItem}
          count={itemsCount}
          filter={filter}
          filterList={filterList}
          clearCompleted={clearCompleted}
          />
        </div>
        <div>
          { footer }
        </div>
      </div>
    </div>
  );
}

export default App;
