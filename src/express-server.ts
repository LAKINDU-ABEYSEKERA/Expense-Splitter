import express, {type ErrorRequestHandler} from "express"

const app = express();

app.use(express.json({ strict: false}));

app.get("/health",(req,res) => {
    res.status(200).json({
        status:"ok"
    })
});

app.post("/echo", (req,res) => {
    res.status(200).json(req.body);
});

app.use((req,res) => {
    res.status(404).json({
        error:"Not found"
    });
});

const jsonErrorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    if(err?.type === "entity.parse.failed") {
        res.status(400).json({
            error: "Invalid JSON"
        });

        return;
    }

    next(err);
};

app.use(jsonErrorHandler);

app.listen(3000, "127.0.0.1",() => {
    console.log("Express server running at http://127.0.0.1:3000");
});