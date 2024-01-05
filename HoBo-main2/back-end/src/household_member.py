from sqlalchemy import and_, or_
from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import db, NhanKhau, ChungMinhThu
import uuid
from flask_login import login_required, current_user
from http import HTTPStatus
from .decorators import roles_required
from datetime import date


# from flaskr.db import get_db

api = Blueprint('household_member', __name__, url_prefix='/household_member')

@api.route('/create_household_member/', methods=['POST'])
@login_required
@roles_required('Tao nhan khau moi')    #@roles_required('Tạo nhân khẩu mới')
def create_household_member():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinNhanKhau().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    ho_ten = args.get('ho_ten')
    biet_danh = args.get('biet_danh')
    ngay_sinh = args.get('ngay_sinh')
    gioi_tinh = args.get('gioi_tinh')
    noi_sinh = args.get('noi_sinh')
    nguyen_quan = args.get('nguyen_quan')
    dan_toc = args.get('dan_toc')
    ton_giao = args.get('ton_giao')
    quoc_tich = args.get('quoc_tich')
    so_ho_chieu = args.get('so_ho_chieu')
    noi_thuong_tru = args.get('noi_thuong_tru')
    dia_chi_hien_nay = args.get('dia_chi_hien_nay')
    trinh_do_hoc_van = args.get('trinh_do_hoc_van')
    biet_tieng_dan_toc = args.get('biet_tieng_dan_toc')
    trinh_do_ngoai_ngu = args.get('trinh_do_ngoai_ngu')
    nghe_nghiep = args.get('nghe_nghiep')
    noi_lam_viec = args.get('noi_lam_viec')
    tien_an = args.get('tien_an')
    ngay_chuyen_den = args.get('ngay_chuyen_den')
    ly_do_chuyen_den = args.get('ly_do_chuyen_den')
    ngay_chuyen_di = args.get('ngay_chuyen_di')
    ly_do_chuyen_di = args.get('ly_do_chuyen_di')
    dia_chi_moi = args.get('dia_chi_moi')
    ghi_chu = args.get('ghi_chu')
    so_cmt = args.get('so_cmt')
    ngay_cap = args.get('ngay_cap')
    noi_cap = args.get('noi_cap')

    #check existing so_cmt
    if so_cmt:
        cmt = ChungMinhThu.query.filter_by(so_cmt=so_cmt).first()
        if cmt:
            return return_response(code=HTTPStatus.BAD_REQUEST, msg="Số CMT/CCCD đã được sử dụng.")

    if str(ngay_sinh) > date.today().strftime("%Y-%m-%d"):
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Ngày sinh của nhân khẩu không đúng.")

    id = str(uuid.uuid4().hex)
    new_household_member = NhanKhau(ID=id, ho_ten=ho_ten, biet_danh=biet_danh, ngay_sinh=ngay_sinh, 
                                    gioi_tinh=gioi_tinh, noi_sinh=noi_sinh, nguyen_quan=nguyen_quan, 
                                    dan_toc=dan_toc, ton_giao=ton_giao, quoc_tich=quoc_tich, 
                                    so_ho_chieu=so_ho_chieu, noi_thuong_tru=noi_thuong_tru, 
                                    dia_chi_hien_nay=dia_chi_hien_nay, trinh_do_hoc_van=trinh_do_hoc_van, 
                                    biet_tieng_dan_toc=biet_tieng_dan_toc, trinh_do_ngoai_ngu=trinh_do_ngoai_ngu, 
                                    nghe_nghiep=nghe_nghiep, noi_lam_viec=noi_lam_viec, tien_an=tien_an, 
                                    ngay_chuyen_den=ngay_chuyen_den, ly_do_chuyen_den=ly_do_chuyen_den, 
                                    ngay_chuyen_di=ngay_chuyen_di, ly_do_chuyen_di=ly_do_chuyen_di, 
                                    dia_chi_moi=dia_chi_moi, ghi_chu=ghi_chu)
    new_household_member.id_nguoi_tao = current_user.id_nguoi_dung
    new_household_member.ngay_tao = date.today()
    if so_cmt:
        new_cmt = ChungMinhThu(so_cmt=so_cmt, id_nhan_khau=id, ngay_cap=ngay_cap, noi_cap=noi_cap)
    
    try:
        db.session.add(new_household_member)
        db.session.commit() #commit truoc
        if so_cmt:
            db.session.add(new_cmt)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(code=200, msg="Tạo nhân khẩu mới thành công!")

