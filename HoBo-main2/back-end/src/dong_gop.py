from .decorators import roles_required
from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import DongGop, NhanKhau, HoKhau, db
import uuid
from flask_login import login_required
from http import HTTPStatus

api = Blueprint('dong_gop',__name__,url_prefix='/dong_gop')

@api.route('/create_dong_gop/', methods=['POST'])
@login_required
@roles_required('Tao thong tin dong gop')
def create_dong_gop():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThemDongGop().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    ma_dong_gop = args.get('ma_dong_gop')
    ten_dong_gop = args.get('ten_dong_gop')
    so_tien = args.get('so_tien')
    mo_ta = args.get('mo_ta')
    han_nop = args.get('han_nop')

    id = str(uuid.uuid4().hex)
    dong_gop = DongGop(id=id, ma_dong_gop=ma_dong_gop, ten_dong_gop=ten_dong_gop, 
                         so_tien=so_tien, mo_ta=mo_ta, han_nop=han_nop)
    
    try:
        db.session.add(dong_gop)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(code=200, msg="Thêm khoản đóng góp thành công!")

@api.route('/delete_dong_gops/', methods=['POST'])
@login_required
@roles_required('Xoa thong tin dong gop')
def delete_dong_gops():
    #validate input
    try:
        args = request.get_json()
        res = schema.XoaDongGop().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_list = args.get('id_list')

    #check valid list
    if not id_list:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn thông tin khoản đóng góp để xóa.")

    return_message = []
    for id in id_list:
        dong_gop = DongGop.query.filter_by(id=id).first()
        if not dong_gop:
            return_message.append("Thông tin đóng góp không tồn tại hoặc đã bị xóa.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id in id_list:
        dong_gop = DongGop.query.filter_by(id=id).first()
        try:
            db.session.delete(dong_gop)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa thông tin đóng góp thành công!")

@api.route('/get_dong_gop/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin dong gop')
def get_dong_gop(id):

    dong_gop = DongGop.query.filter_by(id=id).first()
    if not dong_gop:
        return return_response(code=500, msg="Thông tin đóng góp không tồn tại hoặc đã bị xóa.")

    data = {
        'id': dong_gop.id,
        'ma_dong_gop': dong_gop.ma_dong_gop,
        'ten_dong_gop': dong_gop.ten_dong_gop,
        'so_tien' : dong_gop.so_tien,
        'mo_ta' : dong_gop.mo_ta,
        'han_nop' : dong_gop.han_nop,
        #'thoi_gian_con_lai' : dong_gop.remain_time
    }

    return return_response(data=data)

@api.route('/get_dong_gops/', methods=['GET'])
@login_required
@roles_required('Xem thong tin dong gop')
def get_dong_gops():

    dong_gops = DongGop.query.all()
    data = []
    for dong_gop in dong_gops:

        data.append({
            'id': dong_gop.id,
            'ma_dong_gop': dong_gop.ma_dong_gop,
            'ten_dong_gop': dong_gop.ten_dong_gop,
            'so_tien' : dong_gop.so_tien,
            'mo_ta' : dong_gop.mo_ta,
            'han_nop' : dong_gop.han_nop,
            #'thoi_gian_con_lai' : dong_gop.remain_time
        })
    
    return return_response(data=data)
  