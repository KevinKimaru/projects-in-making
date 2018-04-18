var today = new Date();
var year = today.getFullYear();
var month = today.getMonth();
var date = today.getDate();

module.exports = {
    sToday : new Date(year, month, date, 0, 0, 0),
    sTomorrow : new Date(year, month, date + 1, 0, 0, 0),
    sMonth : new Date(year, month, 0, 0, 0, 0),
    sNMonth : new Date(year, month + 1, 0 , 0, 0, 0),
};
