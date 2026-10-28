import express, {type ErrorRequestHandler} from "express"

interface Expense {
    id: number;
    description: string;
    amount: number;
    paidBy: string;
}

type ExpenseInput = Omit<Expense, "id">;

const app = express();

app.use(express.json());

const db = {
    expenses: [] as Expense[]
};

let nextId= 1;