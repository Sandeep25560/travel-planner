import random
from flask import jsonify, render_template
from app import app
from app.models import Location, User, Itinerary
from flask import render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, current_user, login_required
from app import app, db
from app.models import User

from flask import render_template, request, redirect, url_for
from app.models import Itinerary, Review
from flask_login import login_required
from datetime import datetime
image_filenames = ["image1.jpg", "image2.jpg", "image3.jpg","image4.jpg","image5.jpg","image6.jpg","image7.jpg","image8.jpg","image9.jpg","image10.jpg","image11.jpg","image12.jpg","image13.jpg","image14.jpg","image15.jpg","image16.jpg","image17.jpg","image18.jpg","image19.jpg","image20.jpg"]
@app.route('/')
def home():
    testimonials = [
    {"name": "Nadia", "title": "Travel Blogger", "quote": "Planning your trip by having all attractions already mapped makes everything easier.", "image": "/static/avatar1.jpg"},
    {"name": "Belinda and Kathy", "title": "", "quote": "This app is by far the best for trip planning. Love the integration with TripAdvisor.", "image": "/static/avatar2.jpg"},
    {"name": "D Littlejohn", "title": "", "quote": "The absolute best travel app I've ever tried. Tracks everything I need!", "image": "/static/avatar3.jpg"},
    {"name": "Josh M.", "title": "Travel Enthusiast", "quote": "This was great for organizing all my travel plans into one app.", "image": "/static/avatar4.jpg"},
    {"name": "Karen B.", "title": "", "quote": "Made our trip planning seamless! Loved the detailed itinerary suggestions.", "image": "/static/avatar5.jpg"},
    {"name": "Dennis G.", "title": "Road Tripper", "quote": "Helps me plan my super road trip. Love it!", "image": "/static/avatar6.jpg"},
    {"name": "Jack Corby", "title": "Adventure Seeker", "quote": "I love that I can find recommendations for things to do in one app.", "image": "/static/avatar7.jpg"},
    {"name": "Beatriz Sauma", "title": "", "quote": "Super useful for creating a bucket list of places to visit.", "image": "/static/avatar8.jpg"},
    {"name": "Milton James", "title": "Solo Traveler", "quote": "The best tool ever to plan trips. Very user-friendly and organized.", "image": "/static/avatar9.jpg"},
    {"name": "Jenny La Fontaine", "title": "", "quote": "Makes it so easy to plan and have all travel details in one place.", "image": "/static/avatar10.jpg"},
    {"name": "Alan MacKinnon", "title": "", "quote": "Exceptional for trip planning. The AI map view is a game-changer!", "image": "/static/avatar11.jpg"},
    {"name": "Sharon Brewster", "title": "Travel Enthusiast", "quote": "Amazing app! Easy to use, and I love the AI functionality.", "image": "/static/avatar12.jpg"},
    {"name": "Reyna Wilcox", "title": "", "quote": "The maps feature is very helpful for visualizing routes and mileage.", "image": "/static/avatar13.jpg"},
    {"name": "Lydia Yang", "title": "Founder @LydiaScapes", "quote": "Perfect for planning a road trip and exploring climbing destinations.", "image": "/static/avatar14.jpg"},
    {"name": "Cleo Maranski", "title": "", "quote": "Made organizing our road trip simple and easy. Highly recommend!", "image": "/static/avatar15.jpg"},
    {"name": "Abigail King", "title": "Founder @Inside the Travel Lab", "quote": "This app has been my go-to for planning trips for years!", "image": "/static/avatar16.jpg"},
    {"name": "Ioanna C.", "title": "Travel Blogger", "quote": "Feels like the app reads my mind. Everything I need is included.", "image": "/static/avatar17.jpg"},
    {"name": "Hannah L.", "title": "", "quote": "Integrates with Google Maps and reviews perfectly. Highly recommend.", "image": "/static/avatar18.jpg"},
    {"name": "Joel Krautz", "title": "Family Planner", "quote": "Better than spreadsheets! Easy to organize family holidays.", "image": "/static/avatar19.jpg"},
    {"name": "Aira Manahan", "title": "", "quote": "Perfect for group trips! Everything from expenses to distance tracking.", "image": "/static/avatar20.jpg"},
]
    return render_template('home.html', testimonials=testimonials,enumerate=enumerate)
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('mainpage'))

    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
            flash('Username or email already exists.', 'danger')
            return redirect(url_for('signup'))

        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        flash('Account created successfully! Please log in.', 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('mainpage'))  
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('mainpage')) 
        flash('Invalid email or password.', 'danger')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('home'))
