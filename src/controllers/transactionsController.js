import { sql } from "../config/db.js";


export async function getTransactionsbyUserID(req,res) {
   
    try {
        const{userID} = req.params
        const transactions = await sql `
        SELECT * FROM transactions WHERE user_id = ${userID} ORDER BY Created_at DESC
        `
        res.status(200).json(transactions)
    } catch (error) {
        console.log('Error getting this transaction', error);
      res.status(500).json({message:'internal server error'})
    }
}

export async function createTransaction(req,res) {
    
         //send the fields that will be created in the transaction, example: title, amount, category, userID
         try {
           const{title, amount, category,user_id } = req.body
    
           if(!title || !category || !user_id || amount === undefined ) {
            return res.status(400).json({message: 'All fields are required'})
           }
    
           const transaction = await sql `
           INSERT INTO transactions(title, category, user_id, amount)
           VALUES (${title},${category}, ${user_id}, ${amount})
           RETURNING *
           `
           console.log(transaction);
           res.status(201).json(transaction[0]);
    
         } catch (error) {
          console.log('Error creating this transaction', error);
          res.status(500).json({message:'internal server error'})
         }
}

export async function deleteTransaction (req,res) {
    
        try {
            const{id} = req.params
    
            if (isNaN(parseInt(id))){
                return res.status(400).json({message:'Invalid transaction'})
            }
            const result = await sql `
            DELETE FROM transactions WHERE id = ${id} RETURNING *
            `
            if (result.length === 0){
                return res.status(404).json({message: 'Transaction not found'})
            }
            res.status(200),json({message: 'Transaction sucessfully deleted'})
    
        } catch (error) {
            console.log('Error getting this transaction', error);
          res.status(500).json({message:'internal server error'})
        }
    }

export async function getSummaryByUserId(req,res) {

    try {
    const {userID} = req.params;

    const balanceResult = await sql`
        SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userID}
    `

    const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transactions 
        WHERE user_id = ${userID} AND amount > 0 
    `

       const expenseResult = await sql`
        SELECT COALESCE(SUM(amount),0) as expenses FROM transactions 
        WHERE user_id = ${userID} AND amount < 0 
    `
    res.status(200).json({
        balance: balanceResult[0].balance,
        income: incomeResult[0].income,
        expense: expenseResult[0].expense
    })

    } catch (error) {
        console.log('Error getting this summary', error);
      res.status(500).json({message:'internal server error'})
    }
}


    
