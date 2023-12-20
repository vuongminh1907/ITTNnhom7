import os
from flask import Flask
from . import auth, user, user_group, household_book, cuoc_hop, \
            bien_ban_hop, household_member, statistics, khai_tu, tam_tru, tam_vang, moi_hop, nguoi_to_chuc, \
            danh_sach_tham_du, danh_gia_gia_dinh_van_hoa, khoan_dong_gop
from .utils import load_env_var
from .models import db
from flask_login import LoginManager
from flask_cors import CORS

# dba = SQLAlchemy()
DB_SERVER = load_env_var('DB_SERVER')
DB_NAME = load_env_var('DB_NAME')
SECRET_KEY = load_env_var('SECRET_KEY')

def register_blueprints(app):
    app.register_blueprint(auth.api)
    app.register_blueprint(user.api)
    app.register_blueprint(user_group.api)
    app.register_blueprint(household_book.api)
    app.register_blueprint(household_member.api)
    app.register_blueprint(cuoc_hop.api)
    app.register_blueprint(bien_ban_hop.api)
    app.register_blueprint(statistics.api)
    app.register_blueprint(khai_tu.api)
    app.register_blueprint(tam_tru.api)
    app.register_blueprint(tam_vang.api)
    app.register_blueprint(moi_hop.api)
    app.register_blueprint(nguoi_to_chuc.api)
    app.register_blueprint(danh_sach_tham_du.api)
    app.register_blueprint(danh_gia_gia_dinh_van_hoa.api)
    app.register_blueprint(khoan_dong_gop.api)

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app, origins=["http://localhost:4200"], supports_credentials=True)

    app.config.from_mapping(
        SECRET_KEY=SECRET_KEY,
        # DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
        SQLALCHEMY_DATABASE_URI=f'mssql+pyodbc://{DB_SERVER}/{DB_NAME}?trusted_connection=yes&driver=ODBC+Driver+17+for+SQL+Server'
    )
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    login_manager = LoginManager()

    login_manager.init_app(app)
    db.init_app(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from .models import NguoiDung
    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return NguoiDung.query.get(user_id)
    # register_blueprints(app=app)
    # app.register_blueprint(auth.api)
    # app.register_blueprint(auth.api)
    register_blueprints(app)
    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello World'


    return app