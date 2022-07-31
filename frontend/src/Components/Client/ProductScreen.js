import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactLoading from 'react-loading';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import Rating from './Rating';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { useSelector } from 'react-redux';
import MessageBox from './MessageBox';
import LoadingBox from './LoadingBox';
const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, article: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export const ProductScreen = () => {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const params = useParams();
  const { id } = params;

  const { user } = useSelector((state) => state.auth);
  const [{ loading, error, article, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      article: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `http://localhost:3001/api/articles/find/${id}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };
    fetchData();
  }, [id]);

  // const dispa = useDispatch();
  // useEffect(() => {
  //   dispa(findArticleByID(id));
  // }, [dispa]);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const token = JSON.parse(localStorage.getItem('CC_Token'));

      const { data } = await axios.post(
        `http://localhost:3001/api/articles/${id}/reviews`,
        { rating, comment, nom: user.nom },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      article.reviews.unshift(data.review);
      article.numReviews = data.numReviews;
      article.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: article });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(error);
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  return (
    <div className="productScreen">
      {loading ? (
        <center>
          <ReactLoading type="spokes" color="red" height={'8%'} width={'8%'} />
        </center>
      ) : error ? (
        <p>Impossible d'afficher la liste des articles...</p>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <img
                className="img-large  "
                src={`data:image/image/png;base64,${article.imageartpetitf}`}
                alt={article.reference}
              ></img>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h1>{article.reference}</h1>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h1>{article.designation}</h1>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={article.rating}
                    numReviews={article.numReviews}
                  ></Rating>
                </ListGroup.Item>
                <ListGroup.Item>Pirce : ${article.prixVente}</ListGroup.Item>
                <ListGroup.Item>
                  Description:
                  <p>{article.description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>${article.prixVente}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {article.qtestock > 0 ? (
                            <Badge bg="success">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Unavailable</Badge>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {article.qtestock > 0 && (
                      <ListGroup.Item>
                        <div className="d-grid">
                          <Button variant="primary">Add to Cart</Button>
                        </div>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="my-3">
            <h2 ref={reviewsRef}>Reviews</h2>
            <div className="mb-3">
              {article.reviews.length === 0 && (
                <MessageBox>There is no review</MessageBox>
              )}
            </div>
            <ListGroup>
              {article.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.nom}</strong>
                  <Rating rating={review.rating} caption=" "></Rating>
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="my-3">
              {user ? (
                <form onSubmit={submitHandler}>
                  <h2>Write a customer review</h2>
                  <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      aria-label="Rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="1">1- Poor</option>
                      <option value="2">2- Fair</option>
                      <option value="3">3- Good</option>
                      <option value="4">4- Very good</option>
                      <option value="5">5- Excelent</option>
                    </Form.Select>
                  </Form.Group>
                  <FloatingLabel
                    controlId="floatingTextarea"
                    label="Comments"
                    className="mb-3"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </FloatingLabel>

                  <div className="mb-3">
                    <Button disabled={loadingCreateReview} type="submit">
                      Submit
                    </Button>
                    {loadingCreateReview && <LoadingBox></LoadingBox>}
                  </div>
                </form>
              ) : (
                <MessageBox>
                  Please{' '}
                  <Link to={`/login?redirect=/product/${article._id}`}>
                    Sign In
                  </Link>{' '}
                  to write a review
                </MessageBox>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
