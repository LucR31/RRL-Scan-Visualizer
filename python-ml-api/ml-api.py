from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Expect {"x": [...], "y": [...]}
    x = np.array(data['x']).reshape(-1, 1)
    y = np.array(data['y'])

    model = LinearRegression()
    model.fit(x, y)

    # Predict next 5 points (extrapolation)
    x_new = np.array(range(x[-1][0] + 1, x[-1][0] + 6)).reshape(-1, 1)
    y_pred = model.predict(x_new)

    return jsonify({
        "x_pred": x_new.flatten().tolist(),
        "y_pred": y_pred.tolist()
    })

if __name__ == '__main__':
    app.run(port=5000)
