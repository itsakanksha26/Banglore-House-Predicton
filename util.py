import os
import pickle
import json
import numpy as np
import pandas as pd

# Get the directory where this script is located
current_dir = os.path.dirname(os.path.realpath(__file__))

# Path to the artifacts directory
artifacts_dir = os.path.join(current_dir, "artifacts")

__locations = None
__data_columns = None
__model = None

# Function to load the saved model and data columns
def load_saved_artifacts():
    print("Loading saved artifacts...start")
    global __data_columns
    global __locations
    global __model

    # Load data columns from JSON
    with open(os.path.join(artifacts_dir, "columns.json"), 'r') as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]  # First 3 columns are sqft, bath, bhk

    # Load the trained model from the pickle file
    with open(os.path.join(artifacts_dir, "banglore_home_prices_model.pickle"), "rb") as f:
        __model = pickle.load(f)

    print("Loading artifacts...done")

# Function to estimate price based on the input features
def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location)  # No case conversion here
    except ValueError:
        loc_index = -1  # If location is not found, leave the location one-hot encoding at zero

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk

    if loc_index >= 0:
        x[loc_index] = 1

    x_df = pd.DataFrame([x], columns=__data_columns)

    return round(__model.predict(x_df)[0], 2)

# Function to get location names
def get_location_names():
    return __locations

# Load model and columns before running predictions
load_saved_artifacts()
