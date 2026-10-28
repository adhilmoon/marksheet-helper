from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/status')
def status():
    return jsonify({
        'status': 'online',
        'application': 'Marksheet Helper',
        'architecture': 'MVC (Model-View-Controller)',
        'storage': 'Isolated LocalStorage Vault',
        'version': '1.0.0'
    })

# Vercel WSGI entry point
handler = app
