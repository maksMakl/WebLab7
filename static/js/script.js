var recordCounter = 1;

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function AddMessage(msg)
{
    const date = new Date();
    const currDate = date.toLocaleString();
    //const datetime = `${currentDate.getUTCFullYear()}-${String(currentDate.getUTCMonth() + 1).padStart(2, '0')}-${String(currentDate.getUTCDate()).padStart(2, '0')} ${String(currentDate.getUTCHours()).padStart(2, '0')}:${String(currentDate.getUTCMinutes()).padStart(2, '0')}:${String(currentDate.getUTCSeconds()).padStart(2, '0')}`;
    var msg_box = document.getElementById("msgbox");
    msg_box.textContent = msg;
    localStorage.setItem(recordCounter, msg + "," + currDate);
    sendData(recordCounter, msg);
    recordCounter += 1;
}

function PlayButtonClick()
{
    AddMessage("Play button was clicked");

    var workElement = document.getElementById("work");
    var animElement = document.getElementById("anim");
    workElement.style.display = "block";

    var square = document.getElementById("square");
    var left = (animElement.getBoundingClientRect().width - 10) / 2 - 20;
    var top = (animElement.getBoundingClientRect().height - 10) / 2 - 20;

    if (Math.round(Math.random()) == 0)
    {
        left += 20;
    }
    if (Math.round(Math.random()) == 0)
    {
        top += 20;
    }

    square.style.marginLeft = `${left}px`;
    square.style.marginTop = `${top}px`;
}

async function StartButtonClick()
{
    AddMessage("Start button was clicked");

    var animElement = document.getElementById("anim");
    var play_button = document.getElementById("play-btn");
    var start_button = document.getElementById("start-btn");
    var close_button = document.getElementById("close-btn");
    play_button.disabled = true;
    start_button.disabled = true;
    close_button.disabled = true;

    var square = document.getElementById("square");
    var left = parseInt(window.getComputedStyle(square).marginLeft.slice(0, -2), 10);
    var top = parseInt(window.getComputedStyle(square).marginTop.slice(0, -2), 10);

    var width, height;
    var step = 1;
    var state = 0;
    var touched = false;
    do 
    {
        var animRect = animElement.getBoundingClientRect();
        var width = animRect.width;
        var height = animRect.height;

        await sleep(40); 
        switch (state)
        {
            case 0:
                left = Math.min(width - 30, left + step);
                state = 1;
                break;
            case 1:
                top = Math.min(height - 30, top + step);
                state = 2;
                break;
            case 2:
                left = Math.max(0, left - step);
                state = 3;
                break;
            case 3:
                top = Math.max(0, top - step);
                state = 0;
                break;
        }
        step += 1;

        square.style.marginLeft = `${left}px`;
        square.style.marginTop = `${top}px`;

        AddMessage(`Square moved to ${left} ${top}`);

        if (left == 0 || top == 0 || left == width - 30 || top == height - 30)
        {
            touched = true;
        }
    } while(!touched);

    AddMessage("Square touched a wall");

    play_button.disabled = false;
    start_button.disabled = false;
    close_button.disabled = false;

    start_button.style.display = "none";
    document.getElementById("reload-btn").style.display = "inline-block";
}

function ReloadButtonClick()
{
    AddMessage("Reload button was clicked");

    var animElement = document.getElementById("anim");

    var square = document.getElementById("square");
    var left = (animElement.getBoundingClientRect().width - 10) / 2 - 20;
    var top = (animElement.getBoundingClientRect().height - 10) / 2 - 20;

    if (Math.round(Math.random()) == 0)
    {
        left += 20;
    }
    if (Math.round(Math.random()) == 0)
    {
        top += 20;
    }

    square.style.marginLeft = `${left}px`;
    square.style.marginTop = `${top}px`;

    document.getElementById("reload-btn").style.display = "none";
    document.getElementById("start-btn").style.display = "inline-block";
}

function CloseButtonClick()
{
    AddMessage("Close button was clicked");
    var workElement = document.getElementById("work");
    workElement.style.display = "none";

    for (var i = 1; i < recordCounter; i++)
    {
        var msg = localStorage.getItem(i);
        sendDataFromLocal(i, msg);
    }

    localStorage.clear();
    recordCounter = 1;
}

function sendData(recordNumber, msg) 
{
    fetch("/send_data", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        recordNumber: recordNumber, 
        message: msg 
      }),
    })
}

function sendDataFromLocal(recordNumber, msg) 
{
    fetch("/send_data_local", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        recordNumber: recordNumber, 
        message: msg 
      }),
    })
}