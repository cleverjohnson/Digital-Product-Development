from flask import Flask, render_template, redirect, url_for, request, flash, jsonify, make_response
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
import random
import requests
import os
from urllib.parse import urlencode

# Initialize the Flask app
app = Flask(__name__)
jwt = JWTManager(app)
CORS(app)

app.secret_key = 'dataengineer'

# Use a MySQL connection string
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Nd12356789gC@localhost:3306/bmw'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    device_type = db.Column(db.Enum('wearable', 'medical'), nullable=False)
    device_name = db.Column(db.String(255), nullable=False)
    device_model = db.Column(db.String(255), nullable=True)
    connection_status = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class HealthData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    glucose_level = db.Column(db.Float, nullable=True)
    blood_pressure_systolic = db.Column(db.Integer, nullable=True)
    blood_pressure_diastolic = db.Column(db.Integer, nullable=True)
    heart_rate = db.Column(db.Integer, nullable=True)
    date_time = db.Column(db.DateTime, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.current_timestamp())

    def __repr__(self):
        return f'<HealthData {self.user_id}>'


class MedicalFacility(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    facility_type = db.Column(db.Enum('hospital', 'pharmacy', 'clinic'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255), nullable=False)
    country = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Numeric(9, 6), nullable=True)
    longitude = db.Column(db.Numeric(9, 6), nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.current_timestamp())

    def __repr__(self):
        return f'<MedicalFacility {self.name}>'

class RelaxationContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content_type = db.Column(db.Enum('meditation', 'music', 'breathing_exercise'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    file_url = db.Column(db.String(255), nullable=False)
    duration = db.Column(db.Time, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.current_timestamp())

    def __repr__(self):
        return f'<RelaxationContent {self.title}>'

class UserPreferences(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    glucose_unit = db.Column(db.Enum('mg/dL', 'mmol/L'), nullable=False)
    target_glucose_range_min = db.Column(db.Float, nullable=False)
    target_glucose_range_max = db.Column(db.Float, nullable=False)
    alert_high_glucose = db.Column(db.Float, nullable=False)
    alert_low_glucose = db.Column(db.Float, nullable=False)
    reminder_frequency = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f'<UserPreferences {self.user_id}>'

# Initialize the LoginManager
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/api/write', methods=['POST'])
def save_data():
    data = request.get_json()

    try:
        health_data = HealthData(
            user_id=data['user_id'],
            glucose_level=data['glucose_level'],
            blood_pressure_systolic=data['blood_pressure_systolic'],
            blood_pressure_diastolic=data['blood_pressure_diastolic'],
            heart_rate=data['heart_rate'],
            date_time=data['date_time'],
            notes=data['notes']
        )

        db.session.add(health_data)
        db.session.commit()

        return jsonify({"status": "success", "message": "Data saved successfully"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"status": "error", "message": "Error saving data"}), 500


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        try:
            first_name = request.form['first_name']
            last_name = request.form['last_name']
            email = request.form['email']
            password = request.form['password']
            date_of_birth = request.form['date_of_birth']

            # Validate user input here, if you have created a form class for registration

            hashed_password = generate_password_hash(password)
            new_user = User(first_name=first_name, last_name=last_name, email=email, password=hashed_password, date_of_birth=date_of_birth)
            db.session.add(new_user)
            db.session.commit()

            return redirect(url_for('login'))
        except Exception as e:
            # Handle the exception, e.g., by logging the error and showing an error message to the user
            print(f"Error: {e}")
            flash("An error occurred while registering. Please try again.", "danger")
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            # You can customize this error message as needed
            flash('Invalid email or password', 'danger')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

# New API endpoints
@app.route('/api/register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        date_of_birth = data.get('date_of_birth')

        # You can add validation for the received data here.

        new_user = User(first_name=first_name, last_name=last_name, email=email, date_of_birth=date_of_birth)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"success": True})
    except Exception as e:
        print(f"Error: {e}")
        return make_response(jsonify({"success": False, "error": str(e)}), 500)
    
@app.route('/api/login', methods=['POST'])
def api_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Check if the user exists in the database
        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            # Invalid email or password
            return jsonify({"success": False, "message": "Invalid email or password"}), 401

        # Login successful, create a JWT token and send it to the client
        access_token = create_access_token(identity=user.email)
        refresh_token = create_refresh_token(identity=user.email)

        return jsonify({"success": True, "access_token": access_token, "refresh_token": refresh_token})

    except Exception as e:
        print(f"Error: {e}")
        return make_response(jsonify({"success": False, "error": str(e)}), 500)


@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "date_of_birth": user.date_of_birth.isoformat()
    }
    return jsonify(user_data)

@app.route('/api/user/<int:user_id>/health-data', methods=['GET'])
def get_health_data(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    health_data = HealthData.query.filter_by(user_id=user_id).all()
    health_data_list = [
        {
            "id": data.id,
            "user_id": data.user_id,
            "glucose_level": data.glucose_level,
            "blood_pressure_systolic": data.blood_pressure_systolic,
            "blood_pressure_diastolic": data.blood_pressure_diastolic,
            "heart_rate": data.heart_rate,
            "date_time": data.date_time.isoformat(),
            "notes": data.notes,
            "created_at": data.created_at.isoformat()
        }
        for data in health_data
    ]
    return jsonify(health_data_list)

@app.route('/api/relaxation-content', methods=['GET'])
def get_relaxation_content():
    relaxation_content = RelaxationContent.query.all()
    relaxation_content_list = [
        {
            "id": content.id,
            "content_type": content.content_type,
            "title": content.title,
            "description": content.description,
            "file_url": content.file_url,
            "duration": content.duration.isoformat(),
            "created_at": content.created_at.isoformat()
        }
        for content in relaxation_content
    ]
    return jsonify(relaxation_content_list)

@app.route('/api/user/<int:user_id>/preferences', methods=['GET'])
def get_user_preferences(user_id):
    preferences = UserPreferences.query.filter_by(user_id=user_id).first()
    if preferences is None:
        return jsonify({"error": "Preferences not found"}), 404

    preferences_data = {
        "id": preferences.id,
        "user_id": preferences.user_id,
        "glucose_unit": preferences.glucose_unit,
        "target_glucose_range_min": preferences.target_glucose_range_min,
        "target_glucose_range_max": preferences.target_glucose_range_max,
        "alert_high_glucose": preferences.alert_high_glucose,
        "alert_low_glucose": preferences.alert_low_glucose,
        "reminder_frequency": preferences.reminder_frequency,
        "created_at": preferences.created_at.isoformat(),
        "updated_at": preferences.updated_at.isoformat()
    }
    return jsonify(preferences_data)

@app.route('/api/medical-facilities', methods=['GET'])
def get_medical_facilities():
    medical_facilities = MedicalFacility.query.all()
    medical_facilities_list = [
        {
            "id": facility.id,
            "facility_type": facility.facility_type,
            "name": facility.name,
            "address": facility.address,
            "city": facility.city,
            "state": facility.state,
            "country": facility.country,
            "latitude": float(facility.latitude),
            "longitude": float(facility.longitude),
            "phone_number": facility.phone_number,
            "website": facility.website,
            "created_at": facility.created_at.isoformat()
        }
        for facility in medical_facilities
    ]
    return jsonify(medical_facilities_list)

@app.route('/api/user/<int:user_id>/devices', methods=['GET'])
def get_user_devices(user_id):
    devices = Device.query.filter_by(user_id=user_id).all()
    devices_list = [
        {
            "id": device.id,
            "user_id": device.user_id,
            "device_type": device.device_type,
            "device_name": device.device_name,
            "device_model": device.device_model,
            "connection_status": device.connection_status,
            "created_at": device.created_at.isoformat(),
            "updated_at": device.updated_at.isoformat()
        }
        for device in devices
    ]
    return jsonify(devices_list)

@app.route('/api/user/<int:user_id>/submit-glucose', methods=['POST'])
def submit_glucose(user_id):
    try:
        data = request.get_json()
        glucose_level = data['glucoseLevel']
        date = data['date']
        time = data['time']

        date_time = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")

        new_data = HealthData(user_id=user_id, glucose_level=glucose_level, date_time=date_time)
        db.session.add(new_data)
        db.session.commit()

        return jsonify({"success": True})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)})
    
