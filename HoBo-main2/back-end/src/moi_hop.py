from sqlalchemy import and_, or_
from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import db, CuocHop, NhanKhau, MoiHop, ChungMinhThu
from http import HTTPStatus
from .decorators import roles_required
from flask_login import login_required
from datetime import date

api = Blueprint('moi_hop', __name__, url_prefix='/moi_hop')

@api.route('/them_loi_moi/', methods = ['POST'])
@login_required
@roles_required('Sua thong tin cuoc hop')
def them_loi_moi():
    try:
        args = request.get_json()
        res = schema.ThemLoiMoi().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    
    id_cuoc_hop = args.get('id_cuoc_hop')
    list_id_nhan_khau = args.get('list_id_nhan_khau')
    ngay_moi_hop = date.today()
    
    if not list_id_nhan_khau:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn nhân khẩu để thêm.")

    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nhan_khau = NhanKhau.query.filter_by(ID = id_nhan_khau)
        nhan_khau = nhan_khau.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).all()

        if not nhan_khau:
            return_message.append("Nhân khẩu không tồn tại")

    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)
    
    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        loi_moi = MoiHop(id_cuoc_hop = id_cuoc_hop, id_nhan_khau = id_nhan_khau, ngay_moi_hop = ngay_moi_hop)
        try:
            db.session.add(loi_moi)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
    
    return return_response(code=200, msg="Thêm lời mời thành công!")



@api.route('/xoa_loi_moi/', methods = ['POST'])
@login_required
@roles_required('Sua thong tin cuoc hop')
def xoa_loi_moi():
    #validate input
    try:
        args = request.get_json()
        res = schema.XoaLoiMoi().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_cuoc_hop = args.get('id_cuoc_hop')
    list_id_nhan_khau = args.get('list_id_nhan_khau')

    #check valid list
    if not list_id_nhan_khau or not id_cuoc_hop:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn nhân khẩu để xóa.")

    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nhan_khau = MoiHop.query.filter_by(id_nhan_khau=id_nhan_khau).filter_by(id_cuoc_hop=id_cuoc_hop).first()
        if not nhan_khau:
            return_message.append("Nhân khẩu không tồn tại hoặc chưa được mời.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id_nhan_khau in list_id_nhan_khau:
        nhan_khau = MoiHop.query.filter_by(id_nhan_khau=id_nhan_khau).filter_by(id_cuoc_hop=id_cuoc_hop).first()
        try:
            db.session.delete(nhan_khau)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa lời mời thành công!")

@api.route('/xem_danh_sach_moi_hop/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin cuoc hop')
def xem_danh_sach_moi_hop(id):

    danh_sach = MoiHop.query.filter_by(id_cuoc_hop=id)
    cuoc_hop = CuocHop.query.filter_by(ID=id).first()
    if not cuoc_hop:
        return return_response(code=400, msg="Cuộc họp không tồn tại hoặc đã bị xóa.")
 
    if not danh_sach:
        return return_response(code=400, msg="Cuộc họp không tồn tại hoặc chưa mời ai.")
    data = []
    for nhan_khau in danh_sach:
        nk = NhanKhau.query.filter_by(ID=nhan_khau.id_nhan_khau).first()
        cmt = ChungMinhThu.query.filter_by(id_nhan_khau=nhan_khau.id_nhan_khau).first()
        data.append({
            "id_nhan_khau" : nk.ID,
            "ho_ten" : nk.ho_ten,
            "ngay_moi_hop" : nhan_khau.ngay_moi_hop,
            "ngay_sinh": nk.ngay_sinh,
            "dia_chi_hien_nay": nk.dia_chi_hien_nay,
            "gioi_tinh": nk.gioi_tinh,
            "so_cmt": cmt.so_cmt if cmt else ""
        })

    return return_response(data=data, msg="Xem danh sách mời họp thành công!")

# xem danh sach tham du cua 1 cuoc hop
@api.route('/xem_danh_sach_chua_moi_hop/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin cuoc hop')
def xem_danh_sach_chua_moi_hop(id):

    danh_sach = MoiHop.query.filter_by(id_cuoc_hop=id).all()
    cuoc_hop = CuocHop.query.filter_by(ID=id).first()
    if not cuoc_hop:
        return return_response(code=400, msg="Cuộc họp không tồn tại hoặc đã bị xóa.")

    list_id = []
    for id in danh_sach:
        list_id.append(id.id_nhan_khau)
    danh_sach_chua_tham_du = NhanKhau.query.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).filter(~NhanKhau.ID.in_(list_id)).all()
    
    data = []
    for nhan_khau in danh_sach_chua_tham_du:
        # print(nhan_khau.ho_ten)
        cmt = ChungMinhThu.query.filter_by(id_nhan_khau=nhan_khau.ID).first()
        data.append({
            "id_nhan_khau" : nhan_khau.ID,
            "ho_ten" : nhan_khau.ho_ten,
            "ngay_sinh": nhan_khau.ngay_sinh,
            "gioi_tinh": nhan_khau.gioi_tinh,
            "dia_chi_hien_nay": nhan_khau.dia_chi_hien_nay,
            "so_cmt": cmt.so_cmt if cmt else ""
        })

    return return_response(data=data, msg="Xem danh sách mời họp thành công!")