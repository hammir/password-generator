const inputSlider=document.querySelector("[data-length-slider]");

const lengthDisplay=document.querySelector("[data-length-number]");

const passwordDisplay=document.querySelector("[data-password-Display]");

const copyBtn=document.querySelector("[data-copy]");

const copyMsg=document.querySelector("[data-copy-message]");

const uppercaseCheck=document.querySelector("#uppercase");

const lowercaseCheck=document.querySelector("#lowercase");

const numberCheck=document.querySelector("#numbers");

const symbolCheck=document.querySelector("#symbols");

const indicator=document.querySelector("[data-indicator]");

const generateBtn=document.querySelector("#generateButton");

const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols="!@#$%^~*)(_+`-=:;<,>.|/?}{][";

let password="";

let passwordLength= 10;

let checkCount=0;
handleSlider();
setIndicator("#ccc");

function handleSlider () {

    inputSlider.value=passwordLength;
    lengthDisplay.innerText =passwordLength;

    const min= inputSlider.min;
    const max= inputSlider.max;

    inputSlider.style.backgroundSize =( (passwordLength - min) * 100)/(max - min)+"% 100%";
    
}

function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    //shadow
     indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max)
{
   return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber()
{
    return getRndInteger(0,9);
}

function generateLowercase()
{
  return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase()
{
  return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol()
{
   const randNum=getRndInteger(0 , symbols.length);
   return symbols.charAt(randNum);
}

function calcStrength()
{
    let upperCheck=false;
    let lowerCheck=false;
    let symCheck=false;
    let numCheck=false;

    if(uppercaseCheck.checked) upperCheck = true;
    if(lowercaseCheck.checked) lowerCheck = true;
    if(symbolCheck.checked) symCheck = true;
    if(numberCheck.checked) numCheck = true;

    if(upperCheck && lowerCheck && symCheck && numCheck && passwordLength >=8)
    {
        setIndicator("#0f0");
    }
    
    else if((upperCheck||lowerCheck) && (symCheck||numCheck) && passwordLength>=6)
    {
        setIndicator("#ff0");
    }

    else{
        setIndicator("#f00");
    }
}

async function copyContent()
{ 
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e)
    {
        copyMsg.innerText="Failed";
    }

    //making copy message visible
    copyMsg.classList.add("active");

    //making copy message invisible after 2 seconds

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array)
{
    //fisher yates method to shuffle
    for(let i=array.length-1;i>0;i--)
    {
        const j= Math.floor(Math.random()*(i+1));

        //swapping number at i index and j index

        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    let str ="";
    array.forEach((element)=>{str+=element});
    return str;
}

function handleCheckBoxChange()
{
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{

        if(checkbox.checked)
        {
            checkCount++;
        }

    });
      
    //corner case 

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(sliderValue)=>{
    passwordLength =sliderValue.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
    else{
        alert("password field is empty");
    }
})

generateBtn.addEventListener('click',()=>{

//none of the boxes ae selected
if(checkCount<=0) return alert("Atleast check one box");

if(passwordLength < checkCount)
{
    passwordLength = checkCount; 
    handleSlider();
}
// Lets find new password

// firstly remove old password
password ="";

//add characters according to the checkboxes checked

// if(uppercaseCheck.checked)
// {
//     password += generateUppercase();
// }

// if(lowercaseCheck.checked)
// {
//     password += generateLowercase();
// }

// if(numberCheck.checked)
// {
//     password += generateRandomNumber();
// }

// if(symbolCheck.checked)
// {
//     password += generateSymbol();
// }

let funcArray =[];

if(uppercaseCheck.checked)
{
    funcArray.push(generateUppercase);
}

if(lowercaseCheck.checked)
{
    funcArray.push(generateLowercase);
}

if(numberCheck.checked)
{
    funcArray.push(generateRandomNumber);
}

if(symbolCheck.checked)
{
    funcArray.push(generateSymbol);
}
 
//compulsory addition
for(let i=0;i<funcArray.length;i++)
{
    password += funcArray[i]();
}

//remaining random addition
for(let i=0; i<passwordLength-funcArray.length;i++)
{
    let randFunc = getRndInteger(0,funcArray.length);
    password+=funcArray[randFunc](); 
}

//shuffling password
password = shufflePassword(Array.from(password));

//updating UI
passwordDisplay.value = password;

//calculate strength
calcStrength();
});

