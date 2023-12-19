from .decorators import roles_required
from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import ChungMinhThu, NhanKhau, db, TamVang
import uuid
from flask_login import login_required
from http import HTTPStatus

api = Blueprint('tam_vang', __name__, url_prefix='/tam_vang')

@api.route('/create_tam_vang/', methods=['POST'])
@login_required
@roles_required('Tao thong tin tam vang')   #@roles_required('Tạo thông tin tạm vắng')
def create_tam_vang():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinTamVang().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_nhan_khau = args.get('id_nhan_khau')
    ma_giay_tam_vang = args.get('ma_giay_tam_vang')
    noi_tam_tru = args.get('noi_tam_tru')
    tu_ngay = args.get('tu_ngay')
    den_ngay = args.get('den_ngay')
    ly_do = args.get('ly_do')

    id = str(uuid.uuid4().hex)
    new_tam_vang = TamVang(id=id, id_nhan_khau=id_nhan_khau, ma_giay_tam_vang=ma_giay_tam_vang, 
                        noi_tam_tru=noi_tam_tru, tu_ngay=tu_ngay, den_ngay=den_ngay, ly_do=ly_do)
    
    try:
        db.session.add(new_tam_vang)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(code=200, msg="Đăng ký tạm vắng thành công!")

@api.route('/delete_tam_vangs/', methods=['POST'])
@login_required
@roles_required('Xoa thong tin tam vang')   #@roles_required('Xóa thông tin tạm vắng')
def delete_tam_vangs():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinXoa().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_list = args.get('id_list')

    #check valid list
    if not id_list:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn thông tin tạm vắng để xóa.")

    return_message = []
    for id in id_list:
        tam_vang = TamVang.query.filter_by(id=id).first()
        if not tam_vang:
            return_message.append("Thông tin tạm vắng không tồn tại hoặc đã bị xóa.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id in id_list:
        tam_vang = TamVang.query.filter_by(id=id).first()
        try:
            db.session.delete(tam_vang)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa thông tin tạm vắng thành công!")

@api.route('/get_tam_vang/<id>/', methods=['GET'])
@login_required
@roles_required('Xoa thong tin tam vang')
def get_tam_vang(id):

    tam_vang = TamVang.query.filter_by(id=id).first()
    if not tam_vang:
        return return_response(code=400, msg="Thông tin tạm vắng không tồn tại hoặc đã bị xóa.")
    
    # get người tạm vắng info
    household_member = NhanKhau.query.filter_by(ID=tam_vang.id_nhan_khau).first()
    if not household_member:
        return return_response(code=500, msg="Không thể tìm thấy nhân khẩu.")
    cmt = ChungMinhThu.query.filter_by(id_nhan_khau=household_member.ID).first()
    data = {
        'id': tam_vang.id,
        'id_nhan_khau': tam_vang.id_nhan_khau,
        'ma_giay_tam_vang': tam_vang.ma_giay_tam_vang,
        'noi_tam_tru': tam_vang.noi_tam_tru,
        'tu_ngay': tam_vang.tu_ngay,
        'den_ngay': tam_vang.den_ngay,
        'ly_do': tam_vang.ly_do,
        'ho_ten': household_member.ho_ten,
        'ngay_sinh': household_member.ngay_sinh,
        'dia_chi': household_member.dia_chi_hien_nay,
        'so_cmt': cmt.so_cmt if cmt else ""
    }

    return return_response(data=data)

@api.route('/get_tam_vangs/', methods=['GET'])
@login_required
@roles_required('Xoa thong tin tam vang')
def get_tam_vangs():

    tam_vangs = TamVang.query.all()
    data = []
    for tam_vang in tam_vangs:

        household_member = NhanKhau.query.filter_by(ID=tam_vang.id_nhan_khau).first()
        if not household_member:
            return return_response(code=500, msg="Không thể tìm thấy nhân khẩu.")
        cmt = ChungMinhThu.query.filter_by(id_nhan_khau=household_member.ID).first()

        data.append({
            'id': tam_vang.id,
            'id_nhan_khau': tam_vang.id_nhan_khau,
            'ten_nhan_khau': household_member.ho_ten,
            'ma_giay_tam_vang': tam_vang.ma_giay_tam_vang,
            'noi_tam_tru': tam_vang.noi_tam_tru,
            'tu_ngay': tam_vang.tu_ngay,
            'den_ngay': tam_vang.den_ngay,
            'ly_do': tam_vang.ly_do
        })
    
    return return_response(data=data)