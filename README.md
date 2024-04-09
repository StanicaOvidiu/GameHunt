# GameHunt
GameHunt is an online gaming store where users can make accounts and change details, buy or rent video games and can evaluate the price of a product that they own.
To run the project you need to:
Firebase:
1. Make a Firebase account and a Firebase project.
2. Install Firebase in visual studio code using npm (npm install firebase).
3. In the 'client' folder, create a file named firebase.config.js and in Firebase -> Settings -> General, add app and copy the SDK in the firebase.config.js file.
4. In Firebase -> Settings -> Service accounts -> Firebase Admin SDK -> Generate new private key, and copy the json in the 'server' folder and in that folder add in the createAdmin.js file in the serviceAccount constant, the path to that json.
EmailJS:
1. Make an EmailJS account.
2. Create a new email service and a new email template.
3. Click your username and in Account -> General, copy the public key (public key = user_id).
4. In CountDownTimer.js and Newsletter.js files, replace the service_id, template_id and user_id. 
Stripe:
1. Make a Stripe account.
2. Click on Developers -> API keys, and copy the publishable key in the App.js file and the secret key in the server.js file. 
The Transfer.js file is used to transfer data from data.js file to 'products' collection in firebase.