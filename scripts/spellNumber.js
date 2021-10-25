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
    1: "ten",
    2: "twenty",
    3: "thirty",
    4: "forty",
    5: "fifty",
    6: "sixty",
    7: "seventy",
    8: "eighty",
    9: "ninety"
}

const hundred = " hundred";
const thousand = " thousand";
const million = " million ";
const minusSign = "minus ";

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

function spellArray(arrayOfDigits) {
    let wasSpelled = false;
    let spelling = "";
    if (arrayOfDigits[arrayOfDigits.length - 1] === "-") {
        arrayOfDigits.pop();
        spelling += minusSign;
    }
    switch (arrayOfDigits.length) {
        default: {
            spelling = spellTooBig();
            break;
        }
    //million
    case 7: {
        let index = 6;
        let thisDigit = arrayOfDigits[index];
        spelling += spellSingleDigit(thisDigit);
        spelling += million;
        if (isIndexFirstNonZero(arrayOfDigits, index)) {
            break;
        }
    }
    // hundred thousand
    case 6: {
        let index = 5;
        let thisDigit = arrayOfDigits[index];
        if (thisDigit !== 0) {
            spelling += spellSingleDigit(thisDigit);
            spelling += hundred;
            if (isIndexFirstNonZero(arrayOfDigits, index)) {
                wasSpelled = true;
            } else if (!divisibleByHundred(arrayOfDigits, index)){
                spelling += " and ";
            }
        }
    }
    //ten thousand
    case 5: {
        let index = 4;
        let thisDigit = arrayOfDigits[index];
        let nextDigit = arrayOfDigits[index - 1];
        if (thisDigit !== 0) {
            if (nextDigit === 0) {
                spelling += spellDoubleDigit(thisDigit);
                wasSpelled = true;
            } else if (thisDigit > 1) {
                spelling += spellDoubleDigit(thisDigit);
                spelling += "-";
            } else {
                spelling += spellTeens(nextDigit);
                wasSpelled = true;
            }
        }
    }
    //thousand
    case 4: {
        let index = 3;
        let thisDigit = arrayOfDigits[index];
        if (!wasSpelled && thisDigit !== 0) {
            spelling += spellSingleDigit(thisDigit);
            wasSpelled = false;
        }
        spelling += thousand;
        if (isIndexFirstNonZero(arrayOfDigits, index)) {
            break;
        } else {
            spelling += " ";
        }

    }
    // hundred
    case 3: {
        let index = 2;
        let thisDigit = arrayOfDigits[index];
        if (thisDigit !== 0) {
            spelling += spellSingleDigit(thisDigit);
            spelling += hundred;
        }
        if (isIndexFirstNonZero(arrayOfDigits, index)) {
            break;
        } else {
            spelling += " and ";
        }
    }
    // ten
    case 2: {
        let index = 1;
        let thisDigit = arrayOfDigits[index];
        let nextDigit = arrayOfDigits[index - 1];
        if (thisDigit !== 0) {
            if (nextDigit === 0) {
                spelling += spellDoubleDigit(thisDigit);
                break;
            } else if (thisDigit > 1) {
                spelling += spellDoubleDigit(thisDigit);
                spelling += "-";
            } else {
                spelling += spellTeens(nextDigit);
                break;
            }
        }
    }
    // one
    case 1: {
        let thisDigit = arrayOfDigits[0];
        spelling += spellSingleDigit(thisDigit);
    }
    //empty array
    case 0: {
        break;
    }
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

function spellSingleDigit(input) {
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
    let divisor = 10;
    let index = 0;
    let sign = "";
    if (deconstructee.includes("-")) {
        deconstructee = deconstructee.substring(1);
        sign = "-";
    }
    if (deconstructee === "0") {
        return [0];
    }
    while (deconstructee / divisor >= 0.1) {
        let trimGreaterPositions = deconstructee - Math.floor(deconstructee / divisor) * divisor;
        let nextDigit = Math.floor(trimGreaterPositions / (divisor / 10));
        divisor *= 10;
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
