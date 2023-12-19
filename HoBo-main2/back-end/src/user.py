from . import schema
from flask import Blueprint, request
from werkzeug.security import generate_password_hash
from .utils import return_response
from .models import db, NguoiDung, QuanHeNhomNguoiDung, NhomNguoiDung
import uuid
from flask_login import login_required, current_user
from http import HTTPStatus
from .decorators import roles_required

# from flaskr.db import get_db

api = Blueprint('user', __name__, url_prefix='/user')

@api.route('/register/', methods=['POST'])
@login_required
@roles_required('Dang ky nguoi dung moi') #@roles_required('Đăng ký người dùng mới') #
def register():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinDangKy().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    ten_dang_nhap = args.get('ten_dang_nhap')
    mat_khau = args.get('mat_khau')
    ten_day_du = args.get('ten_day_du')
    email = args.get('email')
    so_dien_thoai = args.get('so_dien_thoai')
    avatar_url = args.get('avatar_url')
    chuc_vu = args.get('chuc_vu')
    nhom = args.get('nhom')

    #check existing record
    user = NguoiDung.query.filter_by(ten_dang_nhap=ten_dang_nhap).first()
    if user:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Tên đăng nhập đã tồn tại.")

    id = str(uuid.uuid4().hex)
    new_user = NguoiDung(id_nguoi_dung=id, ten_dang_nhap=ten_dang_nhap, mat_khau=generate_password_hash(mat_khau, method='sha256'),
                        ten_day_du=ten_day_du, email=email, so_dien_thoai=so_dien_thoai, avatar_url=avatar_url, chuc_vu=chuc_vu, la_sadmin=False)
    
    try:
        db.session.add(new_user)
        for id_nhom in nhom:
            new_rela = QuanHeNhomNguoiDung(id_quan_he=str(uuid.uuid4().hex), 
                                            id_nhom=id_nhom, id_nguoi_dung=id)
            try:
                db.session.add(new_rela)
            except Exception as e:
                print(str(e))
                return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(code=200, msg="Đăng ký thành công!")

@api.route('/update_user/<id>/', methods=['PUT'])
@login_required
@roles_required('Cap nhat thong tin nguoi dung')    #@roles_required('Cập nhật thông tin người dùng')
def update_user(id):
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinThayDoiNguoiDung().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    ten_day_du = args.get('ten_day_du')
    email = args.get('email')
    so_dien_thoai = args.get('so_dien_thoai')
    avatar_url = args.get('avatar_url')
    chuc_vu = args.get('chuc_vu')
    nhom = args.get('nhom')

    #check existing record
    user = NguoiDung.query.filter_by(id_nguoi_dung=id).first()
    if not user:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Người dùng không tồn tại.")

    user.ten_day_du = ten_day_du
    user.email = email
    user.so_dien_thoai = so_dien_thoai
    user.avatar_url = avatar_url
    user.chuc_vu = chuc_vu
   
    try:
        check = QuanHeNhomNguoiDung.query.filter_by(id_nguoi_dung=id).all()
        for i in check:
            db.session.delete(i)
            db.session.commit()
        if nhom:
            for id_nhom in nhom:
                new_rela = QuanHeNhomNguoiDung(id_quan_he=str(uuid.uuid4().hex), 
                                                id_nhom=id_nhom, id_nguoi_dung=id)
                try:
                    db.session.add(new_rela)
                    db.session.commit()
                except Exception as e:
                    print(str(e))
                    return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Cập nhật người dùng thành công!")

