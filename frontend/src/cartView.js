import { useParams } from "react-router-dom";

function CartView() {
  const { id } = useParams();   //useParams to pobranie parametrów z URL, w tym przypadku id koszyka
  
}

export default CartView;