import React,{useState} from 'react';
import {removeSelectedCategorie} from "../../Features/categorieSlice"
//npm install @mui/material @emotion/react @emotion/styled
//npm install mui-datatables --legacy-peer-deps
import MUIDataTable from "mui-datatables";
//npm i @mui/styles --legacy-peer-deps
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import ReactLoading from 'react-loading';
import {useNavigate } from "react-router-dom";
import {useDispatch,useSelector} from "react-redux"
import {deleteCategorie} from "../../Features/categorieSlice";
import ModalCategorie from './ModalCategorie';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
const AfficheCategories=()=>{
const[open,setOpen] = useState("");
const[_id,set_id] = useState("");
const navigate = useNavigate();
const dispatch = useDispatch();
const {categories,isLoading,error} = useSelector((state)=>state.categories);
const handleOpen=()=>{ 
setOpen(true)
}
const handleClose=()=>{
setOpen(false)
set_id("")
dispatch(removeSelectedCategorie())
}
const modifCateg=(value)=>{ 
setOpen(true)
set_id(value)
}
const handleDelete=(id)=>{
if(window.confirm("supprimer la catégorie O/N")) {
dispatch(deleteCategorie(id));
navigate("/admin/categories/listcat");
} 
}
const columns = [
{
label: "Name",
name: "nomcategorie"
},
{
label: "Image",
name:"imagecategorie",
options: {
customBodyRender : (imagecategorie) => (
<img
style={{ height: 40, width : 300, borderRadius: '10%' }}
src= {imagecategorie.length<300 ? imagecategorie: `data:image/image/png;base64,${imagecategorie}`}
alt=""
/>
)
}
},
{
name: "_id",
label: "Actions",
options: {
customBodyRender: (value) => (
<div>
<span
onClick={()=>{modifCateg(value)}}
style={{ cursor: 'pointer'}}
>
<NoteAltOutlinedIcon color='success' />
</span>
<span
onClick={(e) => handleDelete(value)}
style={{ cursor: 'pointer'}}
>
<DeleteForeverRoundedIcon color='error' />
</span>
</div>
)
}
}
];
// error handling & map successful query data 
const renderCategories = () => {
if (isLoading) return <center><ReactLoading type='spokes' color="red"
height={'8%'} width={'8%'} /></center>
if (error) return <p>Impossible d'afficher la liste des catégories...</p>
return <React.Fragment>
{categories && categories?.length > 0 ? <ThemeProvider
theme={createTheme()}>
<MUIDataTable
title="List categories"
data={categories}
columns={columns}
options={{
  rowsPerPageOptions:[5,10,15,100]
}}
/>
</ThemeProvider> :null}
</React.Fragment>
}
return(
<div style={{position: 'absolute','top':90,'left':250,width:'75%'}}>
<div>
{open && (
<ModalCategorie
handleClose={handleClose}
open={open}
_id={_id}
/>
)}
</div>
<div>
<div
style={{ background: "#303031", width:160, height:30, color: 
'white', borderRadius:20,cursor: 'pointer', margin:5, 
padding:5,fontFamily:"arial"}}
onClick={handleOpen}
>
<AddCircleRoundedIcon style={{ fontSize: "20px"}}/>
Nouvelle Catégorie
</div>
</div>
<div style={{margin:10}}>
{renderCategories()}
</div>
</div>
)
}
export default AfficheCategories
