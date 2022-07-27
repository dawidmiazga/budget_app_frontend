import moment from "moment";

export function newDateYYYYMMDD(dateToChange) {
    var datePrased = moment(Date.parse(dateToChange)).format("YYYY-MM-DD");
    return datePrased;
};

export function newDateYYYYMM(dateToChange) {
    var datePrased = moment(Date.parse(dateToChange)).format("YYYY-MM");
    return datePrased;
};

export function newDateYYYY(dateToChange) {
    var datePrased = moment(Date.parse(dateToChange)).format("YYYY");
    return datePrased;
};

export function newDateMM(dateToChange) {
    var datePrased = moment(Date.parse(dateToChange)).format("MM");
    return datePrased;
}

export function newDateM(dateToChange) {
    var datePrased = moment(Date.parse(dateToChange)).format("M");
    return datePrased;
}

export function cycleCount(tDate, fDate, sDate, eDate, whatCycle, nazwa, cena) {
    var tDate = new Date(tDate);
    var fDate = new Date(fDate);
    var sDate = new Date(sDate);
    var eDate = new Date(eDate);

    var firstDayStartDate = new Date(sDate.getFullYear(), sDate.getMonth(), 1);
    var lastDayEndDate = new Date(eDate.getFullYear(), eDate.getMonth() + 1, 0);
    
    var mthCnt = 0;
    var mthCntPrep = 0;
    var yrCnt = 0;

    if (sDate <= eDate) {
        if (sDate < tDate) {
            sDate = tDate
        }
        if (eDate > fDate) {
            eDate = fDate
        }
        if (whatCycle == "Nie" &&
            newDateYYYYMMDD(tDate) >= newDateYYYYMMDD(firstDayStartDate) &&
            newDateYYYYMMDD(tDate) <= newDateYYYYMMDD(lastDayEndDate)
        ) {
            mthCnt += 1
        } else if (whatCycle == "Nie" && (
            newDateYYYYMMDD(tDate) >= newDateYYYYMMDD(firstDayStartDate) ||
            newDateYYYYMMDD(tDate) <= newDateYYYYMMDD(lastDayEndDate))
        ) {
            mthCnt = 0
        } else if (whatCycle == "Co miesiac") {
            yrCnt = (eDate.getFullYear() - sDate.getFullYear()) * 12;
            mthCnt = yrCnt + eDate.getMonth() - sDate.getMonth() + 1
        } else {
            var divideNr
            if (whatCycle == "Co pol roku") {
                divideNr = 6
            } else if (whatCycle == "Co rok") {
                divideNr = 12
            }
            if ((sDate.getMonth() - tDate.getMonth()) % divideNr != 0) {
                if (sDate.getMonth() < tDate.getMonth()) {
                    sDate = new Date(sDate.setMonth(tDate.getMonth()))
                } else {
                    sDate = new Date(sDate.setMonth(tDate.getMonth() + divideNr))
                }
            }
            yrCnt = (eDate.getFullYear() - sDate.getFullYear()) * 12;
            mthCntPrep = yrCnt + eDate.getMonth() - sDate.getMonth()
            mthCnt += Math.ceil(mthCntPrep / divideNr)
            if ((eDate.getMonth() - tDate.getMonth()) % divideNr == 0) {
                mthCnt += 1
            }
        }
    }
    if (mthCnt < 0) { mthCnt = 0 }
    return mthCnt;
};

export function getFirstDayOfYear(year,month) {
    return new Date(year,month, 1);
};

export function getLastDayOfYear(year,month) {
    return new Date(year,month, 31);
};

export function categoryMap(id, categoryList) {
    const arrCat = ([
        (categoryList.map(category => category.categoryname)),
        (categoryList.map(category => category.categoryid))
    ]);
    if (arrCat[1].includes(id)) {
        var idCurrentCat = arrCat[0][arrCat[1].indexOf(id)]
        return idCurrentCat;
    } else {
        return "N/A";
    }
};

export function dateFilter(targetDate, finishDate, choosenDate, expType) {

    targetDate = newDateYYYYMM(targetDate)
    finishDate = newDateYYYYMM(finishDate)

    if (choosenDate < targetDate || choosenDate > finishDate) { return false }
    if (expType == "Nie") {
        if (newDateYYYYMM(targetDate) == newDateYYYYMM(choosenDate)) {
            return true;
        } else { return false; }
    } else if ((newDateYYYYMM(targetDate) == newDateYYYYMM(choosenDate)) || (newDateYYYYMM(finishDate) == newDateYYYYMM(choosenDate)) || (newDateYYYYMM(targetDate) < newDateYYYYMM(choosenDate) && (finishDate) > newDateYYYYMM(choosenDate)) == true) {
        if (expType == "Co miesiac") {
            return true;
        } else if (expType == "Co pol roku") {
            if (((newDateMM(choosenDate) - newDateMM(targetDate)) % 6) == 0) {
                return true;
            } else { return false; }
        } else if (expType == "Co rok") {
            if (((newDateMM(choosenDate) - newDateMM(targetDate)) % 12) == 0) {
                return true;
            } else { return false; }
        }
    } else { return false; }

};