@api.route('/update_household_member/<id>/', methods=['PUT'])
@login_required
@roles_required('Cap nhat thong tin nhan khau') #@roles_required('Cập nhật thông tin nhân khẩu')
def update_household_member(id):
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinNhanKhau().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    ho_ten = args.get('ho_ten')
    biet_danh = args.get('biet_danh')
    ngay_sinh = args.get('ngay_sinh')
    gioi_tinh = args.get('gioi_tinh')
    noi_sinh = args.get('noi_sinh')
    nguyen_quan = args.get('nguyen_quan')
    dan_toc = args.get('dan_toc')
    ton_giao = args.get('ton_giao')
    quoc_tich = args.get('quoc_tich')
    so_ho_chieu = args.get('so_ho_chieu')
    noi_thuong_tru = args.get('noi_thuong_tru')
    dia_chi_hien_nay = args.get('dia_chi_hien_nay')
    trinh_do_hoc_van = args.get('trinh_do_hoc_van')
    biet_tieng_dan_toc = args.get('biet_tieng_dan_toc')
    trinh_do_ngoai_ngu = args.get('trinh_do_ngoai_ngu')
    nghe_nghiep = args.get('nghe_nghiep')
    noi_lam_viec = args.get('noi_lam_viec')
    tien_an = args.get('tien_an')
    ngay_chuyen_den = args.get('ngay_chuyen_den')
    ly_do_chuyen_den = args.get('ly_do_chuyen_den')
    ngay_chuyen_di = args.get('ngay_chuyen_di')
    ly_do_chuyen_di = args.get('ly_do_chuyen_di')
    dia_chi_moi = args.get('dia_chi_moi')
    ngay_tao = args.get('ngay_tao')
    id_nguoi_tao = args.get('id_nguoi_tao')
    ngay_xoa = args.get('ngay_xoa')
    id_nguoi_xoa = args.get('id_nguoi_xoa')
    ly_do_xoa = args.get('ly_do_xoa')
    ghi_chu = args.get('ghi_chu')
    so_cmt = args.get('so_cmt')
    ngay_cap = args.get('ngay_cap')
    noi_cap = args.get('noi_cap')

    #check existing record
    household_member = NhanKhau.query.filter_by(ID= id).first()
    if not household_member:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Nhân khẩu không tồn tại.")

    if str(ngay_sinh) > date.today().strftime("%Y-%m-%d"):
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Ngày sinh của nhân khẩu không đúng.")

    household_member.ho_ten = ho_ten
    household_member.biet_danh = biet_danh
    household_member.ngay_sinh = ngay_sinh
    household_member.gioi_tinh = gioi_tinh
    household_member.noi_sinh = noi_sinh
    household_member.nguyen_quan = nguyen_quan
    household_member.dan_toc = dan_toc
    household_member.ton_giao = ton_giao
    household_member.quoc_tich = quoc_tich
    household_member.so_ho_chieu = so_ho_chieu
    household_member.noi_thuong_tru = noi_thuong_tru
    household_member.dia_chi_hien_nay = dia_chi_hien_nay
    household_member.trinh_do_hoc_van = trinh_do_hoc_van
    household_member.biet_tieng_dan_toc = biet_tieng_dan_toc
    household_member.trinh_do_ngoai_ngu = trinh_do_ngoai_ngu
    household_member.nghe_nghiep = nghe_nghiep
    household_member.noi_lam_viec = noi_lam_viec
    household_member.tien_an = tien_an
    household_member.ngay_chuyen_den = ngay_chuyen_den
    household_member.ly_do_chuyen_den = ly_do_chuyen_den
    household_member.ngay_chuyen_di = ngay_chuyen_di
    household_member.ly_do_chuyen_di = ly_do_chuyen_di
    household_member.dia_chi_moi = dia_chi_moi
    household_member.ngay_tao = ngay_tao
    household_member.id_nguoi_tao = id_nguoi_tao
    household_member.ngay_xoa = ngay_xoa
    household_member.id_nguoi_xoa = id_nguoi_xoa
    household_member.ly_do_xoa = ly_do_xoa
    household_member.ghi_chu = ghi_chu

    cmt = ChungMinhThu.query.filter_by(id_nhan_khau=id).first()
    if cmt:
        cmt.so_cmt = so_cmt
        cmt.ngay_cap = ngay_cap
        cmt.noi_cap = noi_cap
    else:
        new_cmt = ChungMinhThu(so_cmt=so_cmt, id_nhan_khau=id, ngay_cap=ngay_cap, noi_cap=noi_cap)
        db.session.add(new_cmt)
   
    try:
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Cập nhật nhân khẩu thành công!")

