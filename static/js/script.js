function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function PlayButtonClick()
{
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

        if (left == 0 || top == 0 || left == width - 30 || top == height - 30)
        {
            touched = true;
        }
    } while(!touched);

    play_button.disabled = false;
    start_button.disabled = false;
    close_button.disabled = false;

    start_button.style.display = "none";
    document.getElementById("reload-btn").style.display = "inline-block";
}

function ReloadButtonClick()
{
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
    var workElement = document.getElementById("work");
    workElement.style.display = "none";
}