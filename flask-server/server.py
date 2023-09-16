from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

@app.route('/members')
def members():
    return jsonify({"members": ["yas", "yaas", "yaaas"]})

CORS(app)

if __name__ == "__main__":
    app.run(debug=True)
