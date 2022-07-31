import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { addToCart } from '../../Features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import  Rating  from './Rating';

// import Button from 'react-bootstrap/Button';

function Product(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product } = props;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    
    };
    // const urlimage=process.env.REACT_APP_ADRESSE+"public/";

  return (
    <Card key={product._id}>
             
      <Link to={`/product/${product._id}`}>
        {' '}
        <img className="card-img-top" src={`data:image/image/png;base64,${product.imageartpetitf}` }alt="imageart" 
 />
      </Link>
      <Card.Body>

        {' '}
        <Link to={`/product/${product._id}`}>
        <Card.Title> {product.reference}</Card.Title>

        </Link>
        <Card.Text>
        <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
        </Card.Text>
        <Card.Text>
          {' '}
          <strong> {product.prixVente} $</strong>
        </Card.Text>
        {product.qtestock === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button onClick={() => handleAddToCart(product)} variant="primary">
            Add to cart
          </Button>
        )}
        <Link to={`/product/${product._id}`}>
          <Button variant="success">show More </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
export default Product;
