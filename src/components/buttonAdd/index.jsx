import React from "react";
import { toast } from "react-hot-toast";

function ButtonAdd() {
  const id = 1
  const handleOnclick = (id) => {
    console.log(id)
    toast.success('Thành công'+id)
  }
  return <button onClick={()=>handleOnclick(id)}>ButtonAdd</button>;
}

export default ButtonAdd;