@api.route('/delete_users/', methods=['POST'])
@login_required
@roles_required('Xoa nguoi dung')   #@roles_required('Xóa người dùng')
def delete_users():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinXoa().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_list = args.get('id_list')

    #check valid list
    if not id_list:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn người dùng để xóa.")

    return_message = []
    for id in id_list:
        user = NguoiDung.query.filter_by(id_nguoi_dung=id).first()
        if not user:
            return_message.append("Người dùng không tồn tại hoặc đã bị xóa.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id in id_list:
        user = NguoiDung.query.filter_by(id_nguoi_dung=id).first()
        try:
            user_list = QuanHeNhomNguoiDung.query.filter_by(id_nguoi_dung=id).all()
            for rela in user_list:
                db.session.delete(rela)
            db.session.delete(user)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa người dùng thành công!")

@api.route('/get_user/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nguoi dung') #@roles_required('Xem thông tin người dùng')
def get_user(id):

    user = NguoiDung.query.filter_by(id_nguoi_dung=id).first()
    if not user:
        return return_response(code=400, msg="Người dùng không tồn tại hoặc đã bị xóa.")

    data = {
        'id_nguoi_dung': user.id_nguoi_dung,
        'ten_dang_nhap': user.ten_dang_nhap,
        'ten_day_du': user.ten_day_du,
        'email': user.email,
        'so_dien_thoai': user.so_dien_thoai,
        'avatar_url': user.avatar_url,
        'chuc_vu': user.chuc_vu,
        'nhom': []
    }

    group_relas = QuanHeNhomNguoiDung.query.filter_by(id_nguoi_dung=id)
    for group_rela in group_relas:
        group = NhomNguoiDung.query.filter_by(id_nhom=group_rela.id_nhom).first()
        data['nhom'].append({'id_nhom': group.id_nhom, 'ten_nhom': group.ten_nhom})

    return return_response(data=data)

@api.route('/get_users/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nguoi dung')
def get_users():

    users = NguoiDung.query.all()
    data = []
    for user in users:
        nhom = []
        group_relas = QuanHeNhomNguoiDung.query.filter_by(id_nguoi_dung=user.id_nguoi_dung)
        for group_rela in group_relas:
            group = NhomNguoiDung.query.filter_by(id_nhom=group_rela.id_nhom).first()
            nhom.append({'id_nhom': group.id_nhom, 'ten_nhom': group.ten_nhom})
        data.append({
            'id_nguoi_dung': user.id_nguoi_dung,
            'ten_dang_nhap': user.ten_dang_nhap,
            'ten_day_du': user.ten_day_du,
            'email': user.email,
            'so_dien_thoai': user.so_dien_thoai,
            'avatar_url': user.avatar_url,
            'chuc_vu': user.chuc_vu,
            'nhom': nhom
        })

    
    return return_response(data=data)

@api.route('/get_my_info/', methods=['GET'])
@login_required
def is_loggedin():
    user = current_user
    print("before current_user:",user.list_chuc_nang)
    user.load_roles()
    print("current_user:",user.list_chuc_nang)
    data = {
        'id_nguoi_dung': user.id_nguoi_dung,
        'ten_dang_nhap': user.ten_dang_nhap,
        'ten_day_du': user.ten_day_du,
        'email': user.email,
        'so_dien_thoai': user.so_dien_thoai,
        'avatar_url': user.avatar_url,
        'chuc_vu': user.chuc_vu,
        'nhom': [],
        'la_sadmin': user.la_sadmin,
        'list_chuc_nang': user.list_chuc_nang
    }

    group_relas = QuanHeNhomNguoiDung.query.filter_by(id_nguoi_dung=user.id_nguoi_dung)
    for group_rela in group_relas:
        group = NhomNguoiDung.query.filter_by(id_nhom=group_rela.id_nhom).first()
        data['nhom'].append({'id_nhom': group.id_nhom, 'ten_nhom': group.ten_nhom})

    return return_response(data=data)

#mẫu url: /search_users_by_name/?query=abc
@api.route('/search_users_by_name/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nguoi dung')
def search_users_by_name():
    query = request.args.get('query')
    users = NguoiDung.query.filter(NguoiDung.ten_day_du.like(f"%{query}%")).all()
    data = []
    for user in users:
        nhom = []
        group_relas = QuanHeNhomNguoiDung.query.filter_by(id_nguoi_dung=user.id_nguoi_dung)
        for group_rela in group_relas:
            group = NhomNguoiDung.query.filter_by(id_nhom=group_rela.id_nhom).first()
            nhom.append({'id_nhom': group.id_nhom, 'ten_nhom': group.ten_nhom})
        data.append({
            'id_nguoi_dung': user.id_nguoi_dung,
            'ten_dang_nhap': user.ten_dang_nhap,
            'ten_day_du': user.ten_day_du,
            'email': user.email,
            'so_dien_thoai': user.so_dien_thoai,
            'avatar_url': user.avatar_url,
            'chuc_vu': user.chuc_vu,
            'nhom': nhom
        })

    
    return return_response(data=data)
    