from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import ChungMinhThu, db, TamTru, NhanKhau
import uuid
from flask_login import login_required
from http import HTTPStatus
from .decorators import roles_required

# from flaskr.db import get_db

api = Blueprint('tam_tru', __name__, url_prefix='/tam_tru')

@api.route('/create_tam_tru/', methods=['POST'])
@login_required
@roles_required('Tao thong tin tam tru')    #@roles_required('Tạo thông tin tạm trú')
def create_tam_tru():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinTamTru().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_nhan_khau = args.get('id_nhan_khau')
    ma_giay_tam_tru = args.get('ma_giay_tam_tru')
    so_dien_thoai_nguoi_dang_ky = args.get('so_dien_thoai_nguoi_dang_ky')
    tu_ngay = args.get('tu_ngay')
    den_ngay = args.get('den_ngay')
    ly_do = args.get('ly_do')
    noi_tam_tru = args.get('noi_tam_tru')

    id = str(uuid.uuid4().hex)
    new_tam_tru = TamTru(id=id, id_nhan_khau=id_nhan_khau, ma_giay_tam_tru=ma_giay_tam_tru, noi_tam_tru=noi_tam_tru,
                        so_dien_thoai_nguoi_dang_ky=so_dien_thoai_nguoi_dang_ky, tu_ngay=tu_ngay, den_ngay=den_ngay, ly_do=ly_do)
    
    try:
        db.session.add(new_tam_tru)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(code=200, msg="Đăng ký tạm trú thành công!")

# @api.route('/delete_tam_trus/', methods=['POST'])
# @login_required
# # @roles_required('Xóa nhân khẩu')
# def delete_tam_trus():
#     #validate input
#     try:
#         args = request.get_json()
#         res = schema.ThongTinXoa().load(args)
#     except Exception as e:
#         return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

#     id_list = args.get('id_list')

#     #check valid list
#     if not id_list:
#         return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn nhân khẩu để xóa.")

#     return_message = []
#     for id in id_list:
#         tam_tru = TamTru.query.filter_by(so_so_ho_khau=id).first()
#         if not tam_tru:
#             return_message.append("nhân khẩu không tồn tại hoặc đã bị xóa.")
    
#     if return_message:
#         return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

#     return_message = []
#     for id in id_list:
#         tam_tru = TamTru.query.filter_by(id_nguoi_dung=id).first()
#         try:
#             # tam_tru_list = QuanHeNhomTamTru.query.filter_by(id_nguoi_dung=id).all()
#             # for rela in tam_tru_list:
#             #     db.session.delete(rela)
#             db.session.delete(tam_tru)
#             db.session.commit()
#         except Exception as e:
#             print(str(e))
#             return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

#     return return_response(msg="Xóa nhân khẩu thành công!")

# @api.route('/update_tam_tru/<id>/', methods=['PUT'])
# @login_required
# # @roles_required('Cập nhật thông tin tạm trú')
# def update_tam_tru(id):
#     #validate input
#     try:
#         args = request.get_json()
#         res = schema.ThongTinTamTru().load(args)
#     except Exception as e:
#         return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

#     id_nhan_khau = args.get('id_nhan_khau')
#     ma_giay_tam_tru = args.get('ma_giay_tam_tru')
#     so_dien_thoai_nguoi_dang_ky = args.get('so_dien_thoai_nguoi_dang_ky')
#     tu_ngay = args.get('tu_ngay')
#     den_ngay = args.get('den_ngay')
#     ly_do = args.get('ly_do')
#     noi_tam_tru = args.get('noi_tam_tru')

#     #check existing record
#     tam_tru = TamTru.query.filter_by(id=id).first()
#     if not tam_tru:
#         return return_response(code=HTTPStatus.BAD_REQUEST, msg="Thông tin tạm trú không tồn tại.")