# @api.route('/delete_household_members/', methods=['POST'])
# @login_required
# # @roles_required('Xóa nhân khẩu')
# def delete_household_members():
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
#         household_member = NhanKhau.query.filter_by(ID=id).first()
#         if not household_member or household_member.ngay_xoa != None:
#             return_message.append("Nhân khẩu không tồn tại hoặc đã bị xóa.")
    
#     if return_message:
#         return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

#     return_message = []
#     for id in id_list:
#         household_member = NhanKhau.query.filter_by(id_nguoi_dung=id).first()
#         try:
#             # household_member_list = QuanHeNhomNhanKhau.query.filter_by(id_nguoi_dung=id).all()
#             # for rela in household_member_list:
#             #     db.session.delete(rela)
#             db.session.delete(household_member)
#             db.session.commit()
#         except Exception as e:
#             print(str(e))
#             return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

#     return return_response(msg="Xóa nhân khẩu thành công!")

@api.route('/get_household_member/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nhan khau')  #@roles_required('Xem thông tin nhân khẩu')
def get_household_member(id):

    household_member = NhanKhau.query.filter_by(ID=id).first()
    if not household_member:
        return return_response(code=400, msg="Nhân khẩu không tồn tại hoặc đã bị xóa.")

    data = {
        'ID': household_member.ID,
        'ho_ten': household_member.ho_ten,
        'biet_danh': household_member.biet_danh,
        'ngay_sinh': household_member.ngay_sinh,
        'gioi_tinh': household_member.gioi_tinh,
        'noi_sinh': household_member.noi_sinh,
        'nguyen_quan': household_member.nguyen_quan,
        'dan_toc': household_member.dan_toc,
        'ton_giao': household_member.ton_giao,
        'quoc_tich': household_member.quoc_tich,
        'so_ho_chieu': household_member.so_ho_chieu,
        'noi_thuong_tru': household_member.noi_thuong_tru,
        'dia_chi_hien_nay': household_member.dia_chi_hien_nay,
        'trinh_do_hoc_van': household_member.trinh_do_hoc_van,
        'biet_tieng_dan_toc': household_member.biet_tieng_dan_toc,
        'trinh_do_ngoai_ngu': household_member.trinh_do_ngoai_ngu,
        'nghe_nghiep': household_member.nghe_nghiep,
        'noi_lam_viec': household_member.noi_lam_viec,
        'tien_an': household_member.tien_an,
        'ngay_chuyen_den': household_member.ngay_chuyen_den,
        'ly_do_chuyen_den': household_member.ly_do_chuyen_den,
        'ngay_chuyen_di': household_member.ngay_chuyen_di,
        'ly_do_chuyen_di': household_member.ly_do_chuyen_di,
        'dia_chi_moi': household_member.dia_chi_moi,
        'ngay_tao': household_member.ngay_tao,
        'id_nguoi_tao': household_member.id_nguoi_tao,
        'ngay_xoa': household_member.ngay_xoa,
        'id_nguoi_xoa': household_member.id_nguoi_xoa,
        'ly_do_xoa': household_member.ly_do_xoa,
        'ghi_chu': household_member.ghi_chu
    }

    cmt = ChungMinhThu.query.filter_by(id_nhan_khau=id).first()
    if cmt:
        data.update({
            'so_cmt': cmt.so_cmt,
            'ngay_cap': cmt.ngay_cap,
            'noi_cap': cmt.noi_cap
        })

    return return_response(data=data)

