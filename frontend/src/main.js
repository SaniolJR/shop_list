import React from 'react';
import ReactDOM from 'react-dom/client';
import Folder from './product_folder';
import InfScroll from './int_scroll'; // import komponentu infinite scroll
import './style.css';

//main file

function Main() {
  return (
    <main>
      {/* Infinite scroll z Folderami */}
      <InfScroll
        containerTypeHTTPGet="/api/folders" // <-- podaj swój endpoint
        ContainerType={Folder}
      />
    </main>
  );
}

export default Main;