# 🐝 Bee Stats

Bee Stats is a project to visualize user statistics from the BeeCrowd platform. It uses Puppeteer for web scraping and Express to serve a dynamic SVG with profile information, ideal for generating visually appealing profile cards.

## 📚 Table of Contents
- [📖 Overview](#-overview)
- [🛠 Technologies](#-technologies)
- [⚙️ Setup](#%EF%B8%8F-setup)
  - [📋 Prerequisites](#-prerequisites)
  - [⬇️ Installation](#%EF%B8%8F-installation)
  - [🚀 Running Locally](#-running-locally)
- [🎨 Using the Card Generator](#-using-the-card-generator)
- [📒 About](#-about)

## 📖 Overview

Bee Stats allows users to fetch and display statistics from their BeeCrowd profile in a dynamic SVG card format, similar to GitHub stats cards. The project uses Puppeteer to scrape profile data and Express to handle requests and serve the SVG.

## 🛠 Technologies

- **Puppeteer**: Headless Chrome Node.js API for web scraping
- **Express**: Web framework for handling HTTP requests
- **Node.js**: JavaScript runtime for building the server
- **SVG**: Scalable Vector Graphics for creating the profile card

## ⚙️ Setup

### 📋 Prerequisites

- Node.js
- npm or yarn

### ⬇️ Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/piedro404/bee-stats.git
    cd bee-stats
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```
    
### 🚀 Running Locally

1. **Start the Express server:**
    ```bash
    npm start
    ```

2. **Access the application at `http://localhost:3000`.**

## 🎨 Using the Card Generator

To generate a profile card, you need to get your profile ID from the BeeCrowd platform. Your profile ID is the numeric value found in the URL of your profile, e.g., `https://judge.beecrowd.com.br/judge/en/profile/385161`.

### Example

1. Find your BeeCrowd profile ID from the URL.
2. Use the following format to get your profile card:

    ```
    http://localhost:3000/stats/<profileId>
    ```

3. For example, if your profile ID is `385161`, you would access:

    ```
    http://localhost:3000/stats/385161
    ```

4. Embed the generated SVG in your README or any other platform that supports SVG rendering.

## 📒 About
Thank you all, I wish you great studies! If you want, get in touch at pedro.henrique.martins404@gmail.com.
