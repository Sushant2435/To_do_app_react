import React, { useState, useEffect } from 'react'
import { jsPDF } from "jspdf";
import './style.css'

const handleClick = () => {
    let data = document.getElementsByClassName("list-of-data");
    let doc = new jsPDF();

    for (let i = 0; i < data.length; i++) {
        let text = data[i].textContent;
        text = `${(i + 1)}. ${text}`;
        doc.text(text, 10, (i + 1) * 10); // Add the text to the PDF

        // Add a new page if necessary
        if ((i + 1) % 50 === 0) {
            doc.addPage();
        }
    }

    // Save the PDF file
    doc.save("data.pdf");
};
const getLocalData = () => {
    const lists = localStorage.getItem("mytodolist");

    if (lists) {
        return JSON.parse(lists);
    } else {
        return [];
    }
};

const Todo = () => {
    const [inputData, setInputData] = useState("");
    const [items, setItems] = useState(getLocalData());
    const [isEditItem, setisEditItem] = useState("");
    const [toggleButton, settoggleButton] = useState(false);
    const addItem = () => {
        if (!inputData) {
            alert('Please fill the data');
        } else if (inputData && toggleButton) {
            setItems(
                items.map((curElem) => {
                    if (curElem.id === isEditItem) {
                        return { ...curElem, name: inputData }
                    }
                    return curElem;

                })
            );
            setInputData([]);
            setisEditItem();
            settoggleButton(false)
        } else {
            const myNewInputdata = {
                id: new Date().getTime().toString(),
                name: inputData,
            };
            setItems([...items, myNewInputdata]);
            setInputData("");

        }
    };
    // remove all elements
    const removeAll = () => {
        setItems([]);
    }
    // adding local storage
    useEffect(() => {
        localStorage.setItem("mytodolist", JSON.stringify(items));
    }, [items]);

    //edit the items
    const editItem = (index) => {
        const item_todo_edited = items.find((curElem) => {
            return curElem.id === index;
        });
        setInputData(item_todo_edited.name);
        setisEditItem(index);
        settoggleButton(true)
    };

    // how to delete items section
    const deleteItem = (index) => {
        const updatedItem = items.filter((curElem) => {
            return curElem.id !== index;
        })
        setItems(updatedItem);
    }
    return (
        <>
            <div className='main-div'>
                <div className="child-div">
                    <figure>
                        <img src="./images/todo-logo.png" alt="" />
                        <figcaption>Add Your List Here ✌️</figcaption>
                    </figure>
                    <div className='addItems'>
                        <input type="text" name="" id="" placeholder='✍️ Add Item' className='form-control' value={inputData} onChange={(event) => setInputData(event.target.value)} />
                        {toggleButton ? (
                            <i className="far fa-edit add-btn" onClick={addItem}></i>
                        ) : (
                            <i className="fa fa-plus add-btn" onClick={addItem}></i>
                        )
                        }
                    </div>
                    {/* {show out items} */}
                    <div className="showItems">
                        {items.map((curElem) => {
                            return (
                                <div className="eachItem" key={curElem.id}>
                                    <h2 className="list-of-data">{curElem.name}</h2>
                                    <div className="todo-btn">
                                        <i className="far fa-edit add-btn" onClick={() => editItem(curElem.id)}></i>
                                        <i className="far fa-trash-alt add-btn" onClick={() => deleteItem(curElem.id)}></i>
                                    </div>
                                </div>
                            )

                        })};
                    </div>
                    {/* {remove All buttons} */}
                    <div className="showItems"><button className="btn effect04" data-sm-link-text="Remove All" onClick={removeAll}><span>Check List</span></button>
                        <button className="btn effect04 btn2" data-sm-link-text="Click for Print list" onClick={handleClick}><span>Print Item list</span></button>

                    </div>
                </div>
            </div >
        </>
    )
}

export default Todo
