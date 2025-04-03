# Live Polling System  

## Backend
- Backend deployed on Render - https://live-polling-system-1.onrender.com

## Overview  
This project is a **Live Polling System** designed for interactive classroom engagement. It allows teachers to create and manage live polls while students can participate and view real-time results. The system ensures a smooth polling experience with real-time updates using WebSockets.  

## Features  

### **Teacher**  
- Create new polls  
- View live polling results  
- Ask a new question only when the previous one is answered  

### **Student**  
- Enter a unique name per tab session  
- Submit answers to polls  
- View live polling results after submission or timeout (60 seconds)  

## Tech Stack  
- **Frontend:** React, Redux (optional)  
- **Backend:** Express.js with Socket.io for real-time polling  
- **Hosting:** Full-stack deployment required  

## Additional Features
- Configurable poll duration  
- Teacher can remove students  

## Getting Started  

### **Setup & Installation**  
1. Clone the repository  
   ```sh  
   git clone <repo-url>  
   cd live-polling-system  
   ```  
2. Install dependencies  
   ```sh  
   npm install  
   ```  
3. Start the backend  
   ```sh  
   npm start  
   ```  
4. Start the frontend  
   ```sh  
   npm run dev 
   ```  
   
## Contribution  
Feel free to contribute by opening issues or submitting pull requests!  
