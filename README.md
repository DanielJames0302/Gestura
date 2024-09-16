# Gestura

## Inspiration
Gestura was inspired by the need to bridge the communication gap for the deaf-mute community in the digital world. Many platforms today lack accessibility for sign language users, limiting their engagement with content. Our goal was to create a platform where the deaf-mute community could connect, share, and consume content with ease, just like anyone else.

## What it does
Gestura is a platform for short video content that translates sign language into real-time captions. It allows the deaf-mute community to share their stories, watch content, and engage in meaningful ways through AI-powered translation of sign language to text.

## How we built it
Gestura was built using **MediaPipe** for sign language recognition, **FastAPI** for backend services, and **Convex** as our database for user authentication and data storage. The frontend was developed using **Next.js** to create a responsive and user-friendly interface. Each component of the platform was designed with accessibility and seamless user interaction in mind.

## Challenges we ran into
One of the main challenges was developing an accurate and efficient sign language recognition system. Processing video content in real-time and ensuring translation accuracy posed significant hurdles. Additionally, integrating multiple technologies (MediaPipe, FastAPI, and Next.js) to work smoothly together while maintaining low latency required creative problem-solving and optimization.

## Accomplishments that we're proud of
We’re proud of creating a functional platform that enables the deaf-mute community to communicate more easily through video content. The integration of AI to translate sign language into captions in real-time is a significant accomplishment that opens the door for greater inclusivity.

## What we learned
Throughout this project, we learned how crucial it is to design technology with accessibility in mind. We also gained deep insights into how AI-powered tools, such as sign language recognition, can drastically improve digital experiences for underrepresented communities. Collaboration across multiple tech stacks also taught us valuable lessons in system integration and performance optimization.

## What's next for Gestura
We plan to expand Gestura by enhancing the accuracy of our sign language recognition model and adding support for more sign languages worldwide. Additionally, we aim to create community features, allowing users to interact and share content more freely. We're also exploring partnerships with educational organizations to use Gestura as a learning platform for sign language.


## Installation
To run the project locally, you'll need to set up both the **client** (frontend) and **server** (backend) components.

### Prerequisites

- Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed for the client.
- For the server, ensure you have Python 3 installed and [FastAPI](https://fastapi.tiangolo.com/) and any dependencies from `requirements.txt`.

```bash
# Clone the repository
git clone https://github.com/DanielJames0302/Gestura.git

# Navigate into the project directory
cd Gestura

# navigate server folder
cd server

# Create virtual environment and download packages listed in requirements.txt
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt

# run FastAPI server
uvicorn main:app --reload

# navigate to client folder and run nextjs 
cd client
npm run dev


