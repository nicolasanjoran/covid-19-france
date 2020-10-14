const parse = require('csv-parse')
// const fs = require('fs')


async function parseCsv(data) {
    return new Promise((resolve, reject) => {
        parse(data, { delimiter: ';' }, function (err, output) {
            resolve(output)
        })
    })
}


function filterCsv(csv, dept) {
    csv = csv.filter(row => row[1] == "0" && row[3] != null && !["2020-06-27","2020-06-28","2020-06-29","2020-06-30"].includes(row[2]))
    departements = new Set(csv.map(it => it[0]))
    if (dept) {
        csv = csv.filter(row => row[0] == dept)
    }
    let dates = [...new Set(csv.map(item => item[2]))];

    for(var i = 1 ; i < csv.length ; i++) {
        for(var col = 3 ; col < 7 ; col++) {
            if(csv[i][col] == 0 || csv[i][col] == null) {
                csv[i][col] = csv[i-1][col]
            }
        }
    }

    let res = dates.map(d => {
        let dVals = csv.filter(row => row[2] == d)

        let hosp = dVals.reduce((acc, val) => acc + parseInt(val[3]), 0)
        let rea = dVals.reduce((acc, val) => acc + parseInt(val[4]), 0)
        let rad = dVals.reduce((acc, val) => acc + parseInt(val[5]), 0)
        let dc = dVals.reduce((acc, val) => acc + parseInt(val[6]), 0)
        return [hosp, rea, rad, dc]
    })

    return { dates, res, departements }
    // stringify(res, { header: true, columns: ["date", "hosp", "rea", "rad", "dc"] }, function (err, output) {
    //     return output
    // })
}

window.parseCsv = parseCsv
window.getFiltered = filterCsv