from sqlalchemy import and_, or_
from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import ChungMinhThu, db, NhanKhau, KhaiTu
import uuid
from flask_login import login_required, current_user
from http import HTTPStatus
from .decorators import roles_required

api = Blueprint('khai_tu', __name__, url_prefix='/khai_tu')

@api.route('/create_khai_tu/', methods=['POST'])
@login_required
@roles_required('Tao thong tin khai tu')    #@roles_required('Tạo thông tin khai tử')
def create_khai_tu():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinKhaiTu().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_nguoi_khai = args.get('id_nguoi_khai')
    id_nguoi_chet = args.get('id_nguoi_chet')
    so_giay_khai_tu = args.get('so_giay_khai_tu')
    ngay_khai = args.get('ngay_khai')
    ngay_chet = args.get('ngay_chet')
    ly_do_chet = args.get('ly_do_chet')

    id = str(uuid.uuid4().hex)
    new_khai_tu = KhaiTu(id=id, id_nguoi_khai=id_nguoi_khai, id_nguoi_chet=id_nguoi_chet, 
                        so_giay_khai_tu=so_giay_khai_tu, ngay_khai=ngay_khai, ngay_chet=ngay_chet, ly_do_chet=ly_do_chet)

    try:
        db.session.add(new_khai_tu)
        nhan_khau_khai_tu = NhanKhau.query.filter_by(ID=id_nguoi_chet)
        if nhan_khau_khai_tu.first().ghi_chu == 'Đã qua đời':
            return return_response(code=400, msg="Nhân khẩu đã qua đời không thể khai tử.")
        nhan_khau_khai_tu = nhan_khau_khai_tu.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).first()
        nhan_khau_khai_tu.ghi_chu = 'Đã qua đời'
        nhan_khau_khai_tu.ngay_xoa = ngay_khai #Ngày xóa là ngày khai tử
        nhan_khau_khai_tu.id_nguoi_xoa = current_user.id_nguoi_dung
        nhan_khau_khai_tu.ly_do_xoa = 'Đã qua đời'
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(code=200, msg="Nhập thông tin khai tử thành công!")

@api.route('/delete_khai_tus/', methods=['POST'])
@login_required
@roles_required('Xoa thong tin khai tu')    #@roles_required('Xóa thông tin khai tử')
def delete_khai_tus():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinXoa().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_list = args.get('id_list')

    #check valid list
    if not id_list:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn thông tin khai tử để xóa.")

    return_message = []
    for id in id_list:
        khai_tu = KhaiTu.query.filter_by(id=id).first()
        if not khai_tu:
            return_message.append("Thông tin khai tử không tồn tại hoặc đã bị xóa.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id in id_list:
        khai_tu = KhaiTu.query.filter_by(id=id).first()
        try:
            db.session.delete(khai_tu)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa thông tin khai tử thành công!")

@api.route('/get_khai_tu/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin khai tu')    #@roles_required('Xem thông tin khai tử')
def get_khai_tu(id):

    khai_tu = KhaiTu.query.filter_by(id=id).first()
    if not khai_tu:
        return return_response(code=400, msg="Thông tin khai tử không tồn tại hoặc đã bị xóa.")
        
    nguoi_chet = NhanKhau.query.filter_by(ID=khai_tu.id_nguoi_chet).first()
    if not nguoi_chet:
        return return_response(code=400, msg="Nhân khẩu này không tồn tại hoặc đã bị xóa.")
    cmt_nguoi_chet = ChungMinhThu.query.filter_by(id_nhan_khau=nguoi_chet.ID).first()

    nguoi_khai = NhanKhau.query.filter_by(ID=khai_tu.id_nguoi_khai).first()
    if not nguoi_khai:
        return return_response(code=400, msg="Nhân khẩu này không tồn tại hoặc đã bị xóa.")
    cmt_nguoi_khai = ChungMinhThu.query.filter_by(id_nhan_khau=nguoi_khai.ID).first()

    data = {
        'id': khai_tu.id,
        'so_giay_khai_tu': khai_tu.so_giay_khai_tu,
        'id_nguoi_khai': khai_tu.id_nguoi_khai,
        'ten_nguoi_khai': nguoi_khai.ho_ten,
        'ngay_sinh_nguoi_khai': nguoi_khai.ngay_sinh,
        'dia_chi_nguoi_khai': nguoi_khai.dia_chi_hien_nay,
        'cmt_nguoi_khai': cmt_nguoi_khai.so_cmt if cmt_nguoi_khai else "",
        'id_nguoi_chet': khai_tu.id_nguoi_chet,
        'ten_nguoi_chet': nguoi_chet.ho_ten,
        'ngay_sinh_nguoi_chet': nguoi_chet.ngay_sinh,
        'dia_chi_nguoi_chet': nguoi_chet.dia_chi_hien_nay,
        'cmt_nguoi_chet': cmt_nguoi_chet.so_cmt if cmt_nguoi_chet else "",
        'ngay_khai': khai_tu.ngay_khai,
        'ngay_chet': khai_tu.ngay_chet,
        'ly_do_chet': khai_tu.ly_do_chet
    }

    return return_response(data=data)

@api.route('/get_khai_tus/', methods=['GET'])
@login_required
@roles_required('Xem thong tin khai tu')
def get_khai_tus():

    khai_tus = KhaiTu.query.all()
    data = []
    for khai_tu in khai_tus:
        nguoi_chet = NhanKhau.query.filter_by(ID=khai_tu.id_nguoi_chet).first()
        nguoi_khai = NhanKhau.query.filter_by(ID=khai_tu.id_nguoi_khai).first()
        data.append({
            'id': khai_tu.id,
            'so_giay_khai_tu': khai_tu.so_giay_khai_tu,
            'id_nguoi_khai': khai_tu.id_nguoi_khai,
            'ten_nguoi_khai': nguoi_khai.ho_ten,
            'id_nguoi_chet': khai_tu.id_nguoi_chet,
            'ten_nguoi_chet': nguoi_chet.ho_ten,
            'ngay_khai': khai_tu.ngay_khai,
            'ngay_chet': khai_tu.ngay_chet,
            'ly_do_chet': khai_tu.ly_do_chet
        })
    
    return return_response(data=data)