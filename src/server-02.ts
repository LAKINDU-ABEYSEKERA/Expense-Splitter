import { createServer } from "node:http";
import { writeHeapSnapshot } from "node:v8";

const server = createServer((req,res) => {
    const method = req.method;
    const pathname =  new URL(req.url ?? "/", "http://localhost").pathname;

    if(method === "GET" && pathname === "/health") {
        res.writeHead(200,{
            "Content-Type" : "application/json"
        })

        res.end(JSON.stringify({
            status: "ok"
        }));

        return
    }

    if(method === "POST" && pathname === "/echo") {
        const chunks: Buffer[] = [];

        req.on("data" ,(chunk:Buffer) => {
            chunks.push(chunk);
        })

        req.on("end",() => {
            const rawbody = Buffer.concat(chunks).toString("utf8");

            try{
                JSON.parse(rawbody);
            } catch {
                res.writeHead(400,{
                    "Content-Type" : "application/json"
                });

                res.end(JSON.stringify({
                    error: "Invalid Json"
                }));

                return
            }

            res.writeHead(200,{
                "Content-Type" : "application/json"
            });

            res.end(rawbody);
        })

        return
    }


    res.writeHead(404,{
        "Content-type" : "application/json"
    })

    res.end(JSON.stringify({
        error: "not-found"
    }))
})

server.listen(3000,"127.0.0.1",() => {
    console.log("Server running at http://127.0.0.1:3000")
})