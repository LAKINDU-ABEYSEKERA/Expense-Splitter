type ServerStatus = "starting" | "running" | "stopped";

interface StartupLog {
    status: ServerStatus;
    timestamp: Date;
    version: string;
}

function logStartup(log: StartupLog): void {
    const time = log.timestamp.toISOString();
    console.log(`[${time}] status=${log.status} version=${log.version}`);
}

const startup: StartupLog = {
    status: "starting",
    timestamp: new Date(),
    version: "0.0.1",

};

logStartup(startup);
logStartup({...startup, status:"running", timestamp: new Date()});