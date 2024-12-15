
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("toast-form");
    
    form.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        const formData = new FormData(form);
        
        fetch("/submit", {
            method: "POST",
            body: formData,
        })
        .then(response => response.text()) 
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});

