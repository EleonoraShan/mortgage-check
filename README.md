
<img width="699" height="165" alt="Screenshot 2025-09-10 at 19 45 55" src="https://github.com/user-attachments/assets/c8325c9c-7887-49ac-aef6-2f21a029b3da" />

# Lendomus

After the initial download and set up the app runs completely offline. Users (mortgage brokers) can use the app to analyse client documents for information like:
- Consistency
- Loan affordability
- Employment
- Etc

# How to run

Post install the desktop application can be ran with ```npm run tauri dev```. The app is predominantly designed to run on an Apple Silicon Mac.

On launch, if you already have Ollama installed and gpt-oss:20b downloaded Ollama will automatically be started and the application will run for you completely locally.

If you don't have either one (or both), you will see some instructions for how to download them both. Since the model is fairly large this can take a little while.

Once Ollama is installed and gpt-oss:20b downloaded (pulled) you can click the retry button to initialise the app

# How to test

It's most interesting to test with your own data. Everything stays on your computer, so you can attach documents like payslips, soft credit search reports and employment contracts. Otherwise, you can also find a sample bank statement in the sample-data folder to use and see what information the model flags as missing
