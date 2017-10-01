from flask import Flask
from flask import render_template
from flask import request
from twse import retreive

app = Flask(__name__)

@app.route("/")
def hello():
    return render_template('form.html')

@app.route("/resp")
def get_resp():
    if request.method == 'GET':
        query_type = request.args.get('s_type')
        query_company = request.args.get('codename')
        return render_template('form.html', parsing_result=retreive(query_type, query_company))
