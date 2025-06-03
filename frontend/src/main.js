import React from 'react';
import ReactDOM from 'react-dom/client';
import Folder from './product_folder';
import './style.css';


//main file

function Main() {
  return (
    //background color
    <main className ="bg-color">
      <Folder></Folder> 
    </main>
  );
}

export default Main;