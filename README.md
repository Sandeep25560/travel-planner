Travel Planner

The **Travel Planner** is a web application designed to simplify trip planning by enabling users to create, edit, and organize personalized travel itineraries. The application incorporates features adding reviews, and viewing ratings, all powered by a robust backend system. This project leverages Flask, SQLAlchemy, and a secure authentication system to ensure user data is managed efficiently and securely.

## Project OverView
This application aims to make travel planning effortless and enjoyable by providing users with:
- A platform to manage detailed itineraries.
- A system for rating and reviewing travel destinations or plans.
- A secure and intuitive interface for personalized travel management. 

## Features
1. **User Authentication**:
   - Secure registration and login functionality.
   - Password-protected user profiles.

2. **Itinerary Management**:
   - Create, edit, and delete travel itineraries.
   - Organize plans with start and end dates, activities, and destinations.

3. **Review and Rating System**:
   - Add reviews for destinations or itineraries.
   - Rate destinations to share feedback with the community.
4. **Database Management**:
   - SQLAlchemy-powered database for efficient itinerary, user, and review data management.


## Problem Defination 

Travel planning often becomes overwhelming with numerous destinations, dates, and activities to coordinate. This application addresses these challenges by offering a streamlined platform to organize all aspects of travel in one place. Users can focus on enjoying their trips rather than worrying about the details.


## Getting Started
To set up and run this project, follow these steps:
1. Clone this repository to your local machine.
2. Create the database tables according to the project requirements.

## Prerequisites
-*pip*
-*PyCharm or Visual Studio Code*
-*Flask*
-*SQL database*

## Project Structure
The project structure is as follows:
- travel.db: this is the database file that is created when you run.
- signup.html:User registration page
- login.html : User Login Page
- add_itinerary.html : user can add itineraries
- view_itinerary.html :User can able to view itineraries
- home.html : This is the landing page of the web application
- mainpage.html : This is the post login user dashboard page 
- search_results.html : this is the page for search results of the locations
- __init__.py : It contains main method and sql related quires


## Dependencies
- Flask: Web framework for building the application's backend.
- SQLAlchemy: ORM for database interactions.
- Flask-Login: For user authentication and session management.
- Jinja2: Template engine for rendering HTML files dynamically.
- Flask-migrate: To Manage database

## Set up database migrations
- flask db init
- flask db migrate
- flask db upgrade


## Contributing
We welcome contributions to this project. If you have suggestions or improvements, feel free to submit a pull request. Please follow the project's coding standards and guidelines.
