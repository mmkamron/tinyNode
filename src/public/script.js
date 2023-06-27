const response = document.getElementById("shortUrl");
const urlInput = document.getElementById("urlInput");
const copyBtn = document.getElementById("copyBtn");
const shorten = () => {
    const url = urlInput.value.trim();
    if (url === "") {
        alert("Please enter a valid URL.");
        return;
    }

    fetch("/shorten", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ longUrl: url })
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            let json = JSON.stringify(data, null, 2);
            let shortUrl = JSON.parse(json).shortUrl;
            response.innerText = shortUrl;
            copyBtn.style.display = "inline-block";
        })
        .catch((error) => {
            console.log("Error:", error);
        });
};

function copy() {
    navigator.clipboard.writeText(response.innerHTML);
}
