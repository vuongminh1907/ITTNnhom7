from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import db, NhomNguoiDung, NguoiDung, ChucNangNguoiDung, QuanHeNhomChucNang, QuanHeNhomNguoiDung
import uuid
from flask_login import login_required
from http import HTTPStatus
from .decorators import roles_required

api = Blueprint('user_group', __name__, url_prefix='/user_group')

#vừa tạo nhóm mới vừa thêm chức năng của nhóm vào
@api.route('/create_group/', methods=['POST'])
@login_required
@roles_required('Tao nhom nguoi dung moi')  #@roles_required('Tạo nhóm người dùng mới')
def create_group():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinTaoNhomNguoiDung().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    ten_nhom = args.get('ten_nhom')
    mo_ta = args.get('mo_ta')
    list_nguoi_dung = args.get('list_nguoi_dung')
    list_chuc_nang = args.get('list_chuc_nang')

    #check existing name
    group = NhomNguoiDung.query.filter_by(ten_nhom=ten_nhom).first()
    if group:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Tên nhóm đã tồn tại.")

    #Check existing user
    if list_nguoi_dung:
        for id in list_nguoi_dung:
            user = NguoiDung.query.filter_by(id_nguoi_dung=id).first()
            if not user:
                return return_response(code=HTTPStatus.BAD_REQUEST, msg={"Người dùng đang chọn không tồn tại!"})
    
    #Check existing roles
    if list_chuc_nang:
        for id in list_chuc_nang:
            role = ChucNangNguoiDung.query.filter_by(id_chuc_nang=id).first()
            if not role:
                return return_response(code=HTTPStatus.BAD_REQUEST, msg={"Chức năng đang chọn không tồn tại!"})
    
    id_nhom = str(uuid.uuid4().hex)
    new_group = NhomNguoiDung(id_nhom=id_nhom, ten_nhom=ten_nhom, mo_ta=mo_ta)
    
    #Add new record to NhomNguoiDung table
    try:
        db.session.add(new_group)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    #Add new record to QuanHeNhomNguoiDung table
    if list_nguoi_dung:
        for id in list_nguoi_dung:
            new_rela = QuanHeNhomNguoiDung(id_quan_he=str(uuid.uuid4().hex), 
                                            id_nhom=id_nhom, id_nguoi_dung=id)
            try:
                db.session.add(new_rela)
                db.session.commit()
            except Exception as e:
                db.session.delete(new_group)
                db.session.commit() 
                print(str(e))
                return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    #Add new record to QuanHeNhomNguoiDung table
    if list_chuc_nang:
        for id in list_chuc_nang:
            new_rela = QuanHeNhomChucNang(id_quan_he=str(uuid.uuid4().hex), 
                                            id_nhom=id_nhom, id_chuc_nang=id)
            try:
                db.session.add(new_rela)
                db.session.commit()
            except Exception as e:
                db.session.delete(new_group)
                db.session.commit() 
                print(str(e))
                return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    if list_nguoi_dung:
        for id in list_nguoi_dung:
            user = NguoiDung.query.filter_by(id_nguoi_dung=id).first()
            user.load_roles()
            print(user.list_chuc_nang)
    return return_response(code=200, msg="Tạo nhóm mới thành công!")

@api.route('/update_group/<id_nhom>/', methods=['PUT'])
@login_required
@roles_required('Cap nhat thong tin nhom nguoi dung')   #@roles_required('Cập nhật thông tin nhóm người dùng')
def update_group(id_nhom):
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinTaoNhomNguoiDung().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    ten_nhom = args.get('ten_nhom')
    mo_ta = args.get('mo_ta')
    list_nguoi_dung = args.get('list_nguoi_dung')
    list_chuc_nang = args.get('list_chuc_nang')

    #check existing record
    group = NhomNguoiDung.query.filter_by(id_nhom=id_nhom).first()
    if not group:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Nhóm không tồn tại.")

    #check existing name
    check = NhomNguoiDung.query.filter(NhomNguoiDung.ten_nhom == ten_nhom, NhomNguoiDung.id_nhom != id_nhom).first()
    if check:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Tên nhóm đã tồn tại.")

    #Check existing user
    if list_nguoi_dung:
        for id in list_nguoi_dung:
            user = NguoiDung.query.filter_by(id_nguoi_dung=id).first()
            if not user:
                return return_response(code=HTTPStatus.BAD_REQUEST, msg={"Người dùng đang chọn không tồn tại!"})
    
    #Check existing roles
    if list_chuc_nang:
        for id in list_chuc_nang:
            role = ChucNangNguoiDung.query.filter_by(id_chuc_nang=id).first()
            if not role:
                return return_response(code=HTTPStatus.BAD_REQUEST, msg={"Chức năng đang chọn không tồn tại!"})

    group.ten_nhom = ten_nhom
    group.mo_ta = mo_ta
    group.list_nguoi_dung = list_nguoi_dung
    group.list_chuc_nang = list_chuc_nang

    #Add new record to QuanHeNhomNguoiDung table
    check = QuanHeNhomNguoiDung.query.filter_by(id_nhom=id_nhom).all()
    for i in check:
        db.session.delete(i)
        db.session.commit()
    if list_nguoi_dung:
        for id in list_nguoi_dung:
            new_rela = QuanHeNhomNguoiDung(id_quan_he=str(uuid.uuid4().hex), 
                                            id_nhom=id_nhom, id_nguoi_dung=id)
            try:
                db.session.add(new_rela)
            except Exception as e:
                print(str(e))
                return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    #Add new record to QuanHeNhomNguoiDung table
    check = QuanHeNhomChucNang.query.filter_by(id_nhom=id_nhom).all()
    for i in check:
        db.session.delete(i)
        db.session.commit()
    if list_chuc_nang:
        for id in list_chuc_nang:
            new_rela = QuanHeNhomChucNang(id_quan_he=str(uuid.uuid4().hex), 
                                            id_nhom=id_nhom, id_chuc_nang=id)
            try:
                db.session.add(new_rela)
            except Exception as e:
                print(str(e))
                return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    if list_nguoi_dung:
        for id in list_nguoi_dung:
            user = NguoiDung.query.filter_by(id_nguoi_dung=id).first()
            user.load_roles()
    #Update record to NhomNguoiDung table
    try:
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
    return return_response(code=200, msg="Cập nhật nhóm người dùng thành công!")

