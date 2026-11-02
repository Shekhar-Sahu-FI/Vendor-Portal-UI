// const { chromium } = require("playwright");

// (async () => {
  
//   const userDataDir = "./my-profile";
//   const chromePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"

//   const context = await chromium.launchPersistentContext(userDataDir, {
//     headless: false,  
//     executablePath: chromePath
//   });

//   const page = await context.newPage();

//   await page.goto("http://192.168.0.35:5000/swagger/index.html");

//   await page.getByRole("button", { name: "post /api/Auth/login" }).click();
//   await page.getByRole("button", { name: "Try it out" }).click();
//   const loginTextArea = await page.getByText('{ "emailId": "string", "');
//   await loginTextArea.click();
//   await loginTextArea.fill(
//     '{\n  "emailId": "shekhar.sahu@arpaerp.com",\n  "password": "QWer12!@"\n}'
//   );
//   await page.getByRole("button", { name: "Execute" }).click();
//   await page.locator("pre").filter({ hasText: '{ "token": "' }).click();

//   const loginRes = await page
//     .locator("pre")
//     .filter({ hasText: '{ "token": "' })
//     .textContent();
//   const token = JSON.parse(loginRes);

//   await page.getByRole("button", { name: "Authorize" }).click();
//   await page.locator('input[type="text"]').fill(`Bearer ${token.token}`);
//   await page.getByRole("button", { name: "Authorize" }).nth(1).click();
//   await page.getByRole("button", { name: "Close" }).click();
//   await page.getByRole("button", { name: "post /api/Auth/login" }).click();



//   console.log("✅ Browser is ready. Do your work. State will be saved.");
// })();
