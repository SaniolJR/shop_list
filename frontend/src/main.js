import React from 'react';
import ReactDOM from 'react-dom/client';
import Folder from './product_folder';
import InfScroll from './int_scroll'; // import komponentu infinite scroll
import Header from './header'; // import komponentu header
import AddButton  from './add_button';
import './style.css';

//main file

function Main() {
  const userId = 1; // tutaj wpisz właściwe id użytkownika

  return (
    <main>
      {/* Infinite scroll z Folderami */}
      <Header />
      <InfScroll
        containerTypeHTTPGet={`http://localhost:5016/return_cart_list?userId=${userId}`}
        ContainerType={Folder}
      />
     <AddButton />
    </main>
  );
}

export default Main;