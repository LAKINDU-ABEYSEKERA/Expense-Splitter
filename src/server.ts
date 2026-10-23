import { error } from "node:console";
import { createServer } from "node:http";

const server = createServer((req,res) => {
    const method = req.method;
    const pathname =  new URL(req.url ?? "/","http://localhost").pathname

    if (method === "GET" && pathname === "/health") {

        res.writeHead(200,{
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            status: "ok"
        }));

        return;
    }

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        error: "Not found"
    }));
});

server.listen(3000, "127.0.0.1",() => {
    console.log("Server running at http://127.0.0.1:3000");
})