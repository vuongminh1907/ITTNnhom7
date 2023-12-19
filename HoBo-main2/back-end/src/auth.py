from . import schema
from flask import Blueprint, request
from werkzeug.security import check_password_hash
from .utils import return_response
from .models import NguoiDung
from http import HTTPStatus
from flask_login import login_user, logout_user, login_required, current_user
from flask import session

api = Blueprint('auth', __name__, url_prefix='/auth')

@api.route('/login', methods=['POST'])
def login():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinDangNhap().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    ten_dang_nhap = args.get('ten_dang_nhap')
    mat_khau = args.get('mat_khau')
    nho_dang_nhap = args.get('nho_dang_nhap', False)
    
    user = NguoiDung.query.filter_by(ten_dang_nhap=ten_dang_nhap).first()
    if not user or not check_password_hash(user.mat_khau, mat_khau):
        # print(user.mat_khau)
       return return_response(code=HTTPStatus.BAD_REQUEST, msg='Sai tên đăng nhập hoặc mật khẩu!')

    login_user(user, remember=nho_dang_nhap) 
    # Xóa các roles trước khi tải roles mới
    user.list_chuc_nang = []
     # Tải roles cho người dùng đã đăng nhập
    user.load_roles()
    # Log sau khi load_roles
    print("After login, list_chuc_nang:", user.list_chuc_nang)


    return return_response(msg="Đăng nhập thành công!",
                            data={'id': user.id_nguoi_dung,
                                  'la_sadmin': user.la_sadmin,
                                  'list_chuc_nang': user.list_chuc_nang})

@api.route('/logout', methods=['POST'])
@login_required
def logout():
    # Log trước khi xóa roles
    print("Before logout, list_chuc_nang:", current_user.list_chuc_nang)
    
    # Xóa roles trước khi đăng xuất
    current_user.list_chuc_nang = []
     # Log sau khi xóa roles
    print("After logout, list_chuc_nang:", current_user.list_chuc_nang)

    # Xóa session
    session.clear()

    # Thực hiện các hành động đăng xuất khác nếu cần
    logout_user()
    
    return return_response()

@api.route('/is_logged_in/', methods=['GET'])
def is_loggedin():
    is_loggedin = current_user.is_authenticated
    return return_response(data={'is_logged_in': is_loggedin})
