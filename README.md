# MediMatch

![Expo](https://img.shields.io/badge/Expo-Latest-blue)
![React Native](https://img.shields.io/badge/React%20Native-Mobile%20App-lightblue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Google Maps](https://img.shields.io/badge/Google%20Maps-API-red)
![Gemini API](https://img.shields.io/badge/Gemini-API-orange)

MediMatch is a mobile application built with React Native and Expo, designed to help users understand where to go to find professional answers for their symptoms, medications, and health information in a simple, intuitive way. This is done with the usage of the Google Maps API to help users locate nearby clinics, pharmacies, and other healthcare resources. The app connects to a Supabase backend for authentication, data storage, and real-time features. It also integrates the Gemini API to provide AI-powered suggestions and insights throughout the user experience.

---

## How It Works

MediMatch uses Supabase for authentication and storing user-generated data.
When users enter symptoms or health questions, the app sends the prompt to the Gemini API, which returns AI-powered suggestions the app displays in real time.
The Google Maps API is used to display location-based results, helping users identify relevant medical facilities based on their needs.

---

## Features

- **AI-powered recommendations** using the Gemini API  
- **Location-based results** powered by the Google Maps API  
- **User authentication and profiles** backed by Supabase  
- **Secure data storage** for medical logs, symptoms, and history  
- **Clean and responsive UI** built with React Native + Expo  
- **Real-time syncing** for user data across devices

---

## Tech Stack

- **React Native** — core framework for building the mobile app  
- **Expo** — used to streamline development and deployment for both Android and iOS  
- **Visual Studio Code** — primary development environment  
- **Supabase** — database, auth, and backend services  
- **Gemini API** — conversational and generative AI functionality  
- **Google Maps API** — powering location search and map interactions  

---

## Getting Started

### Prerequisites
- Node.js and npm or yarn  
- Visual Studio Code  
- Expo CLI installed globally  
- A Supabase project with API keys  
- Gemini API key  
- Google Maps API key

---

## Installation

```bash
git clone https://github.com/yourusername/MediMatch.git
cd MediMatch
npm install
```

---

## Running the App

```bash
expo start
```

---

## Scripts
```bash
expo start     # Runs the development server
expo build     # Builds the project for deployment
npm install    # Installs dependencies
npm run lint   # Runs linting (if configured)
```
