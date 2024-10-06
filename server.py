from flask import Flask, request, jsonify
import util  # Importing util from the same directory

app = Flask(__name__)


@app.route('/get_location_names', methods=['GET', 'POST'])
def get_location_names():
    locations = util.get_location_names()
    response = jsonify({
        'locations': locations
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    try:
        total_sqft = float(request.form['total_sqft'])
        location = request.form['location']
        bhk = int(request.form['bhk'])
        bath = int(request.form['bath'])

        print(f"Inputs received - Total Sqft: {total_sqft}, Location: {location}, BHK: {bhk}, Bath: {bath}")

        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)

        response = jsonify({
            'estimated_price': estimated_price
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error in /predict_home_price: {e}")
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    print("Starting Python Flask Server for Home Price Prediction...")
    util.load_saved_artifacts()
    app.run(debug=True)  # Enable debug mode for better error messages