@app.route('/api/user/<int:user_id>/glucose-history', methods=['GET'])
def glucose_history(user_id):
    glucose_data = HealthData.query.filter_by(user_id=user_id).order_by(HealthData.date_time.desc()).all()
    glucose_data_list = [
        {
            "id": data.id,
            "user_id": data.user_id,
            "glucose_level": data.glucose_level,
            "date_time": data.date_time.isoformat(),
            "created_at": data.created_at.isoformat()
        }
        for data in glucose_data
    ]
    return jsonify(glucose_data_list)

@app.route("/api/medical_assistance", methods=["GET"])
def get_medical_assistance():
    lat = float(request.args.get("lat"))
    lng = float(request.args.get("lng"))

    # Call the Google Places API with the user's location to fetch nearby hospitals
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=5000&keyword=hospital|healthcare|pharmacy&key={'AIzaSyBzHPKcYzqx03ytl08YouIVfM7ZKIuOULw'}"

    response = requests.get(url)
    data = response.json()

    # Extract relevant information from the API response and format it for your frontend
    locations = [
        {
            "id": result["place_id"],
            "name": result["name"],
            "address": result["vicinity"],
            "coordinates": [result["geometry"]["location"]["lat"], result["geometry"]["location"]["lng"]],
        }
        for result in data["results"]
    ]

    return jsonify({"locations": locations})

# End of new API endpoints

if __name__ == '__main__':
    app.run(debug=True, port=5000)

