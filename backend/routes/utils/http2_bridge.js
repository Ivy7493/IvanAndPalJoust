const isHeroku = Boolean(process.env.PORT);

function RunOnHttp2Only(callable) {
  if (!isHeroku) callable();
}

module.exports = { isHeroku, RunOnHttp2Only };