#     tam_tru.id_nhan_khau = id_nhan_khau
#     tam_tru.ma_giay_tam_tru = ma_giay_tam_tru
#     tam_tru.so_dien_thoai_nguoi_dang_ky = so_dien_thoai_nguoi_dang_ky
#     tam_tru.tu_ngay = tu_ngay
#     tam_tru.den_ngay = den_ngay
#     tam_tru.ly_do = ly_do
#     tam_tru.noi_tam_tru = noi_tam_tru
   
#     try:
#         db.session.commit()
#     except Exception as e:
#         print(str(e))
#         return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

#     return return_response(msg="Cập nhật thông tin tạm trú thành công!")

@api.route('/delete_tam_trus/', methods=['POST'])
@login_required
@roles_required('Xoa thong tin tam tru')    #@roles_required('Xóa thông tin tạm trú')
def delete_tam_trus():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinXoa().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_list = args.get('id_list')

    #check valid list
    if not id_list:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn thông tin tạm trú để xóa.")

    return_message = []
    for id in id_list:
        tam_tru = TamTru.query.filter_by(id=id).first()
        if not tam_tru:
            return_message.append("Thông tin tạm trú không tồn tại hoặc đã bị xóa.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id in id_list:
        tam_tru = TamTru.query.filter_by(id=id).first()
        try:
            db.session.delete(tam_tru)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa thông tin tạm trú thành công!")

@api.route('/get_tam_tru/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin tam tru')    #@roles_required('Xem thông tin tạm trú')
def get_tam_tru(id):

    tam_tru = TamTru.query.filter_by(id=id).first()
    if not tam_tru:
        return return_response(code=400, msg="Thông tin tạm trú không tồn tại hoặc đã bị xóa.")
    
    # get người tạm trú info
    household_member = NhanKhau.query.filter_by(ID=tam_tru.id_nhan_khau).first()
    if not household_member:
        return return_response(code=500, msg="Không thể tìm thấy nhân khẩu.")
    cmt = ChungMinhThu.query.filter_by(id_nhan_khau=household_member.ID).first()

    data = {
        'id': tam_tru.id,
        'id_nhan_khau': tam_tru.id_nhan_khau,
        'ten_nhan_khau': household_member.ho_ten,
        'ngay_sinh': household_member.ngay_sinh,
        'dia_chi': household_member.dia_chi_hien_nay,
        'so_cmt': cmt.so_cmt if cmt else "",
        'ma_giay_tam_tru': tam_tru.ma_giay_tam_tru,
        'so_dien_thoai_nguoi_dang_ky': tam_tru.so_dien_thoai_nguoi_dang_ky,
        'tu_ngay': tam_tru.tu_ngay,
        'den_ngay': tam_tru.den_ngay,
        'ly_do': tam_tru.ly_do,
        'ho_ten': household_member.ho_ten,
        'ngay_sinh': household_member.ngay_sinh,
        'dia_chi': household_member.dia_chi_hien_nay,
        'so_cmt': cmt.so_cmt if cmt else ""
        # 'thong_tin_nhan_khau': {
        #     'ID': household_member.ID,
        #     'ho_ten': household_member.ho_ten,
        #     'biet_danh': household_member.biet_danh,
        #     'ngay_sinh': household_member.ngay_sinh,
        #     'gioi_tinh': household_member.gioi_tinh,
        #     'noi_sinh': household_member.noi_sinh,
        #     'nguyen_quan': household_member.nguyen_quan,
        #     'dan_toc': household_member.dan_toc,
        #     'ton_giao': household_member.ton_giao,
        #     'quoc_tich': household_member.quoc_tich,
        #     'so_ho_chieu': household_member.so_ho_chieu,
        #     'noi_thuong_tru': household_member.noi_thuong_tru,
        #     'dia_chi_hien_nay': household_member.dia_chi_hien_nay,
        #     'trinh_do_hoc_van': household_member.trinh_do_hoc_van,
        #     'biet_tieng_dan_toc': household_member.biet_tieng_dan_toc,
        #     'trinh_do_ngoai_ngu': household_member.trinh_do_ngoai_ngu,
        #     'nghe_nghiep': household_member.nghe_nghiep,
        #     'noi_lam_viec': household_member.noi_lam_viec,
        #     'tien_an': household_member.tien_an,
        #     'ngay_chuyen_den': household_member.ngay_chuyen_den,
        #     'ly_do_chuyen_den': household_member.ly_do_chuyen_den,
        #     'ngay_chuyen_di': household_member.ngay_chuyen_di,
        #     'ly_do_chuyen_di': household_member.ly_do_chuyen_di,
        #     'dia_chi_moi': household_member.dia_chi_moi,
        #     'ngay_tao': household_member.ngay_tao,
        #     'id_nguoi_tao': household_member.id_nguoi_tao,
        #     'ngay_xoa': household_member.ngay_xoa,
        #     'id_nguoi_xoa': household_member.id_nguoi_xoa,
        #     'ly_do_xoa': household_member.ly_do_xoa,
        #     'ghi_chu': household_member.ghi_chu
        # }
    }

    return return_response(data=data)

@api.route('/get_tam_trus/', methods=['GET'])
@login_required
@roles_required('Xem thong tin tam tru')
def get_tam_trus():

    tam_trus = TamTru.query.all()
    data = []
    for tam_tru in tam_trus:
        #get người tạm trú info
        household_member = NhanKhau.query.filter_by(ID=tam_tru.id_nhan_khau).first()
        if not household_member:
            return return_response(code=500, msg="Không thể tìm thấy nhân khẩu.")

        data.append({
            'id': tam_tru.id,
            'id_nhan_khau': tam_tru.id_nhan_khau,
            'ten_nhan_khau': household_member.ho_ten,
            'ma_giay_tam_tru': tam_tru.ma_giay_tam_tru,
            'so_dien_thoai_nguoi_dang_ky': tam_tru.so_dien_thoai_nguoi_dang_ky,
            'tu_ngay': tam_tru.tu_ngay,
            'den_ngay': tam_tru.den_ngay,
            'ly_do': tam_tru.ly_do,

            # 'thong_tin_nhan_khau': {
            #     'ID': household_member.ID,
            #     'ho_ten': household_member.ho_ten,
            #     'biet_danh': household_member.biet_danh,
            #     'ngay_sinh': household_member.ngay_sinh,
            #     'gioi_tinh': household_member.gioi_tinh,
            #     'noi_sinh': household_member.noi_sinh,
            #     'nguyen_quan': household_member.nguyen_quan,
            #     'dan_toc': household_member.dan_toc,
            #     'ton_giao': household_member.ton_giao,
            #     'quoc_tich': household_member.quoc_tich,
            #     'so_ho_chieu': household_member.so_ho_chieu,
            #     'noi_thuong_tru': household_member.noi_thuong_tru,
            #     'dia_chi_hien_nay': household_member.dia_chi_hien_nay,
            #     'trinh_do_hoc_van': household_member.trinh_do_hoc_van,
            #     'biet_tieng_dan_toc': household_member.biet_tieng_dan_toc,
            #     'trinh_do_ngoai_ngu': household_member.trinh_do_ngoai_ngu,
            #     'nghe_nghiep': household_member.nghe_nghiep,
            #     'noi_lam_viec': household_member.noi_lam_viec,
            #     'tien_an': household_member.tien_an,
            #     'ngay_chuyen_den': household_member.ngay_chuyen_den,
            #     'ly_do_chuyen_den': household_member.ly_do_chuyen_den,
            #     'ngay_chuyen_di': household_member.ngay_chuyen_di,
            #     'ly_do_chuyen_di': household_member.ly_do_chuyen_di,
            #     'dia_chi_moi': household_member.dia_chi_moi,
            #     'ngay_tao': household_member.ngay_tao,
            #     'id_nguoi_tao': household_member.id_nguoi_tao,
            #     'ngay_xoa': household_member.ngay_xoa,
            #     'id_nguoi_xoa': household_member.id_nguoi_xoa,
            #     'ly_do_xoa': household_member.ly_do_xoa,
            #     'ghi_chu': household_member.ghi_chu
            # }
        })
    
    return return_response(data=data)