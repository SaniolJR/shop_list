import React, { useState } from "react";
import InfScroll from "./int_scroll";
import Cart from "./cart-div";
import AddButton from "./add_button";
import AddCart from "./add_cart";

function Carts() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <main>
      <InfScroll
        containerTypeHTTPGet={`http://localhost:5016/return_cart_list?userId=1`}
        ContainerType={Cart}
      />
      <AddButton mode="cart" onClick={() => setShowAdd(true)} />
      {showAdd && <AddCart onClose={() => setShowAdd(false)} />}
    </main>
  );
}

export default Carts;