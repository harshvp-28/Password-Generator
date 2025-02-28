const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector(".indicator");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()-_+={}[]:;?/\|.<>';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength- min)*100/(max-min)) + "% 100";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color; // Correctly set the background color
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`; // Add the glowing effect
}

function getRandomInteger(max,min) {
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateRandomNum() {
    return getRandomInteger(0,9);
}
function generateLowercase() {
    return String.fromCharCode(getRandomInteger(97,123));
}
function generateUppercase() {
    return String.fromCharCode(getRandomInteger(65,91));
};
function generateSymbol() {
    const randNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
};
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower &&(hasNum || hasSym) && password.length >= 8) {
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) &&(hasNum || hasSym) && password.length >= 6) {
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
};
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
};

function shufflePassword(array) {
    //Fischer yates method
    for(let i=array.length-1;i>0;i--) {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
});


function handleCheckBoxChange () {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) {
            checkCount++;
        }
    });

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);   
});
copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value) {
        copyContent();
    }
});

generateBtn.addEventListener('click', () => {
    if (checkCount === 0) 
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUppercase);
    if (lowercaseCheck.checked) funcArr.push(generateLowercase);
    if (numbersCheck.checked) funcArr.push(generateRandomNum);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

  

    for (let i = 0; i < funcArr.length; i++) {
        const char = funcArr[i]();
       
        password += char;
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length);
        
        const char = funcArr[randIndex]();
        
        password += char;
    }

    password = shufflePassword(Array.from(password));
    console.log("Final Password:", password);

    passwordDisplay.value = password;
    calcStrength();
});











