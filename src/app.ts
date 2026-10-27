import express from "express"

const app = express();

app.use(express.json({strict: false}));

const db = {
    expenses: [] as any[]
}

app.post("/expenses",(req,res) => {
    const expense = {
        ...req.body,
        id: db.expenses.length + 1
    }

    db.expenses.push(expense);

    res.status(201).json(expense)
});

app.get("/expenses",(req,res) => {
    res.status(200).json(db.expenses);
});

app.get("/expenses/:id",(req,res) => {
    const id = Number(req.params.id);

    const expense = db.expenses.find(
        (expense) => expense.id === id
    )

    if(!expense) {
        res.status(404).json({
            error: "Not found"
        })

        return;
    }

    res.status(200).json(expense);

    });

    app.use((req,res) => {
        res.status(404).json({
            error: "No endpoint"
        });
    });

    app.listen(3000,"127.0.0.1",() => {
        console.log("Expense API running at http://127.0.0.1:3000");
    });