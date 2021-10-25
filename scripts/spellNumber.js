const singleDigit = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    0: "zero"
}

const teens = {
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen"
}

const tens = {
    2: "twenty",
    3: "thirty",
    4: "forty",
    5: "fifty",
    6: "sixty",
    7: "seventy",
    8: "eighty",
    9: "ninety"
}

const orders = {
    0 : "",
    1 : " thousand ",
    2 : " million ",
    3 : " billion ",
    4 : " trillion ",
    5 : " quadrillion ",
    6 : " quintillion ",
    7 : " sextillion ",
    8 : " septillion "
}

const hundred = " hundred";
const minusSign = "minus ";
const and = " and ";

/**
 * 
 * When called, prints spelled form of "number-input" class publisher to the "spelling" class listeners
 * 
 */
function spellNumber() {
    let input = $(".number-input").val();
    if (!validated(input)) {
        return;
    }
    let deconstructed = deconstructNumber(input);
    let spelling = spellArray(deconstructed);
    $(".spelling").text(spelling);
}

function spellArray(digitArray) {
    let spelling = "";
    if (digitArray[digitArray.length - 1] === "-") {
        digitArray.pop();
        spelling += minusSign;
    }
    if (digitArray.length === 1 && digitArray[0] === 0){
        return singleDigit[0];
    }
    while (digitArray.length > 0){
        let orderNumber = Math.floor((digitArray.length-1) / 3);
        let order = orders[orderNumber];
        if (typeof order === "undefined"){
            return spellTooBig();
        }
        console.log(order);
        let tripletArray = getTriplet(digitArray);
        spelling += spellTriplet(tripletArray);
        spelling += order;
    }
    return spelling;
}

function getTriplet(digitArray){
    let triplet = [];
    let tripletLength = digitArray.length % 3;
    if (tripletLength === 0){
        tripletLength = 3;
    }
    let emptyOrders = 3 - tripletLength;
    for (let i = 0; i < emptyOrders; i++){
        triplet.unshift(0);
    }
    for (let i = 0; i < tripletLength; i++){
        triplet.unshift(digitArray.pop());
    }
    console.log(triplet);
    return triplet;
}

function spellTriplet(threeDigitArray){
    if (threeDigitArray.length > 3){
        throw new RangeError("Input array must be 3 or less elements long");
    }
    let spelling = '';
    let hundreds = threeDigitArray[2];
    let tens = threeDigitArray[1];
    let units = threeDigitArray[0];
    if (hundreds === 0 && tens === 0 && units === 0){
        return '';
    }
    spelling += spellHundreds(hundreds);
    if (tens > 1){
        if (hundreds !== 0){
            spelling += and;
        }
        spelling += spellTens(tens);
        if (units > 0){
            spelling += `-`;
            spelling += spellUnits(units);
        }
    } else if (tens > 0){
        if (hundreds !== 0){
            spelling += and;
        }
        spelling += spellTeens(units);
    } else {
        if (units > 0){
            if (hundreds !== 0){
                spelling += and;
            }
            spelling += spellUnits(units);
        }
    }
    return spelling;
}

function spellHundreds(digit){
    let spelling = '';
    if (digit !== 0) {
        spelling += spellUnits(digit);
        spelling += hundred;
    }
    return spelling;
}

function spellTens(digit){
    let spelling = '';
    if (digit !== 0) {
            spelling += tens[digit];
    }
    return spelling;
}


function spellDoubleDigit(secondDigit) {
    return tens[secondDigit];
}

function spellTeens(secondDigit) {
    let ten = 10;
    let constructedNumber = ten + secondDigit;
    return teens[constructedNumber];
}

function spellUnits(input) {
    return singleDigit[input];
}

function spellNothing() {
    return "give me a number";
}

function spellNaN() {
    return "a number, silly";
}

function spellTooBig() {
    return "too big for me";
}

function deconstructNumber(deconstructee) {
    let numberAsArray = [];
    let index = 0;
    let sign = "";
    if (deconstructee.includes("-")) {
        deconstructee = deconstructee.substring(1);
        sign = "-";
    }
    if (deconstructee === "0") {
        return [0];
    }
    for (let i = deconstructee.length - 1 ; i >= 0 ; i-- ) {
        let nextDigit = parseInt(deconstructee[i],10);
        numberAsArray[index++] = nextDigit;
    }
    if (sign === "-") {
        numberAsArray[numberAsArray.length] = sign;
    }
    console.log(numberAsArray);
    return numberAsArray;
}

/**
 * Validates param against multiple conditions
 * 
 * @param {string} stringValue a string to be validated
 * @returns {boolean} true if validation passed, false if  failed 
 */
function validated(stringValue) {
    let spelling;
    // check if input is empty
    if (stringValue === "") {
        spelling = spellNothing();
        $(".spelling").text(spelling);
        return false;
    }
    // check if input contains other than digits
    if (stringValue.match("[^0-9\-]") !== null) {
        spelling = spellNaN();
        $(".spelling").text(spelling);
        return false;
    }
    // check if input contains only one minus sign
    // and that it's in the beginning
    if (stringValue.indexOf("-") > 0 || stringValue.indexOf("-", 1) > 0) {
        spelling = spellNaN();
        $(".spelling").text(spelling);
        return false;
    }
    return true;
}

function isIndexFirstNonZero(array, index) {
    for (i = index - 1; i >= 0; i--) {
        if (array[i] !== 0) {
            return false;
        }
    }
    return true;
}

function divisibleByHundred(array, index) {
    for (i = index - 1; i >= index - 2; i--) {
        if (array[i] !== 0) {
            return false;
        }
    }
    return true;
}
