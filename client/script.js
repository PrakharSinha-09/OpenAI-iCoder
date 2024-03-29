import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}


let micon=document.querySelector("#micOn")
let micoff=document.querySelector("#micOff")
const field=document.getElementsByTagName('textarea')[0]
let recognition;

if ('webkitSpeechRecognition' in window) 
{
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  micon.addEventListener('click', startRecognition);
  micoff.addEventListener('click', stopRecognition);
} 
else {
  outputDiv.innerHTML = 'Speech recognition is not supported in your browser.';
}

function startRecognition() {
    recognition.start();
    micon.style.display='none'
    micoff.style.display='inline'
    field.placeholder="Speak Now... Recognising"
    field.disabled=true
  }
  
  function stopRecognition() {
    recognition.stop();
    micon.style.display='inline'
    micoff.style.display='none'
    field.placeholder="Ask iCODER..."
    field.disabled=false
  }

  recognition.onresult = function (event) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      }
    }
    field.value = transcript;
  };

const intro=document.querySelector("#intro")

const handleSubmit = async (e) => {
    e.preventDefault()

    intro.style.display="none"
    chatContainer.style.display="block"

    field.placeholder="Ask  iCODER..."
    stopRecognition()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()
    // document.querySelector("#prompt").value= '';
    // micControl(false);

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // this will get the specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    //once we got the interval, we will clear the interval
    clearInterval(loadInterval)
    messageDiv.innerHTML = " "    //because we don't know at which point of loading are we in like it might be 1 dot, 2 dot or 3 oots and thus we want to keep it empty so that we are able to add the message

    if (response.ok) {
        const data = await response.json();                //this will give us actual response coming from the backend, but we need to parse it, which is @ next line
        const parsedData = data.bot.trim()                  // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }

    recognition.abort();
    recognition.stop();
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }

    recognition.abort();
})