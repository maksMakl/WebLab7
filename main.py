from flask import Flask, request, render_template, jsonify
from datetime import datetime
import os



app = Flask(__name__)
app.config['DEBUG'] = True



@app.route("/")
def send_page():
    with open('data.txt', 'w') as f:
        f.write("")
        
    return render_template("index.html")



@app.route('/send_data', methods=['POST'])
def send_data():
    data = request.get_json() 
    if 'recordNumber' in data and 'message' in data:
        record_number = data['recordNumber']
        message = data['message']
        with open("data.txt", "a") as f:
            formatted_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"{record_number};{message} {formatted_datetime}\n")
        return jsonify({'status': 'success', 'recordNumber': record_number, 'receivedMessage': message}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Missing record number or message'}), 400
    


@app.route('/send_data_local', methods=['POST'])
def send_data_local():
    data = request.get_json() 
    if 'recordNumber' in data and 'message' in data:
        record_number = data['recordNumber']
        message = data['message']
        with open("data_local.txt", "a") as f:
            f.write(f"{record_number};{message}\n")
        return jsonify({'status': 'success', 'recordNumber': record_number, 'receivedMessage': message}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Missing record number or message'}), 400



@app.route('/get_data')
def get_data():
    with open('data.txt', 'r') as f:
        data = f.read()
    
    with open('data.txt', 'w') as f:
        f.write("")
    
    return jsonify({'data': data})



@app.route('/get_data_local')
def get_data_local():
    with open('data_local.txt', 'r') as f:
        data = f.read()
    
    with open('data_local.txt', 'w') as f:
        f.write("")
    
    return jsonify({'data': data})



if __name__ == "__main__":
    #port = int(os.getenv("PORT", 5000))
    #app.run(host="0.0.0.0", port=port)
    app.run()
