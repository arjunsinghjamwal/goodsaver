import express from 'express';
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsbyUserID
} from '../controllers/transactionsController.js';

const router = express.Router();

// ✅ This must come first
router.get("/summary/:userID", getSummaryByUserId);

// ✅ POST works here
router.post("/", createTransaction);

// ✅ DELETE route
router.delete("/:id", deleteTransaction);

// ✅ Catch-all userID route comes last
router.get("/:userID", getTransactionsbyUserID);

export default router;
