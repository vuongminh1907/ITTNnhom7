from sqlalchemy import and_, or_
from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import db, CuocHop, NhanKhau, DanhSachThamDu
from http import HTTPStatus
from .decorators import roles_required
from flask_login import login_required

api = Blueprint('danh_sach_tham_du', __name__, url_prefix='/danh_sach_tham_du')

@api.route('/them_nguoi_tham_du/', methods = ['POST'])
@login_required
@roles_required('Sua thong tin cuoc hop')
def them_nguoi_tham_du():
    try:
        args = request.get_json()
        res = schema.ThemNguoiThamDu().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    
    id_cuoc_hop = args.get('id_cuoc_hop')
    list_id_nhan_khau = args.get('list_id_nhan_khau')
    
    if not list_id_nhan_khau:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn nhân khẩu để thêm.")

    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nhan_khau = NhanKhau.query.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).first()
        if not nhan_khau:
            return_message.append("Nhân khẩu không tồn tại")

    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)
    
    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nguoi_tham_du = DanhSachThamDu(id_cuoc_hop = id_cuoc_hop, id_nhan_khau = id_nhan_khau)
        try:
            db.session.add(nguoi_tham_du)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
    
    return return_response(code=200, msg="Thêm người tham dự thành công!")

@api.route('/xoa_nguoi_tham_du/', methods = ['POST'])
@login_required
@roles_required('Sua thong tin cuoc hop')
def xoa_nguoi_tham_du():
    #validate input
    try:
        args = request.get_json()
        res = schema.XoaNguoiThamDu().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_cuoc_hop = args.get('id_cuoc_hop')
    list_id_nhan_khau = args.get('list_id_nhan_khau')

    #check valid list
    if not list_id_nhan_khau or not id_cuoc_hop:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn nhân khẩu để xóa.")

    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nhan_khau = DanhSachThamDu.query.filter_by(id_nhan_khau=id_nhan_khau).filter_by(id_cuoc_hop=id_cuoc_hop).first()
        if not nhan_khau:
            return_message.append("Nhân khẩu không tồn tại hoặc chưa tham dự.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nhan_khau = DanhSachThamDu.query.filter_by(id_nhan_khau=id_nhan_khau).filter_by(id_cuoc_hop=id_cuoc_hop).first()
        try:
            db.session.delete(nhan_khau)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa người tham dự thành công!")

# xem danh sach tham du cua 1 cuoc hop
@api.route('/xem_danh_sach_tham_du/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin cuoc hop')
def xem_dstd_cuoc_hop(id):

    cuoc_hop = CuocHop.query.filter_by(ID=id).first()
    danh_sach_id_tham_du = cuoc_hop.nguoi_tham_du
    if not cuoc_hop:
        return return_response(code=400, msg="Cuộc họp không tồn tại hoặc đã bị xóa.")
    
    if not danh_sach_id_tham_du:
        return return_response(data=[])
    danh_sach_tham_du = []
    for id in danh_sach_id_tham_du:
        danh_sach_tham_du.append(NhanKhau.query.filter_by(ID=id.id_nhan_khau).first())
    
    data = []
    for nhan_khau in danh_sach_tham_du:
        # print(nhan_khau.ho_ten)
        data.append(nhan_khau.ID)

    return return_response(data=data, msg="Xem danh sách tham dự thành công!")