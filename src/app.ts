import express, {type ErrorRequestHandler} from "express"

interface Expense {
    id: number,
    description: string,
    amount: number,
    paidBy: string
}

type ExpenseInput = Omit<Expense,"id">

const app = express();

app.use(express.json());

const db = {
    expenses: [] as Expense[]
}

let nextId = 1;

function isExpenseInput(value: unknown): value is ExpenseInput {
    if(typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        return false
    }

    const input = value as Record<string,unknown>;

    return (
        typeof input.description === "string" &&
        typeof input.amount === "number" &&
        Number.isFinite(input.amount) &&
        typeof input.paidBy === "string"
    );
}