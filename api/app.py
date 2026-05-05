from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from pathlib import Path

app = Flask(__name__)
CORS(app)
DB_PATH = Path(__file__).with_name('travelplanner.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS trips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                travelers INTEGER NOT NULL,
                budget INTEGER NOT NULL,
                days INTEGER NOT NULL,
                pace TEXT NOT NULL,
                destinations TEXT NOT NULL
            )
        ''')
        count = conn.execute('SELECT COUNT(*) AS count FROM trips').fetchone()['count']
        if count == 0:
            conn.execute(
                'INSERT INTO trips (name, travelers, budget, days, pace, destinations) VALUES (?, ?, ?, ?, ?, ?)',
                ('Japan Spring Sprint', 2, 4200, 7, 'Balanced', 'Tokyo,Kyoto')
            )


@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'service': 'travel-planner-api'})


@app.route('/api/trips', methods=['GET'])
def list_trips():
    with get_db() as conn:
        rows = conn.execute('SELECT * FROM trips ORDER BY id DESC').fetchall()
        trips = [dict(row) for row in rows]
        for trip in trips:
            trip['destinations'] = [d for d in trip['destinations'].split(',') if d]
        return jsonify(trips)


@app.route('/api/trips', methods=['POST'])
def create_trip():
    data = request.get_json() or {}
    required = ['name', 'travelers', 'budget', 'days', 'pace', 'destinations']
    missing = [field for field in required if field not in data]
    if missing:
        return jsonify({'error': 'Missing required fields', 'fields': missing}), 400

    destinations = ','.join(data.get('destinations', []))
    with get_db() as conn:
        cursor = conn.execute(
            'INSERT INTO trips (name, travelers, budget, days, pace, destinations) VALUES (?, ?, ?, ?, ?, ?)',
            (data['name'], int(data['travelers']), int(data['budget']), int(data['days']), data['pace'], destinations)
        )
        return jsonify({'id': cursor.lastrowid, 'status': 'created'}), 201


@app.route('/api/trips/<int:trip_id>', methods=['DELETE'])
def delete_trip(trip_id):
    with get_db() as conn:
        conn.execute('DELETE FROM trips WHERE id = ?', (trip_id,))
        return jsonify({'status': 'deleted'})


init_db()

if __name__ == '__main__':
    app.run(debug=True)
