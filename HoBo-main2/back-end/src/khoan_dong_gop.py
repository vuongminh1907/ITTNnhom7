from .decorators import roles_required
from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import KhoanPhiDongGop, db
import uuid
from flask_login import login_required
from http import HTTPStatus

api = Blueprint('khoan_dong_gop',__name__,url_prefix='/khoan_dong_gop')

@api.route('/create_khoan_phi/', methods=['POST'])
@login_required
@roles_required('Tao thong tin khoan dong gop')
def create_khoan_phi():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThemKhoanPhi().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    ma_khoan_phi = args.get('ma_khoan_phi')
    ten_phi_thu = args.get('ten_phi_thu')
    so_tien = args.get('so_tien')
    mo_ta = args.get('mo_ta')
    han_nop = args.get('han_nop')

    id = str(uuid.uuid4().hex)
    khoan_phi = KhoanPhiDongGop(id=id, ma_khoan_phi=ma_khoan_phi, ten_phi_thu=ten_phi_thu, 
                         so_tien=so_tien, mo_ta=mo_ta, han_nop=han_nop)
    
    try:
        db.session.add(khoan_phi)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(code=200, msg="Thêm khoản đóng góp thành công!")

@api.route('/delete_dong_gops/', methods=['POST'])
@login_required
@roles_required('Xoa thong tin khoan dong gop')
def delete_dong_gops():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinXoa().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_list = args.get('id_list')

    #check valid list
    if not id_list:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn thông tin khoản đóng góp để xóa.")

    return_message = []
    for id in id_list:
        khoan_phi = KhoanPhiDongGop.query.filter_by(id=id).first()
        if not khoan_phi:
            return_message.append("Thông tin khoản đóng góp không tồn tại hoặc đã bị xóa.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id in id_list:
        khoan_phi = KhoanPhiDongGop.query.filter_by(id=id).first()
        try:
            db.session.delete(khoan_phi)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa thông tin đóng góp thành công!")

@api.route('/get_dong_gop/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin khoan dong gop')
def get_dong_gop(id):

    khoan_phi = KhoanPhiDongGop.query.filter_by(id=id).first()
    if not khoan_phi:
        return return_response(code=400, msg="Thông tin khoản đóng góp không tồn tại hoặc đã bị xóa.")

    data = {
        'id': khoan_phi.id,
        'ma_khoan_phi': khoan_phi.ma_khoan_phi,
        'ten_phi_thu': khoan_phi.ten_phi_thu,
        'so_tien' : khoan_phi.so_tien,
        'mo_ta' : khoan_phi.mo_ta,
        'han_nop' : khoan_phi.han_nop,
        'thoi_gian_con_lai' : khoan_phi.remain_time
    }

    return return_response(data=data)

@api.route('/get_dong_gops/', methods=['GET'])
@login_required
@roles_required('Xem thong tin khoan dong gop')
def get_dong_gops():

    khoan_phis = KhoanPhiDongGop.query.all()
    data = []
    for khoan_phi in khoan_phis:

        data.append({
            'id': khoan_phi.id,
            'ma_khoan_phi': khoan_phi.ma_khoan_phi,
            'ten_phi_thu': khoan_phi.ten_phi_thu,
            'so_tien' : khoan_phi.so_tien,
            'mo_ta' : khoan_phi.mo_ta,
            'han_nop' : khoan_phi.han_nop,
            'thoi_gian_con_lai' : khoan_phi.remain_time
        })
    
    return return_response(data=data)