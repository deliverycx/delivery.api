import * as _cluster from "cluster";
import * as os from "os";

const cluster = _cluster as unknown as _cluster.Cluster;
const cpus = os.cpus().length - 1;

export class WorkerProccess {
    static clusterizing(bootstrapCallback: Function) {
        if (cluster.isMaster) {
            console.log(
                "\x1b[32m",
                `Master process stated with PID: ${process.pid}`
            );

            for (let i = 0; i < cpus; i++) {
                cluster.fork();
            }

            cluster.on("exit", (worker, code, signal) => {
                console.log(
                    "\x1b[31m",
                    `Worker ${worker.process.pid} died. Restarting...`
                );
                cluster.fork();
            });
        } else {
            console.log(
                "\x1b[32m",
                `Worker process started with PID: ${process.pid}`
            );

            bootstrapCallback();
        }
    }
}
