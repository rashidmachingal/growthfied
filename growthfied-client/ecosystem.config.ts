module.exports = {
    apps: [
      {
        name: 'growthfied-client',
        script: 'npm',
        args: 'start',
        cwd: '/home/rashileo/Projects/growthfied.com/growthfied-client', // Replace with the path to your Next.js project
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  