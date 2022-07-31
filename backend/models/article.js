import mongoose from 'mongoose';
import Categorie from './categorie.js';
import Scategorie from './scategorie.js';
import User from './user.js';
const reviewSchema = new mongoose.Schema(
  {
    nom: {  type: mongoose.Schema.Types.ObjectId, ref: User},
    comment: { type: String, required: true },
    rating: { type: Number,required: true },
  },
  {
    timestamps: true,
  }
);
const articleSchema = mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    designation: { type: String, required: true, unique: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number },
    reviews: [reviewSchema],
    prixAchat: { type: Number, required: false },
    prixVente: { type: Number, required: false },
    prixSolde: { type: Number, required: false },
    marque: { type: String, },
    qtestock: { type: Number, required: false },
    caracteristiques: { type: String, required: false },
    imageartpetitf: { type: String, required: false },
    imageartgrandf: { type: Array, required: false },
    categorieID: { type: mongoose.Schema.Types.ObjectId, ref: Categorie },
    scategorieID: { type: mongoose.Schema.Types.ObjectId, ref: Scategorie },
  },
  { timestamps: true }
);
const Article = mongoose.model('Article', articleSchema);
export default Article;
