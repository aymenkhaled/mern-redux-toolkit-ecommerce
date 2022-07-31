import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/order.js";
import User from "../models/user.js";
import Article from "../models/article.js";

const router = express.Router();


router.get(
  "/summary",
  expressAsyncHandler(async (req, res) => {
    const countProducts = await Order.countDocuments();
    if (countProducts) {
      const orders = await Order.aggregate([
        {
          $group: {
            _id: null,
            numOrders: { $sum: 1 },
            totalSales: { $sum: "$amount" },
          },
        },
      ]);
      const users = await User.aggregate([
        {
          $group: {
            _id: null,
            numUsers: { $sum: 1 },
          },
        },
      ]);
      const dailyOrders = await Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orders: { $sum: 1 },
            sales: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const productCategories = await Article.aggregate([
        {
          $group: {
            _id: "$marque",
            count: { $sum: 1 },
          },
        },
      ]);
      res.send({ users, orders, dailyOrders, productCategories });
    }
  })
);

export default router;