@api.route('/delete_groups/', methods=['POST'])
@login_required
@roles_required('Xoa nhom nguoi dung')  #@roles_required('Xóa nhóm người dùng')
def delete_groups():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinXoa().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_list = args.get('id_list')

    #check valid list
    if not id_list:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn nhóm để xóa.")

    return_message = []
    for id in id_list:
        user = NhomNguoiDung.query.filter_by(id_nhom=id).first()
        if not user:
            return_message.append("Nhóm không tồn tại hoặc đã bị xóa.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id in id_list:
        group = NhomNguoiDung.query.filter_by(id_nhom=id).first()
        try:
            user_list = QuanHeNhomNguoiDung.query.filter_by(id_nhom=id).all()
            for rela in user_list:
                db.session.delete(rela)
            role_list = QuanHeNhomChucNang.query.filter_by(id_nhom=id).all()
            for rela in role_list:
                db.session.delete(rela)
            db.session.delete(group)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa nhóm người dùng thành công!")

@api.route('/get_group/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nhom nguoi dung')    #@roles_required('Xem thông tin nhóm người dùng')
def get_group(id):  

    group = NhomNguoiDung.query.filter_by(id_nhom=id).first()
    if not group:
        return return_response(code=400, msg="Nhóm không tồn tại hoặc đã bị xóa.")

    #get list user of groups
    user_list = []
    role_list = []
    user_rela = QuanHeNhomNguoiDung.query.filter_by(id_nhom=id).all()
    role_rela = QuanHeNhomChucNang.query.filter_by(id_nhom=id).all()
    for rela in user_rela:
        user = NguoiDung.query.filter_by(id_nguoi_dung=rela.id_nguoi_dung).first()
        user_list.append({
            'id_nguoi_dung': user.id_nguoi_dung,
            'ten_dang_nhap': user.ten_dang_nhap,
            'ten_day_du': user.ten_day_du,
            'email': user.email,
            'so_dien_thoai': user.so_dien_thoai,
            'avatar_url': user.avatar_url,
            'chuc_vu': user.chuc_vu
        })
    for rela in role_rela:
        role = ChucNangNguoiDung.query.filter_by(id_chuc_nang=rela.id_chuc_nang).first()
        role_list.append({
            'id_chuc_nang': role.id_chuc_nang,
            'ten_chuc_nang': role.ten_chuc_nang,
            'mo_ta': role.mo_ta
        })

    data = {
        'id_nhom': group.id_nhom,
        'ten_nhom': group.ten_nhom,
        'mo_ta': group.mo_ta,
        'user_list': user_list,
        'role_list': role_list
    }

    return return_response(data=data)

@api.route('/get_groups/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nhom nguoi dung')
def get_groups():

    groups = NhomNguoiDung.query.all()
    data = []
    for group in groups:
        #get list user of groups
        user_list = []
        role_list = []
        user_rela = QuanHeNhomNguoiDung.query.filter_by(id_nhom=group.id_nhom).all()
        role_rela = QuanHeNhomChucNang.query.filter_by(id_nhom=group.id_nhom).all()
        for rela in user_rela:
            user = NguoiDung.query.filter_by(id_nguoi_dung=rela.id_nguoi_dung).first()
            user_list.append({
                'id_nguoi_dung': user.id_nguoi_dung,
                'ten_dang_nhap': user.ten_dang_nhap,
                'ten_day_du': user.ten_day_du,
                'email': user.email,
                'so_dien_thoai': user.so_dien_thoai,
                'avatar_url': user.avatar_url,
                'chuc_vu': user.chuc_vu
            })
        for rela in role_rela:
            role = ChucNangNguoiDung.query.filter_by(id_chuc_nang=rela.id_chuc_nang).first()
            role_list.append({
                'id_chuc_nang': role.id_chuc_nang,
                'ten_chuc_nang': role.ten_chuc_nang,
                'mo_ta': role.mo_ta
            })
        data.append({
            'id_nhom': group.id_nhom,
            'ten_nhom': group.ten_nhom,
            'mo_ta': group.mo_ta,
            'user_list': user_list,
            'role_list': role_list  
        })
    
    return return_response(data=data)


@api.route('/get_role_list/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nhom nguoi dung')
def get_role_list():

    roles = ChucNangNguoiDung.query.all()
    data = []
    for role in roles:
        data.append({
            'id_chuc_nang': role.id_chuc_nang,
            'ten_chuc_nang': role.ten_chuc_nang,
            'mo_ta': role.mo_ta 
        })
    
    return return_response(data=data)    