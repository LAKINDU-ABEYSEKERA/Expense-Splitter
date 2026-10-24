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
    // 3. POST /echo
    if (method === "POST" && pathname === "/echo") {
        // Store each incoming body chunk
        const chunks: Buffer[] = [];
    
        //Event 1: Collect the incoming chunks.
        req.on("data",(chunk: Buffer) => {
            chunks.push(chunk);
        });

        // Event 2: Process the body after all chunks arrive.
        req.on("end", () => {
            //Combine all chunks into one Buffer,
            //then convert it into a string.
            const rawbody = Buffer.concat(chunks).toString("utf8");

            //Validate that the body contains valid JSON.
            try{
                JSON.parse(rawbody);
            } catch {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    error: "Invalid JSON"
                }));

                return;
            }

            // Valid JSON: echo the original body
            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(rawbody);
        });

        // Do not fall through to the 404 response
        return;
    }

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        error: "Not found"
    }));
});

// 5. Start the server
server.listen(3000, "127.0.0.1",() => {
    console.log("Server running at http://127.0.0.1:3000");
})