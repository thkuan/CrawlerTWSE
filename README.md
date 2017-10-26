# TWSE Crawler
An front-end/back-end application that make a quick reference to Taiwan Stock Exchange public data
## Demo
![Demo](./application.png)

## Getting Started
What knowledge you MUST to know:
#### Public data: [**TWSE**](http://mops.twse.com.tw/mops/web/index)

#### A micro python web application framework: [**Flask**](http://flask.pocoo.org/)
```sh
FLASK_APP=server.py flask run --port=8888 --host=0.0.0.0
```

#### A Python library for pulling data out of HTML and XML files: [**Beautiful Soup**](https://beautiful-soup-4.readthedocs.io/en/latest/#)

#### A powerful template engine for Python to HTML: [**Jinja**](http://jinja.pocoo.org/)

#### A JavaScript library for data visualization: [**D3.js**](https://d3js.org/)

## How to DEBUG
#### Tips:
- Why effects do not show up after we change HTML file?
> Should restart the FLASK app to see the changes
```sh
FLASK_APP=server.py flask run --port=8888 --host=0.0.0.0
```
- Why can't we see any DOM change within google Chrome when js files being uploaded?
> Remember that a browser would help users cache js/css files not only saving recurring download latency but speeding up the front-end process.
```
Ctrl + Shift + R
```
