const https = require('https');

const token = process.env.CIRCLECI_TOKEN;
const target_repo = process.env.TARGET_REPO;
const target_job = process.env.TARGET_JOB;
const ignore_branches = process.env.IGNORE_BRANCHES.split(',');

function requestCircleCIBuild(repo, branch, callback) {
  const postData = {
    build_parameters: {
      CIRCLE_JOB: target_job,
    },
  };
  const postDataStr = JSON.stringify(postData);
  const options = {
    hostname: 'circleci.com',
    port: 443,
    path: `/api/v1.1/project/github/${repo}/tree/${branch}`,
    method: 'POST',
    auth: `${token}:`,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postDataStr.length,
    },
  };
  const req = https.request(options, (res) => {
    console.log(res.statusCode);

    let resBody = "";
    res.on('data', (chunk) => {
      resBody += chunk;
    });
    res.on('end', () => {
      console.log(resBody);
    });
  });

  req.on('error', (e) => {
    console.error(e);
    callback(e);
  });

  req.write(postDataStr);
  req.end(callback);
}

function processEvent(event, callback) {
  const params = event;
  console.log(params);

  if (!['opened', 'reopened'].includes(params.action)) {
    return callback(null, { msg: 'Not opened' });
  }

  const repo = params.pull_request.head.repo.full_name;
  const branch = params.pull_request.head.ref;

  if (!repo.includes(target_repo)) {
    return callback(null, { msg: 'Not supported repository' });
  }

  if (ignore_branches.find(b => b === branch)) {
    return callback(null, { msg: 'Not supported branch' });
  }

  requestCircleCIBuild(repo, branch, callback);
}


exports.handler = (event, context, callback) => {
  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? (err.message || err) : JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  processEvent(event, done);
};
