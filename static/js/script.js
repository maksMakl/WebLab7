var records = [];
var recordsLocal = [];

var recordCounter = 1;

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function AddMessage(msg)
{
    const date = new Date();
    const currDate = date.toLocaleString();
    //const datetime = `${currentDate.getUTCFullYear()}-${String(currentDate.getUTCMonth() + 1).padStart(2, '0')}-${String(currentDate.getUTCDate()).padStart(2, '0')} ${String(currentDate.getUTCHours()).padStart(2, '0')}:${String(currentDate.getUTCMinutes()).padStart(2, '0')}:${String(currentDate.getUTCSeconds()).padStart(2, '0')}`;
    var msg_box = document.getElementById("msgbox");
    msg_box.textContent = msg;
    localStorage.setItem(recordCounter, msg + "," + currDate);
    await sendData(recordCounter, msg);
    recordCounter += 1;
}

async function PlayButtonClick()
{
    await AddMessage("Play button was clicked");

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


    var tableContainer = document.getElementById("table-container");
    for (var child of tableContainer.children)
    {
        tableContainer.removeChild(child);
    }
}

async function StartButtonClick()
{
    await AddMessage("Start button was clicked");

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

        await AddMessage(`Square moved to ${left} ${top}`);

        if (left == 0 || top == 0 || left == width - 30 || top == height - 30)
        {
            touched = true;
        }
    } while(!touched);

    await AddMessage("Square touched a wall");

    play_button.disabled = false;
    start_button.disabled = false;
    close_button.disabled = false;

    start_button.style.display = "none";
    document.getElementById("reload-btn").style.display = "inline-block";
}

async function ReloadButtonClick()
{
    await AddMessage("Reload button was clicked");

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

async function CloseButtonClick()
{
    await AddMessage("Close button was clicked");
    var workElement = document.getElementById("work");
    workElement.style.display = "none";

    for (var i = 1; i < recordCounter; i++)
    {
        var msg = localStorage.getItem(i);
        await sendDataFromLocal(i, msg);
    }

    localStorage.clear();
    recordCounter = 1;
    await fetchData();
    await fetchDataLocal();
    BuildTable();

}

async function sendData(recordNumber, msg) 
{
    await fetch("/send_data", {
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

async function sendDataFromLocal(recordNumber, msg) 
{
    await fetch("/send_data_local", {
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

async function fetchData() {
    await fetch('/get_data')
        .then(response => response.json()) 
        .then(data => {
            records = []
            for (const record of data.data.split("\n"))
            {
                if (record == "")
                {
                    return;
                }
    
                records.push(record);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

async function fetchDataLocal() {
    await fetch('/get_data_local')
        .then(response => response.json()) 
        .then(data => {
            recordsLocal = []
            for (const record of data.data.split("\n"))
            {
                if (record == "")
                {
                    return;
                }

                recordsLocal.push(record);
            }
            
        })
        .catch(error => console.error('Error fetching data:', error));
}

function BuildTable()
{
    var container = document.getElementById("table-container");
    var table = document.createElement("table");

    var tHeader = table.createTHead();
    var headerRow = tHeader.insertRow();
    var th1 = document.createElement("th");
    var th2 = document.createElement("th");
    th1.textContent = "Server data";
    th2.textContent = "Local-server data";
    headerRow.appendChild(th1);
    headerRow.appendChild(th2);

    var tBody = table.createTBody();
    for (var i = 0; i < records.length; i++)
    {
        var row = tBody.insertRow();
        var cell1 = row.insertCell();
        var cell2 = row.insertCell();
        cell1.textContent = records[i];
        cell2.textContent = recordsLocal[i];
    }

    container.appendChild(table);
}