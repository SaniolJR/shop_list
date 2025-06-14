import React, { useState } from "react";
import Header from "./header";
import InfScroll from "./int_scroll";
import Folder from "./product_folder";
import AddButton from "./add_button";
import AddFolder from "./add_folder";

function Carts() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <main>
      <InfScroll
        containerTypeHTTPGet={`http://localhost:5016/return_cart_list?userId=1`}
        ContainerType={Folder}
      />
      <AddButton mode="cart" onClick={() => setShowAdd(true)} />
      {showAdd && <AddFolder onClose={() => setShowAdd(false)} />}
    </main>
  );
}

export default Carts;