@api.route('/get_household_members/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nhan khau')
def get_household_members():

    household_members = NhanKhau.query.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).all()
    data = []
    for household_member in household_members:
        data.append({
            'ID': household_member.ID,
            'ho_ten': household_member.ho_ten,
            'biet_danh': household_member.biet_danh,
            'ngay_sinh': household_member.ngay_sinh,
            'gioi_tinh': household_member.gioi_tinh,
            'noi_sinh': household_member.noi_sinh,
            'nguyen_quan': household_member.nguyen_quan,
            'dan_toc': household_member.dan_toc,
            'ton_giao': household_member.ton_giao,
            'quoc_tich': household_member.quoc_tich,
            'so_ho_chieu': household_member.so_ho_chieu,
            'noi_thuong_tru': household_member.noi_thuong_tru,
            'dia_chi_hien_nay': household_member.dia_chi_hien_nay,
            'trinh_do_hoc_van': household_member.trinh_do_hoc_van,
            'biet_tieng_dan_toc': household_member.biet_tieng_dan_toc,
            'trinh_do_ngoai_ngu': household_member.trinh_do_ngoai_ngu,
            'nghe_nghiep': household_member.nghe_nghiep,
            'noi_lam_viec': household_member.noi_lam_viec,
            'tien_an': household_member.tien_an,
            'ngay_chuyen_den': household_member.ngay_chuyen_den,
            'ly_do_chuyen_den': household_member.ly_do_chuyen_den,
            'ngay_chuyen_di': household_member.ngay_chuyen_di,
            'ly_do_chuyen_di': household_member.ly_do_chuyen_di,
            'dia_chi_moi': household_member.dia_chi_moi,
            'ngay_tao': household_member.ngay_tao,
            'id_nguoi_tao': household_member.id_nguoi_tao,
            'ngay_xoa': household_member.ngay_xoa,
            'id_nguoi_xoa': household_member.id_nguoi_xoa,
            'ly_do_xoa': household_member.ly_do_xoa,
            'ghi_chu': household_member.ghi_chu
        })
        cmt = ChungMinhThu.query.filter_by(id_nhan_khau=household_member.ID).first()
        if cmt:
            data[-1].update({
                'so_cmt': cmt.so_cmt,
                'ngay_cap': cmt.ngay_cap,
                'noi_cap': cmt.noi_cap
            })
    
    return return_response(data=data)

#mẫu url: /search_household_members/?query=abc
@api.route('/search_household_members/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nhan khau')
def search_household_members():
    """
        field: Trường cần search (name, cmt)
        query: câu query cần search
    """
    field = request.args.get('field')
    query = request.args.get('query')
    if field == "name":
        household_members = NhanKhau.query.filter(NhanKhau.ho_ten.like(f"%{query}%"))
        household_members = household_members.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).all()
    elif field == "cmt":
        cmts = ChungMinhThu.query.filter(ChungMinhThu.so_cmt.like(f"%{query}%")).all()
        list_id_nhan_khau = []
        for cmt in cmts:
            list_id_nhan_khau.append(cmt.id_nhan_khau)
        household_members = NhanKhau.query.filter(NhanKhau.ID.in_(list_id_nhan_khau))
        household_members = household_members.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).all()
    else:
        household_members = NhanKhau.query.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).all()
    data = []
    for household_member in household_members:
        data.append({
            'ID': household_member.ID,
            'ho_ten': household_member.ho_ten,
            'biet_danh': household_member.biet_danh,
            'ngay_sinh': household_member.ngay_sinh,
            'gioi_tinh': household_member.gioi_tinh,
            'noi_sinh': household_member.noi_sinh,
            'nguyen_quan': household_member.nguyen_quan,
            'dan_toc': household_member.dan_toc,
            'ton_giao': household_member.ton_giao,
            'quoc_tich': household_member.quoc_tich,
            'so_ho_chieu': household_member.so_ho_chieu,
            'noi_thuong_tru': household_member.noi_thuong_tru,
            'dia_chi_hien_nay': household_member.dia_chi_hien_nay,
            'trinh_do_hoc_van': household_member.trinh_do_hoc_van,
            'biet_tieng_dan_toc': household_member.biet_tieng_dan_toc,
            'trinh_do_ngoai_ngu': household_member.trinh_do_ngoai_ngu,
            'nghe_nghiep': household_member.nghe_nghiep,
            'noi_lam_viec': household_member.noi_lam_viec,
            'tien_an': household_member.tien_an,
            'ngay_chuyen_den': household_member.ngay_chuyen_den,
            'ly_do_chuyen_den': household_member.ly_do_chuyen_den,
            'ngay_chuyen_di': household_member.ngay_chuyen_di,
            'ly_do_chuyen_di': household_member.ly_do_chuyen_di,
            'dia_chi_moi': household_member.dia_chi_moi,
            'ngay_tao': household_member.ngay_tao,
            'id_nguoi_tao': household_member.id_nguoi_tao,
            'ngay_xoa': household_member.ngay_xoa,
            'id_nguoi_xoa': household_member.id_nguoi_xoa,
            'ly_do_xoa': household_member.ly_do_xoa,
            'ghi_chu': household_member.ghi_chu
        })
        cmt = ChungMinhThu.query.filter_by(id_nhan_khau=household_member.ID).first()
        if cmt:
            data[-1].update({
                'so_cmt': cmt.so_cmt,
                'ngay_cap': cmt.ngay_cap,
                'noi_cap': cmt.noi_cap
            })
    
    return return_response(data=data)

