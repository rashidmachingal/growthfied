const cluster = require('cluster');
const os = require('os');

// Check if the process is the master
if (cluster.isMaster) {
  const numCPUs = os.cpus().length; // Number of CPU cores
  console.log(`Master process ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...\n`);

  // Fork a worker for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart workers if they exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker processes run your existing app
  require('./index'); // Replace 'app' with the entry point of your project
}
