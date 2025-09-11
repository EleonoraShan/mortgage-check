# Lendomus

After the initial download and set up the app runs completely offline. Users (mortgage brokers) can use the app to analyse client documents for information like:
- Consistency
- Loan affordability
- Employment
- Etc

# How to run

Post install the application can be ran with npm run tauri dev

On launch, if you already have Ollama installed and gpt-oss:20b downloaded Ollama will automatically be launched and the application will run for you completely locally
If you don't have either one (or both), they will be automatically downloaded. Since the model is fairly large this can take a little while

# How to test

It's most interesting to test with your own data. Everything stays on your computer, so you can attach documents like payslips, soft credit search reports and employment contracts. Otherwise, you can also find a sample bank statement in the sample-data folder to use and see what information the model flags as missing
