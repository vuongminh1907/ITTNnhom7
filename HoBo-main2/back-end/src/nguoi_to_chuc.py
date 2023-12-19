from sqlalchemy import and_, or_
from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import ChungMinhThu, db, NhanKhau, NguoiToChuc
from http import HTTPStatus
from .decorators import roles_required
from flask_login import login_required

api = Blueprint('nguoi_to_chuc', __name__, url_prefix='/nguoi_to_chuc')

@api.route('/them_nguoi_to_chuc/', methods = ['POST'])
@login_required
@roles_required('Sua thong tin cuoc hop')   #@roles_required('Sửa thông tin cuộc họp')
def them_nguoi_to_chuc():
    try:
        args = request.get_json()
        res = schema.ThemNguoiToChuc().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    
    id_cuoc_hop = args.get('id_cuoc_hop')
    list_id_nhan_khau = args.get('list_id_nhan_khau')
    
    if not list_id_nhan_khau or not id_cuoc_hop:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn nhân khẩu để thêm.")

    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nhan_khau = NhanKhau.query.filter_by(ID = id_nhan_khau)
        nhan_khau = nhan_khau.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).first()

        if not nhan_khau:
            return_message.append("Nhân khẩu không tồn tại")

    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)
    
    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nguoi_to_chuc = NguoiToChuc(id_cuoc_hop = id_cuoc_hop, id_nhan_khau = id_nhan_khau)
        try:
            db.session.add(nguoi_to_chuc)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
    
    return return_response(code=200, msg="Thêm người tổ chức thành công!")

@api.route('/xoa_nguoi_to_chuc/', methods = ['POST'])
@login_required
@roles_required('Sua thong tin cuoc hop')
def xoa_nguoi_to_chuc():
    #validate input
    try:
        args = request.get_json()
        res = schema.XoaNguoiToChuc().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_cuoc_hop = args.get('id_cuoc_hop')
    list_id_nhan_khau = args.get('list_id_nhan_khau')

    #check valid list
    if not list_id_nhan_khau or not id_cuoc_hop:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn người tổ chức để xóa.")

    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nhan_khau = NguoiToChuc.query.filter_by(id_nhan_khau=id_nhan_khau).filter_by(id_cuoc_hop=id_cuoc_hop).first()
        if not nhan_khau:
            return_message.append("Nhân khẩu không tồn tại hoặc chưa được tổ chức cuộc họp này.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nhan_khau = NguoiToChuc.query.filter_by(id_nhan_khau=id_nhan_khau).filter_by(id_cuoc_hop=id_cuoc_hop).first()
        try:
            db.session.delete(nhan_khau)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa người tổ chức thành công!")

@api.route('/xem_danh_sach_nguoi_to_chuc/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin cuoc hop')   #@roles_required('Xem thông tin cuộc họp')
def xem_danh_sach_moi_hop(id):

    danh_sach = NguoiToChuc.query.filter_by(id_cuoc_hop=id)
    if not danh_sach:
        return return_response(code=400, msg="Cuộc họp không tồn tại hoặc chưa có ai tổ chức.")
    data = []
    for nhan_khau in danh_sach:
        nk = NhanKhau.query.filter_by(ID=nhan_khau.id_nhan_khau).first()
        cmt = ChungMinhThu.query.filter_by(id_nhan_khau=nhan_khau.id_nhan_khau).first()
        data.append({
            "id_nhan_khau" : nk.ID,
            "ho_ten" : nk.ho_ten,
            "ngay_sinh": nk.ngay_sinh,
            "dia_chi_hien_nay": nk.dia_chi_hien_nay,
            "gioi_tinh": nk.gioi_tinh,
            "so_cmt": cmt.so_cmt if cmt else ""
        })

    return return_response(data=data, msg="Xem danh sách người tổ chức thành công!")