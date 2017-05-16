from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'regfemicidios'
COLLECTION_NAME = 'project'
FIELDS = {'_id': False, 'edad': True, 'identidad_genero': True, 'tipo_victima': True,
          'lugar_hecho': True, 'State':True, 'numero': True, 'modalidad_comisiva': True, 'fecha_hecho': True}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/regfemicidios/project")
def donor_projects():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(projection=FIELDS, limit=5000)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects)
    connection.close()
    return json_projects


if __name__ == "__main__":
    app.run(debug=True)