export function daysLeftCount(choosenDate) {
    var todayDay = new Date()
    choosenDate = new Date(choosenDate);
    choosenDate = new Date(choosenDate.getFullYear(), choosenDate.getMonth() + 1, 0);
    return (choosenDate.getDate() - todayDay.getDate() + 1);
};

export function checkIfRecordIsInTheMonth(cycle, targetDate, finishDate, CurrMonth, ChoosenMonth) {
    if (cycle == "Nie") {
        if (newDateYYYYMM(targetDate) == CurrMonth) {
            return true;
        } else { return false; }
    } else if (cycle == "Co miesiac") {
        if (newDateYYYYMM(targetDate) <= CurrMonth &&
            newDateYYYYMM(finishDate) >= CurrMonth) {
            return true;
        } else { return false; }
    } else if (cycle == "Co pol roku") {
        if ((newDateM(CurrMonth) - newDateM(targetDate)) % 6 == 0 &&
            newDateYYYYMM(targetDate) <= newDateYYYYMM(CurrMonth) &&
            newDateYYYY(targetDate) <= newDateYYYY(ChoosenMonth)) {
            return true;
        } else { return false; }
    } else if (cycle == "Co rok") {
        if (newDateYYYYMM(targetDate) <= CurrMonth &&
            newDateYYYYMM(finishDate) >= CurrMonth &&
            newDateMM(targetDate) == newDateMM(CurrMonth)) {
            return true;
        } else { return false; }
    }
};

// export function forCategories(expCategory, allCategories, currCategory, cycle, choosenMth, targetDate, finishDate) {
//     // console.log(choosenMth)
//     if (cycle == "Nie") {
//         if (categoryMap(expCategory, allCategories) == currCategory &&
//             newDateYYYYMM(targetDate) == newDateYYYYMM(choosenMth)) {
//             return true;
//         } else { return false; }
//     } else if (cycle == "Co miesiac") {
//         if (categoryMap(expCategory, allCategories) == currCategory &&
//             newDateYYYYMM(targetDate) <= newDateYYYYMM(choosenMth) &&
//             newDateYYYYMM(finishDate) >= newDateYYYYMM(choosenMth)) {
//             return true;
//         } else { return false; }
//     } else if (cycle == "Co pol roku") {
//         if (categoryMap(expCategory, allCategories) == currCategory &&
//             (newDateMM(choosenMth) - newDateMM(targetDate)) % 6 == 0 &&
//             newDateYYYYMM(targetDate) <= newDateYYYYMM(choosenMth) &&
//             newDateYYYYMM(finishDate) >= newDateYYYYMM(choosenMth)) {
//             return true;
//         } else { return false; }
//     } else if (cycle == "Co rok") {
//         if (categoryMap(expCategory, allCategories) == currCategory &&
//             newDateYYYY(targetDate) <= newDateYYYY(choosenMth) &&
//             newDateYYYY(finishDate) >= newDateYYYY(choosenMth) &&
//             newDateMM(targetDate) == newDateMM(choosenMth)) {
//             return true;
//         } else { return false; }
//     }
// };

export function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
};

export function getCatTotals(allCategories,expenses,categories,startdatenew,enddatenew,categoriesColor){
    var catData = [];
    var tempSum=[]
    for (let i = 0; i < allCategories.length; i++) {
        var checkValueCurrentYear = 0
        tempSum[i] =
            (expenses
                .filter(expense => (
                    categoryMap(expense.category, categories) == allCategories[i]
                ))
                .reduce((total, currentItem) => total = total + (currentItem.price *
                    cycleCount(
                        currentItem.target_date,
                        currentItem.finish_date,
                        newDateYYYYMMDD(startdatenew),
                        newDateYYYYMMDD(enddatenew),
                        currentItem.cycle,
                        currentItem.description,
                        currentItem.price
                    )), 0));

        checkValueCurrentYear += tempSum[i];
        if (checkValueCurrentYear != 0) {
            catData.push([checkValueCurrentYear, allCategories[i], categoriesColor[i]])
        }
    };
    return catData.sort(sortFunction);
};

export const arrayColumn = (arr, n) => arr.map(x => x[n]);
export const arrMthEng = ["01-Jan", "02-Feb", "03-Mar", "04-Apr", "05-May", "06-Jun", "07-Jul", "08-Aug", "09-Sep", "10-Oct", "11-Nov", "12-Dec"]
export const arrMthPol = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paz", "Lis", "Gru"]

export const formatter = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
});

export const formatPercentage = (value, locale = "en-GB") => {
    return Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(value);
};