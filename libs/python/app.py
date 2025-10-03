import createFilePlan.createFilePlan as CFP
import os
from dotenv import load_dotenv
from flask import Flask,json,Response,request,redirect
from flask_cors import CORS, cross_origin
from flask_swagger_ui import get_swaggerui_blueprint

# Load environment variables from the .env file
load_dotenv()

port=os.getenv("port")
BASE_URL=os.getenv("BASE_URL")

SWAGGER_URL = '/api-explorer'  # URL for exposing Swagger UI (without trailing '/')
API_URL = os.getenv("API_URL")  # Our API url (can of course be a local resource)

app = Flask(__name__)

#CORS(app)
CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})
#app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin('*')
def default():
    return redirect("/api-explorer")
#     return """<h1>{BASE_URL}</h1><p/><h1>Methods available:</h1>
#                 <p><a href="/createfileplan">createFilePlan</a> this accepts post data</p>
#                 

@app.route("/createfileplan",methods = ['POST','OPTIONS'])
@cross_origin('*')
def createFilePlan():
    # test curl command: curl -X POST -H 'Content-Type: application/json' http://localhost:9600/createfileplan --data-binary "@testDataFromAngular.txt"
    #print (request.get_json())
    #return Response(request.get_json())
    
    return Response(CFP.main(request.get_json()))

if __name__ == "__main__":

    # Call factory function to create our blueprint
    swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
    API_URL,
    config={  # Swagger UI config overrides
        'app_name': "File Plan Upload"
    }
)
    app.register_blueprint(swaggerui_blueprint)

    # Please do not set debug=True in production
    app.run(host="0.0.0.0", port=port, debug=True)