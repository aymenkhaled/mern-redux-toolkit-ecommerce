import React, { useState, useEffect, useReducer } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { createCategorie } from '../../Features/categorieSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Form } from 'react-bootstrap';
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
const useStyles = makeStyles({
  formControl: {
    margin: '20px',
    minWidth: 120,
  },
});
const styles = {
  backgroundColor: 'green',
  height: '40px',
  width: '520px',
  borderRadius: '15px',
  position: 'fixed',
  top: '480px',
};
const AjoutCategorie = (props) => {
  const [{ loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const [nomcategorie, setNomcategorie] = useState('');
  const [imagecategorie, setImagecategorie] = useState('');
  const { error, success } = useSelector((state) => state.categories);
  const classes = useStyles();
  const dispa = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const cat = {
      nomcategorie: nomcategorie,
      imagecategorie: imagecategorie,
    };
    dispa(createCategorie(cat));
    props.handleclose();
  };
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });

      const { data } = await axios.post(
        'http://localhost:3001/api/upload',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      dispatch({ type: 'UPLOAD_SUCCESS' });

      toast.success('Image uploaded successfully');
      setImagecategorie(data.secure_url);
    } catch (err) {
      toast.error(err);
      dispatch({ type: 'UPLOAD_FAIL', payload: err });
    }
  };
  return (
    <div className="container">
      {success ? (
        <Stack
          sx={{ position: 'fixed', top: '55px', width: '90%' }}
          spacing={2}
        >
          <Alert severity="success">Added with Success</Alert>
        </Stack>
      ) : null}
      {error ? (
        <Stack
          sx={{ position: 'fixed', top: '55px', width: '90%' }}
          spacing={2}
        >
          <Alert severity="error">
            Error : Not Added please check if there is categorie with the same
            name
          </Alert>
        </Stack>
      ) : null}
      <form>
        <div style={{ position: 'fixed', top: '115px' }}>
          <div>ADD Category</div>
          <div className="mb-3">
            <FormControl className={classes.formControl}>
              <TextField
                variant="outlined"
                label="Category Name"
                value={nomcategorie}
                onChange={(e) => setNomcategorie(e.target.value)}
                required
              />
            </FormControl>
          </div>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload File</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {loadingUpload}
          </Form.Group>
          <Button
            variant="contained"
            sx={styles}
            onClick={(event) => handleSubmit(event)}
          >
            ADD
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AjoutCategorie;
