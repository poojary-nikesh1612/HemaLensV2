# HemaLens: AI-Powered Anemia Detection



---

## ## Key Features

* **📷 Image Upload & Camera Access**
* **🧠 AI-Powered Analysis**
* **⏱️ Instant Results**
* **📱 Fully Responsive Design**
* **🔔 User Feedback with Toast Notifications**

---

## ## Tech Stack & Architecture

* **Frontend**: Next.js, React, Tailwind CSS, Shadcn/UI, lucide react
* **Backend**: Flask, Python, TensorFlow/Keras, Gunicorn
* **Deployment**: Vercel (Frontend), Hugging Face Spaces (Backend), Docker

---

## ## Project Structure
```

HemaLensV2/
├── anemia-detector-backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── anemia_classifier.keras
│
└── anemia-detector-frontend/
├── src/
├── package.json
└── ...
```
## Getting Started: Running Locally

### ### Prerequisites

* Git
* Python 3.11+
* Node.js & npm

### ### 1. Backend Setup (Flask API)

```bash
# Clone the repository
git clone [https://github.com/Nikesh-koila/HemaLens-AI-Powered-Anemia-Detection.git](https://github.com/Nikesh-koila/HemaLens-AI-Powered-Anemia-Detection.git)
cd HemaLens-AI-Powered-Anemia-Detection/anemia-detector-backend

# Create and activate a virtual environment
# On Mac/Linux:
python3 -m venv venv
source venv/bin/activate

# On Windows:
python -m venv venv
.\venv\Scripts\activate

# Install the required dependencies
pip install -r requirements.txt
# Run the Flask server (starts     on [http://127.0.0.1:5000](http://127.0.0.1:5000))
flask run
```
### ### 2. Frontend Setup (Next.js App)

```bash
# Open a new terminal and navigate to the frontend directory
cd HemaLens-AI-Powered-Anemia-Detection/anemia-detector-frontend

# Install packages
npm install

# Create a .env.local file with the following content:
# NEXT_PUBLIC_API_BASE_URL=[http://127.0.0.1:5000](http://127.0.0.1:5000)

# Run the development server
npm run dev
```
## License
Distributed under the MIT License.
