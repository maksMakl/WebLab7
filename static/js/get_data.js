function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function closeToast(sender)
{
    var toast = sender.parentElement.parentElement
    toast.classList.add('hidden');
    await sleep(500)
    toast.remove()
}

function addToast(msg, pos)
{
    var toast = document.getElementById("toast-template").cloneNode(true);
    var toastContainer = document.getElementsByClassName("toast-container")[parseInt(pos, 10)];
    toast.style.display = "block";
    toast.id = "";
    toast.childNodes[3].textContent = msg;
    toastContainer.appendChild(toast);
}

function fetchData() {
    fetch('/get_data')
        .then(response => response.json()) 
        .then(data => {
            for (const record of data.data.split("\n"))
            {
                if (record == "")
                {
                    return;
                }

                const toastContent = record.split(";")[0];
                const toastPosition = record.split(";")[1];

                addToast(toastContent, toastPosition);
            }
            
        })
        .catch(error => console.error('Error fetching data:', error));
}

setInterval(fetchData, 5000);