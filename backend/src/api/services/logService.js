module.exports = function(headerLog, itemLog) {
  const getHeaders = (req, res, next) => {
    if (!req.body.initialDate || !req.body.finalDate) {
      return res
        .status(500)
        .json({ erros: ['Informe a data inicial e final para busca do log'] });
    }

    let initialDate = new Date(req.body.initialDate);
    let finalDate = new Date(req.body.finalDate);
    if (initialDate > finalDate) {
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
      .find({ date: { $gte: initialDate, $lte: finalDate } })
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
