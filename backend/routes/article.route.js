import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Article from '../models/article.js';
import { auth, isAuth } from '../middlewares/auth.js';
import {
  getArticles,
  getArticleByID,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articles.controllers.js';
const router = express.Router();
router.get('/', getArticles);
router.post('/', createArticle);
router.get('/find/:id', getArticleByID);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);
router.post(
  '/:id/reviews',
  auth,

  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Article.findById(productId);
    if (product) {
      // if (product.reviews.find((x) => x.nom === req.user.nom)) {
      //   return res
      //     .status(400)
      //     .send({ message: 'You already submitted a review' });
      // }

      const review = {
        nom: req.user.nom,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);
const PAGE_SIZE = 6;
router.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const categorieID = query.categorieID || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            reference: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categorieIDFilter =
      categorieID && categorieID !== 'all' ? { categorieID } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            prixVente: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'lowest'
        ? { prixVente: 1 }
        : order === 'highest'
        ? { prixVente: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Article.find({
      ...queryFilter,
      ...categorieIDFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Article.countDocuments({
      ...queryFilter,
      ...categorieIDFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);
export default router;