from app import login_manager
from app.models import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
@app.route("/mainpage")
@login_required
def mainpage():
    username = current_user.username
    user_itineraries = Itinerary.query.filter_by(user_id=current_user.id).all()
    for itinerary in user_itineraries:
        itinerary.image_url = f"/static/images/{random.choice(image_filenames)}"
    return render_template("mainpage.html", username=username, itineraries=user_itineraries,now=datetime.now)

@app.route('/add-itinerary', methods=['GET', 'POST'])
@login_required
def add_itinerary():
    if request.method == 'POST':
        title = request.form['title']
        locations = request.form['locations']
        start_date = datetime.strptime(request.form['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(request.form['end_date'], '%Y-%m-%d').date()
        new_itinerary = Itinerary(
            title=title,
            locations=locations,
            start_date=start_date,
            end_date=end_date,
            user_id=current_user.id
        )
        db.session.add(new_itinerary)
        db.session.commit()
        flash('Itinerary added successfully!', 'success')
        return redirect(url_for('mainpage'))
    return render_template('add_itinerary.html')
@app.route('/delete-itinerary', methods=['POST'])
def delete_itinerary():
    itinerary_id = request.form.get('itinerary_id')
    if itinerary_id:
        itinerary = Itinerary.query.filter_by(id=itinerary_id, user_id=current_user.id).first()
        if itinerary:
            db.session.delete(itinerary)
            db.session.commit()
            flash("Itinerary deleted successfully!", "success")
        else:
            flash("Itinerary not found or not authorized!", "danger")
    return redirect(url_for('mainpage'))

# @app.route('/itinerary/<int:itinerary_id>/add-review', methods=['POST'])
# @login_required
# def add_review(itinerary_id):
#     itinerary = Itinerary.query.get(itinerary_id)
#     if itinerary and itinerary.user_id == current_user.id:
#         place_name = request.form['place_name']
#         rating = request.form['rating']
#         comment = request.form['comment']
#         new_review = Review(
#             place_name=place_name,
#             rating=rating,
#             comment=comment,
#             user_id=current_user.id,  
#             itinerary_id=itinerary.id
#         )
#         db.session.add(new_review)
#         db.session.commit()
#         flash('Review added successfully!', 'success')
#         return redirect(url_for('view_itinerary', itinerary_id=itinerary.id))
#     flash('Itinerary not found or unauthorized access.', 'danger')
#     return redirect(url_for('home'))
@app.route('/add-review', methods=['POST'])
@login_required
def add_review():
    itinerary_id = request.form.get('itinerary_id')
    place_name = request.form.get('place_name')
    rating = request.form.get('rating')
    comment = request.form.get('comment')
    
    # Find the itinerary and ensure the user is authorized to add a review
    itinerary = Itinerary.query.get(itinerary_id)
    if itinerary and itinerary.user_id == current_user.id:
        # Create the new review
        new_review = Review(
            place_name=place_name,
            rating=rating,
            comment=comment,
            user_id=current_user.id,  
            itinerary_id=itinerary.id
        )
        db.session.add(new_review)
        db.session.commit()
        flash('Review added successfully!', 'success')
    else:
        flash('Itinerary not found or unauthorized access.', 'danger')
    
    return redirect(url_for('mainpage'))  # Redirect back to the main page
@app.route('/itinerary/<int:itinerary_id>')
@login_required
def view_itinerary(itinerary_id):
    itinerary = Itinerary.query.get(itinerary_id)
    if itinerary and itinerary.user_id == current_user.id:
        reviews = Review.query.filter_by(itinerary_id=itinerary.id).all()
        return render_template('view_itinerary.html', itinerary=itinerary, reviews=reviews)
    flash('Itinerary not found or unauthorized access.', 'danger')
    return redirect(url_for('home'))



@app.route('/create-itinerary', methods=['GET', 'POST'])
@login_required
def create_itinerary():
    if request.method == 'POST':
        title = request.form['title']
        start_date = request.form['start_date']
        end_date = request.form['end_date']
        locations = request.form['locations']

        # Get the logged-in user
        user_id = current_user.id

        # Create a new itinerary
        itinerary = Itinerary(
            title=title,
            start_date=start_date,
            end_date=end_date,
            locations=locations,
            user_id=user_id
        )

        # Add to the database
        db.session.add(itinerary)
        db.session.commit()

        return redirect(url_for('home'))

    return render_template('create_itinerary.html')

@app.route('/search', methods=['GET'])
def search():
    location = request.args.get('location')
    if location:
        # Use `startswith` to find names starting with the search term
        results = Location.query.filter(
            (Location.name.ilike(f'{location}%'))  # Matches names starting with the search term
        ).all()
        
        # Return results
        search_results = [{'id': result.id, 'name': result.name, 'description': result.description} for result in results]
        for result in search_results :
          result['image_url'] = f"/static/images/{random.choice(image_filenames)}"
    return render_template('search_results.html', results=search_results)
    