@api.route('/get_household_member_by_cmt/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nhan khau')
def get_household_member_by_cmt():
    so_cmt = request.args.get('cmt')
    cmt = ChungMinhThu.query.filter_by(so_cmt=so_cmt).first()
    if not cmt:
        return return_response(code=400, msg="Số CMT/CCCD không tồn tại.")

    household_member = NhanKhau.query.filter_by(ID=cmt.id_nhan_khau)
    household_member = household_member.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).first()
    
    if not household_member:
        return return_response(code=400, msg="Nhân khẩu không tồn tại hoặc đã bị xóa.")

    data = {
        'ID': household_member.ID,
        'ho_ten': household_member.ho_ten,
        'biet_danh': household_member.biet_danh,
        'ngay_sinh': household_member.ngay_sinh,
        'gioi_tinh': household_member.gioi_tinh,
        'noi_sinh': household_member.noi_sinh,
        'nguyen_quan': household_member.nguyen_quan,
        'dan_toc': household_member.dan_toc,
        'ton_giao': household_member.ton_giao,
        'quoc_tich': household_member.quoc_tich,
        'so_ho_chieu': household_member.so_ho_chieu,
        'noi_thuong_tru': household_member.noi_thuong_tru,
        'dia_chi_hien_nay': household_member.dia_chi_hien_nay,
        'trinh_do_hoc_van': household_member.trinh_do_hoc_van,
        'biet_tieng_dan_toc': household_member.biet_tieng_dan_toc,
        'trinh_do_ngoai_ngu': household_member.trinh_do_ngoai_ngu,
        'nghe_nghiep': household_member.nghe_nghiep,
        'noi_lam_viec': household_member.noi_lam_viec,
        'tien_an': household_member.tien_an,
        'ngay_chuyen_den': household_member.ngay_chuyen_den,
        'ly_do_chuyen_den': household_member.ly_do_chuyen_den,
        'ngay_chuyen_di': household_member.ngay_chuyen_di,
        'ly_do_chuyen_di': household_member.ly_do_chuyen_di,
        'dia_chi_moi': household_member.dia_chi_moi,
        'ngay_tao': household_member.ngay_tao,
        'id_nguoi_tao': household_member.id_nguoi_tao,
        'ngay_xoa': household_member.ngay_xoa,
        'id_nguoi_xoa': household_member.id_nguoi_xoa,
        'ly_do_xoa': household_member.ly_do_xoa,
        'ghi_chu': household_member.ghi_chu
    }
        
    if cmt:
        data.update({
            'so_cmt': cmt.so_cmt,
            'ngay_cap': cmt.ngay_cap,
            'noi_cap': cmt.noi_cap
        })
    
    return return_response(data=data)