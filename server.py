from flask import Flask
from flask import render_template
from flask import request
from twse import get_response

app = Flask(__name__)

@app.route("/")
def hello():
    return render_template('form.html')

@app.route("/resp")
def get_resp():
    if request.method == 'GET':
        query_type = request.args.get('q_option')
        query_company = request.args.get('codename')
        (text_result, json_data) = get_response(query_type, query_company)
        return render_template('form.html', parsing_result=text_result, json_result=json_data)
        #return render_template('form.html', parsing_result=get_response(query_type, query_company))
