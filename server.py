from flask import Flask, render_template, jsonify
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route("/")
def index():
    return render_template("index.html")  # your SPA entry point

@app.route("/api/status")
def status():
    return jsonify({
        "status": "online",
        "application": "Marksheet Helper",
        "storage": "LocalStorage",
        "version": "1.0.0"
    })

# Vercel looks for the variable `handler`
handler = app

if __name__ == "__main__":
    PORT = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=PORT)
