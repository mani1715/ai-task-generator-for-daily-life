document.getElementById("generate").addEventListener("click", async () => {
  const topic = document.getElementById("topic").value;
  const resultBox = document.getElementById("result");

  resultBox.textContent = "Generating...";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await response.json();

    if (data.success) {
      resultBox.textContent = data.data;
    } else {
      resultBox.textContent = `❌ Error: ${data.error}`;
    }
  } catch (err) {
    console.error(err);
    resultBox.textContent = "❌ Something went wrong!";
  }
});
