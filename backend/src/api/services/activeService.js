const active = (req, res, next) => {
  return res.status(200).send('Server active!');
};

module.exports = { active };
