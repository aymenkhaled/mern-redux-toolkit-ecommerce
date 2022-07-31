import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {getCategories} from "../../Features/categorieSlice";
import AfficheCategories from "./AfficheCategories";
const ListCategories=()=>{
const dispatch = useDispatch();
useEffect(() => {
dispatch(getCategories());
},[dispatch
]);
return(
<div>
<AfficheCategories/>    
</div>
)
}
export default ListCategories
