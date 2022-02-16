const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const path = require('path');
const usbDevice = new escpos.USB(0x0483, 0x5743);
const devices = escpos.USB.findPrinter();
const axios = require('axios')


const options = { encoding: "GB18030" }
const printer = new escpos.Printer(usbDevice, options);
const tux = path.join(__dirname, 'test.png');

module.exports = function () {

    let print, getQuote, printData

    print = async function (data, debt, name) {
        console.log(data)
        let total, monthTotal
        let month = new Date()

        let today = month.toLocaleString('fi', { timeZone: "Europe/Helsinki" })



        total = 0
        monthTotal = 0
        month = month.getMonth()
        usbDevice.open(function (error) {
            escpos.Image.load(tux, function (image) {
                printer.align('ct')
                    .image(image, 's8')
                    .then(() => {
                        printer.close()
                    })
                printer.feed(2).align('CT').text(today)
                printer.feed(2).align('CT').style("B").size(2,2).text(name)
                printer.feed(2).align('CT').style("NORMAL").size(1)
                printer.feed(3).align('LT').close()
                data.map(val => {
                    amount = parseFloat(val.amount).toFixed(2)
                    date = new Date(val.timestamp)
                    monthFromData = date.getMonth()

                    date = date.toLocaleDateString('fi')

                    leadingText = amount < 0 ? "Pay in:" : "Buy in:"
                    leadingText += ` (${date})`
                    spaces = emptySpace(amount, leadingText)
                    printingText = leadingText + spaces + amount
                    total += amount * 1

                    if (monthFromData === month) {
                        monthTotal += amount * 1
                        printer
                            .text(printingText)
                    }
                })

                date = new Date()
                date = date.toLocaleDateString('en', { 'month': 'long' })
                leadingText = `Total : (${date})`
                spaces = emptySpace(monthTotal.toFixed(2), leadingText)
                printingText = leadingText + spaces + monthTotal.toFixed(2)

                leadingText = `Total transactions:`
                spaces = emptySpace(data.length + "", leadingText)
                printingTextTotal = leadingText + spaces + data.length

                leadingText = `Current Debt`
                spaces = emptySpace(debt.toFixed(2), leadingText)
                printingTextTotalDebt = leadingText + spaces + debt.toFixed(2)
                printer
                    .text('******************************************')
                    .text(printingText)
                    .feed(2)
                    .text('******************************************')
                    .text(printingTextTotal)
                    .text(printingTextTotalDebt)
                    .feed(5)
                    .cut()
                    .close()

            })
        })
    }
    printData = async function (data) {
        console.log(data)
        let total, monthTotal
        let month = new Date()

        let today = month.toLocaleString('fi', { timeZone: "Europe/Helsinki" })



        total = 0
        monthTotal = 0
        month = month.getMonth()
        usbDevice.open(function (error) {
            escpos.Image.load(tux, function (image) {
                printer.align('ct')
                    .image(image, 's8')
                    .then(() => {
                        printer.close()
                    })
                printer.feed(2).align('CT').text(today)
                printer.feed(2).align('CT').style("NORMAL").size(1)
                printer.feed(3).align('LT').close()
                data.map(val => {
                    amount = parseFloat(val.debtAmount).toFixed(2)
                    date = new Date(val.timestamp)
                    nameDisc = val.name

                    leadingText = nameDisc
                    spaces = emptySpace(amount, leadingText)
                    printingText = leadingText + spaces + amount
                    total += amount * 1
                    printer.text(printingText)
                })

                leadingText = `Current Debt`
                spaces = emptySpace(total.toFixed(2), leadingText)
                printingTextTotalDebt = leadingText + spaces + total.toFixed(2)
                printer
                    .text('******************************************')
                    .text(printingTextTotalDebt)
                    .feed(5)
                    .cut()
                    .close()

            })
        })
    }

    


    return {
        print: print,
        printData:printData
    }
}

function emptySpace(str, leading) {
    let spaces = "                                          "
    return spaces.substring(0, 42 - leading.length - str.length)
}
