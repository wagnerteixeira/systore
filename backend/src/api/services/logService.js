module.exports = function(headerLog, itemLog) {
  const getHeaders = (req, res, next) => {
    if (!req.body.dateGt || !req.body.dateGt) {
      return res
        .status(500)
        .json({ erros: ['Informe a data inicial e final para busca do log'] });
    }

    let dateGt = new Date(req.body.dateGt);
    let dateLt = new Date(req.body.dateLt);
    if (dateGt > dateLt) {
      return res
        .status(500)
        .json({ erros: ['Data inicial maior que data final!'] });
    }
    //dateLt.setHours(23, 59, 59, 999);
    //dateGt.setHours(0, 0, 0, 0);
    //dateGt.setDate(29);
    //console.log(dateGt);
    //console.log(dateLt);
    headerLog
      .find({ date: { $lte: dateLt, $gte: dateGt } })
      .sort({ date: -1 })
      .populate({
        path: 'items',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'items' }
      })
      .exec((error, headerLogs) => {
        if (error) return res.status(500).json({ erros: [error] });
        res.json(headerLogs);
      });
  };

  return {
    getHeaders
  };
};
