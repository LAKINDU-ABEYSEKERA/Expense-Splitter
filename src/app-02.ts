import express, {type ErrorRequestHandler} from "express"

interface Expense {
    id: number,
    description: string,
    amount: number,
    paidBy: string
}

type ExpenseInput = Omit<Expense,"id">

const app = express()

app.use(express.json())

const db = {
    expenses: [] as Expense[]
}

let nextId = 1;

function isExpenseInput(value: unknown):value is ExpenseInput{
    if(
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        return false
    }

    const input = value as Record<string,unknown>

    return (
        typeof input.description === "string" &&
        typeof input.amount === "number" &&
        Number.isFinite(input.amount) &&
        typeof input.paidBy === "string"
    )
}

app.post("/expenses", (req,res) => {
    const body: unknown = req.body;

    if(!isExpenseInput(body)) {
        res.status(404).json({
            error: "Invalid JSON"
        })

        return
    }

    const expense: Expense = {
        id: nextId++,
        description: body.description,
        amount: body.amount,
        paidBy: body.paidBy
    }

    db.expenses.push(expense);
    res.status(201).json(expense);
});


app.get("/expenses/:id",(req,res) => {
    const id = Number(req.params.id);

    const expense = db.expenses.find((expense) => (
        expense.id === id
    ))

    if(!expense) {
        res.status(404).json({
            error: "Expense Not Found"
        })

        return
    }

    res.status(200).json(expense);
});

app.get("/expenses", (req,res) => {
    const expenses = db.expenses

    if(!expenses) {
        res.status(404).json({
            error: "Not found"
        })

        return
    }

    res.status(200).json(expenses);
})

app.put("/expenses/:id",(req,res) => {
    const id = Number(req.params.id);

    const index = db.expenses.findIndex((expense) => (
        expense.id === id
    ))

    if(index === -1) {
        res.status(404).json({
            error: "Index not found"
        })

        return
    }

    const body: unknown = req.body;

    if(!isExpenseInput(body)) {
        res.status(400).json({
            error: "Invalid JSON"
        })

        return
    }

    const updateExpense: Expense = {
        id: id,
        description: body.description,
        amount: body.amount,
        paidBy: body.paidBy
    }

    db.expenses[index] = updateExpense;
    res.status(200).json(updateExpense)
})

app.delete("/expenses/:id",(req,res) => {
    const id = Number(req.params.id);

    const index = db.expenses.findIndex((expense) => (
        expense.id === id
    ))

    if(index === -1) {
        res.status(404).json({
            error: "Index not found"
        })

        return
    }

    const deleted = db.expenses.splice(index,1);

    if(!deleted) {
        res.status(500).json({
            error: "Delete Failed"
        })

        return
    }

    res.status(204).send();
})

const jsonErrorHandle: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    if(err?.type === "entity.parse.failed") {
        res.status(400).json({
            error: "Invalid JSON"
        })

        return
    }

    next(err)
}

app.use(jsonErrorHandle);

app.listen(3000, "127.0.0.1",() => {
    console.log("Expense API running at https://127.0.0.1:3000")
})