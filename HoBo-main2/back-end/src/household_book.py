from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import db, HoKhau, ThanhVienCuaHo, NhanKhau, LichSuHoKhau
import uuid
from flask_login import login_required, current_user
from http import HTTPStatus
from .decorators import roles_required
from datetime import datetime

# from flaskr.db import get_db

api = Blueprint('household', __name__, url_prefix='/household')

@api.route('/create_household/', methods=['POST'])
@login_required
@roles_required('Tao so ho khau moi')   #@roles_required('Tạo sổ hộ khẩu mới')
def create_household():
    """
        Mẫu input:
        {
            "ma_ho_khau": string,
            "id_chu_ho": string,
            "ma_khu_vuc": string,
            "dia_chi": string,
            "ly_do_chuyen": string,
            "ngay_lap": "2022-02-02", (string theo format này)
            "ngay_chuyen_di": "2022-02-02" (string theo format này),
            "list_nhan_khau": [
                {
                    "id_nhan_khau": string,
                    "quan_he_voi_chu_ho": string
                },... (không bao gồm chủ hộ)
            ]
        }
    """
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinHoKhau().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    ma_ho_khau = args.get('ma_ho_khau')
    id_chu_ho = args.get('id_chu_ho')
    ma_khu_vuc = args.get('ma_khu_vuc')
    dia_chi = args.get('dia_chi')
    ngay_lap = args.get('ngay_lap')
    ngay_chuyen_di = args.get('ngay_chuyen_di')
    ly_do_chuyen = args.get('ly_do_chuyen')
    list_nhan_khau = args.get('list_nhan_khau')
    dien_tich = args.get('dien_tich')

    #check existing ma_ho_khau
    household = HoKhau.query.filter_by(ma_ho_khau=ma_ho_khau).first()
    if household:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Sổ hộ khẩu đã được đăng ký.")

    #check existing chu_ho
    chu_ho = NhanKhau.query.filter_by(ID=id_chu_ho).first()
    if not chu_ho:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chủ hộ không tồn tại hoặc đã bị xóa.")

    #check if chu_ho is in another household
    household_check = HoKhau.query.filter(HoKhau.id_chu_ho == id_chu_ho, HoKhau.ma_ho_khau != ma_ho_khau).first()
    if household_check:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chủ hộ đã đăng ký hộ khẩu.")

    #check if nhan_khau exists
    if list_nhan_khau:
        for nhan_khau in list_nhan_khau:
            if nhan_khau['id_nhan_khau'] == id_chu_ho:
                return return_response(code=HTTPStatus.BAD_REQUEST, msg="Thành viên trùng với chủ hộ.")
            nhan_khau_check = NhanKhau.query.filter_by(ID=nhan_khau['id_nhan_khau']).first()
            if not nhan_khau_check:
                return return_response(code=HTTPStatus.BAD_REQUEST, msg="Nhân khẩu đã chọn không tồn tại hoặc đã bị xóa.")

    id_nguoi_thuc_hien = current_user.id_nguoi_dung
    id = str(uuid.uuid4().hex)
    new_household = HoKhau(id=id, ma_ho_khau=ma_ho_khau, id_chu_ho=id_chu_ho, ma_khu_vuc=ma_khu_vuc, dia_chi=dia_chi,
                        ngay_lap=ngay_lap, ngay_chuyen_di=ngay_chuyen_di, ly_do_chuyen=ly_do_chuyen, dien_tich= dien_tich, id_nguoi_thuc_hien=id_nguoi_thuc_hien)
    
    try:
        db.session.add(new_household)
        for nhan_khau in list_nhan_khau:
            new_rela = ThanhVienCuaHo(id_nhan_khau=nhan_khau['id_nhan_khau'], 
                                    id_ho_khau=id, quan_he_voi_chu_ho=nhan_khau['quan_he_voi_chu_ho'])
            db.session.add(new_rela)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    log = LichSuHoKhau(id=str(uuid.uuid4().hex), id_ho_khau=id,
                        ngay_chinh_sua=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        thong_tin_chinh_sua=f"Hộ khẩu đã được tạo với mã hộ khẩu là {ma_ho_khau}.",
                        id_nguoi_chinh_sua=current_user.id_nguoi_dung)
    try:
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(code=200, msg="Tạo hộ khẩu mới thành công!", data={'id': id})
# Thay doi ho khau
@api.route('/update_household/<id>/', methods=['PUT'])
@login_required
@roles_required('Cap nhat thong tin so ho khau')        #@roles_required('Cập nhật thông tin sổ hộ khẩu')
def update_household(id):
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinHoKhau().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    ma_ho_khau = args.get('ma_ho_khau')
    id_chu_ho = args.get('id_chu_ho')
    ma_khu_vuc = args.get('ma_khu_vuc')
    dia_chi = args.get('dia_chi')
    ngay_lap = args.get('ngay_lap')
    ngay_chuyen_di = args.get('ngay_chuyen_di')
    ly_do_chuyen = args.get('ly_do_chuyen')
    list_nhan_khau = args.get('list_nhan_khau')
    dien_tich= args.get('dien_tich')

    #check existing record
    household = HoKhau.query.filter_by(id=id).first()
    if not household:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Hộ khẩu không tồn tại.")

    #check if chu_ho is in another household
    household_check = HoKhau.query.filter(HoKhau.id_chu_ho == id_chu_ho, HoKhau.id != id).first()
    if household_check:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chủ hộ đã đăng ký hộ khẩu.")

    #check existing ma_ho_khau
    household_check = HoKhau.query.filter(HoKhau.ma_ho_khau == ma_ho_khau, HoKhau.id != id).first()
    if household_check:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Số sổ hộ khẩu đã tồn tại.")

    if list_nhan_khau:
        for nhan_khau in list_nhan_khau:
            if nhan_khau['id_nhan_khau'] == id_chu_ho:
                return return_response(code=HTTPStatus.BAD_REQUEST, msg="Thành viên trùng với chủ hộ.")
    #Compare old and new version
    if ma_ho_khau != household.ma_ho_khau:
        log_ma_ho_khau = LichSuHoKhau(id=str(uuid.uuid4().hex), id_ho_khau=id,
                        ngay_chinh_sua=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        thong_tin_chinh_sua=f"Hộ khẩu đã thay đổi mã hộ khẩu: Từ {household.ma_ho_khau} thành {ma_ho_khau}.",
                        id_nguoi_chinh_sua=current_user.id_nguoi_dung)
        db.session.add(log_ma_ho_khau)
    if id_chu_ho != household.id_chu_ho:
        chu_ho_cu = NhanKhau.query.filter_by(ID=household.id_chu_ho).first()
        chu_ho_moi = NhanKhau.query.filter_by(ID=id_chu_ho).first()
        log_id_chu_ho = LichSuHoKhau(id=str(uuid.uuid4().hex), id_ho_khau=id,
                        ngay_chinh_sua=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        thong_tin_chinh_sua=f"Hộ khẩu đã thay đổi chủ hộ: Từ {chu_ho_cu.ho_ten} thành {chu_ho_moi.ho_ten}.",
                        id_nguoi_chinh_sua=current_user.id_nguoi_dung)
        db.session.add(log_id_chu_ho)
    if ma_khu_vuc != household.ma_khu_vuc:
        log_ma_khu_vuc = LichSuHoKhau(id=str(uuid.uuid4().hex), id_ho_khau=id,
                        ngay_chinh_sua=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        thong_tin_chinh_sua=f"Hộ khẩu đã thay đổi mã khu vực: Từ {household.ma_khu_vuc} thành {ma_khu_vuc}.",
                        id_nguoi_chinh_sua=current_user.id_nguoi_dung)
        db.session.add(log_ma_khu_vuc)
    if dia_chi != household.dia_chi:
        log_dia_chi = LichSuHoKhau(id=str(uuid.uuid4().hex), id_ho_khau=id,
                        ngay_chinh_sua=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        thong_tin_chinh_sua=f"Hộ khẩu đã thay đổi địa chỉ: Từ {household.dia_chi} thành {dia_chi}.",
                        id_nguoi_chinh_sua=current_user.id_nguoi_dung)
        db.session.add(log_dia_chi)
    if str(ngay_lap) != str(household.ngay_lap):
        log_ngay_lap = LichSuHoKhau(id=str(uuid.uuid4().hex), id_ho_khau=id,
                        ngay_chinh_sua=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        thong_tin_chinh_sua=f"Hộ khẩu đã thay đổi ngày lập: Từ {household.ngay_lap} thành {ngay_lap}.",
                        id_nguoi_chinh_sua=current_user.id_nguoi_dung)
        db.session.add(log_ngay_lap)
    if str(ngay_chuyen_di) != str(household.ngay_chuyen_di):
        log_ngay_chuyen_di = LichSuHoKhau(id=str(uuid.uuid4().hex), id_ho_khau=id,
                        ngay_chinh_sua=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        thong_tin_chinh_sua=f"Hộ khẩu đã thay đổi ngày chuyển đi: Từ {household.ngay_chuyen_di} thành {ngay_chuyen_di}.",
                        id_nguoi_chinh_sua=current_user.id_nguoi_dung)
        db.session.add(log_ngay_chuyen_di)
    if ly_do_chuyen != household.ly_do_chuyen:
        log_ly_do_chuyen = LichSuHoKhau(id=str(uuid.uuid4().hex), id_ho_khau=id,
                        ngay_chinh_sua=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        thong_tin_chinh_sua=f"Hộ khẩu đã thay đổi lý do chuyển: Từ {household.ly_do_chuyen} thành {ly_do_chuyen}.",
                        id_nguoi_chinh_sua=current_user.id_nguoi_dung)
        db.session.add(log_ly_do_chuyen)
    if dien_tich != household.dien_tich:
        log_dien_tich = LichSuHoKhau(id=str(uuid.uuid4().hex), id_ho_khau=id,
                        ngay_chinh_sua=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        thong_tin_chinh_sua=f"Hộ khẩu đã thay đổi lý do chuyển: Từ {household.dien_tich} thành {dien_tich}.",
                        id_nguoi_chinh_sua=current_user.id_nguoi_dung)
        db.session.add(log_dien_tich)

    household_members = ThanhVienCuaHo.query.filter_by(id_ho_khau=id).all()
    for household_member in household_members:
        try:
            db.session.delete(household_member)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    if list_nhan_khau:
        for nhan_khau in list_nhan_khau:
            new_rela = ThanhVienCuaHo(id_nhan_khau=nhan_khau['id_nhan_khau'], 
                                        id_ho_khau=id, quan_he_voi_chu_ho=nhan_khau['quan_he_voi_chu_ho'])
            db.session.add(new_rela)

    household.ma_ho_khau = ma_ho_khau
    household.id_chu_ho = id_chu_ho
    household.ma_khu_vuc = ma_khu_vuc
    household.dia_chi = dia_chi
    household.ngay_lap = ngay_lap
    household.ngay_chuyen_di = ngay_chuyen_di
    household.ly_do_chuyen = ly_do_chuyen
    household.dien_tich = dien_tich
   
    try:
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Cập nhật hộ khẩu thành công!")

@api.route('/split_household/<id>/', methods=['PUT'])
@login_required
@roles_required('Cap nhat thong tin so ho khau')    #@roles_required('Cập nhật thông tin sổ hộ khẩu')
def split_household(id):
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinTachHoKhau().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    new_ma_ho_khau = args.get('new_ma_ho_khau')
    new_id_chu_ho = args.get('new_id_chu_ho') 
    new_ma_khu_vuc = args.get('new_ma_khu_vuc')
    new_dia_chi = args.get('new_dia_chi')
    new_ngay_lap = args.get('new_ngay_lap')
    new_ngay_chuyen_di = args.get('new_ngay_chuyen_di')
    new_ly_do_chuyen = args.get('new_ly_do_chuyen')
    new_list_nhan_khau = args.get('new_list_nhan_khau')

    new_id_ho_khau = str(uuid.uuid4().hex)

    #check existing record
    household = HoKhau.query.filter_by(id=id).first()
    if not household:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Hộ khẩu không tồn tại.")

    #check if new_chu_ho is in another household
    household_check = HoKhau.query.filter(HoKhau.id_chu_ho == new_id_chu_ho).first()
    if household_check:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chủ hộ mới đã đăng ký hộ khẩu.")

    #check existing ma_ho_khau
    household_check = HoKhau.query.filter(HoKhau.ma_ho_khau == new_ma_ho_khau).first()
    if household_check:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Mã hộ khẩu đã tồn tại.")
    
    #check existing household_member
    if new_list_nhan_khau:
        for nhan_khau in new_list_nhan_khau:
            if nhan_khau['id_nhan_khau'] == new_id_chu_ho or nhan_khau['id_nhan_khau'] == household.id_chu_ho:
                return return_response(code=HTTPStatus.BAD_REQUEST, msg="Thành viên trùng với chủ hộ.")
            household_member = NhanKhau.query.filter_by(ID=nhan_khau['id_nhan_khau']).first()
            if not household_member:
                return return_response(code=HTTPStatus.BAD_REQUEST, msg="Nhân khẩu đã chọn không tồn tại.")

    #update old ho_khau with members of new_ho_khau deleted
    household_member = ThanhVienCuaHo.query.filter_by(id_ho_khau=id, id_nhan_khau=new_id_chu_ho).first()
    if household_member:
        try:
            db.session.delete(household_member)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
    if new_list_nhan_khau:
        for nhan_khau in new_list_nhan_khau:
            household_member = ThanhVienCuaHo.query.filter_by(id_ho_khau=id, id_nhan_khau=nhan_khau['id_nhan_khau']).first()
            if household_member:
                try:
                    db.session.delete(household_member)
                    db.session.commit()
                except Exception as e:
                    print(str(e))
                    return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    #create new ho_khau
    id_nguoi_thuc_hien = current_user.id_nguoi_dung
    
    new_household = HoKhau(id=new_id_ho_khau, ma_ho_khau=new_ma_ho_khau, id_chu_ho=new_id_chu_ho, ma_khu_vuc=new_ma_khu_vuc, dia_chi=new_dia_chi,
                        ngay_lap=new_ngay_lap, ngay_chuyen_di=new_ngay_chuyen_di, ly_do_chuyen=new_ly_do_chuyen, id_nguoi_thuc_hien=id_nguoi_thuc_hien)
    
    try:
        db.session.add(new_household)
        for nhan_khau in new_list_nhan_khau:
            new_rela = ThanhVienCuaHo(id_nhan_khau=nhan_khau['id_nhan_khau'], 
                                    id_ho_khau=new_id_ho_khau, quan_he_voi_chu_ho=nhan_khau['quan_he_voi_chu_ho'])
            db.session.add(new_rela)
            db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
   
    try:
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    log = LichSuHoKhau(id=str(uuid.uuid4().hex), id_ho_khau=id,
                        ngay_chinh_sua=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        thong_tin_chinh_sua=f"Hộ khẩu đã được tách thành hộ khẩu mới với mã hộ khẩu là {new_ma_ho_khau}.",
                        id_nguoi_chinh_sua=current_user.id_nguoi_dung)
    try:
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Tách hộ khẩu thành công!")

@api.route('/delete_households/', methods=['POST'])
@login_required
@roles_required('Xoa ho khau')  #@roles_required('Xóa hộ khẩu')
def delete_households():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinXoa().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_list = args.get('id_list')

    #check valid list
    if not id_list:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn hộ khẩu để xóa.")

    return_message = []
    for id in id_list:
        household = HoKhau.query.filter_by(id=id).first()
        if not household:
            return_message.append("Hộ khẩu không tồn tại hoặc đã bị xóa.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id in id_list:
        household = HoKhau.query.filter_by(id=id).first()
        try:
            db.session.delete(household)
            member_list = ThanhVienCuaHo.query.filter_by(id_ho_khau=id)
            for member in member_list:
                db.session.delete(member)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa hộ khẩu thành công!")

@api.route('/get_household/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin so ho khau') #@roles_required('Xem thông tin sổ hộ khẩu')
def get_household(id):

    household = HoKhau.query.filter_by(id=id).first()
    if not household:
        return return_response(code=400, msg="Hộ khẩu không tồn tại hoặc đã bị xóa.")

    chu_ho = NhanKhau.query.filter_by(ID=household.id_chu_ho).first()
    if not chu_ho:
        return return_response(code=400, msg="Chủ hộ không tồn tại hoặc đã bị xóa.")

    members = []
    member_list = ThanhVienCuaHo.query.filter_by(id_ho_khau=id).all()
    for member in member_list:
        member_nk = NhanKhau.query.filter_by(ID=member.id_nhan_khau).first()
        if not member_nk:
            return return_response(code=400, msg="Nhân khẩu không tồn tại hoặc đã bị xóa.")
        members.append({
            'id_thanh_vien': member_nk.ID,
            'ten_thanh_vien': member_nk.ho_ten,
            'quan_he_voi_chu_ho': member.quan_he_voi_chu_ho
        })

    data = {
        'id': household.id,
        'ma_ho_khau': household.ma_ho_khau,
        'id_chu_ho': household.id_chu_ho,
        'ten_chu_ho': chu_ho.ho_ten,
        'ma_khu_vuc': household.ma_khu_vuc,
        'dia_chi': household.dia_chi,
        'ngay_lap': household.ngay_lap,
        'ngay_chuyen_di': household.ngay_chuyen_di,
        'ly_do_chuyen': household.ly_do_chuyen,
        'id_nguoi_thuc_hien': household.id_nguoi_thuc_hien,
        'thanh_vien_trong_ho': members
    }

    return return_response(data=data)

@api.route('/get_household_history/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin so ho khau')
def get_household_history(id):

    household = HoKhau.query.filter_by(id=id).first()
    if not household:
        return return_response(code=400, msg="Hộ khẩu không tồn tại hoặc đã bị xóa.")

    household_history = LichSuHoKhau.query.filter_by(id_ho_khau=id)
    data = []
    for history in household_history:
        data.append({
            'id': history.id,
            'id_ho_khau': history.id_ho_khau,
            'ngay_chinh_sua': history.ngay_chinh_sua.strftime("%Y-%m-%d %H:%M:%S"),
            'thong_tin_chinh_sua': history.thong_tin_chinh_sua,
            'id_nguoi_chinh_sua': history.id_nguoi_chinh_sua,
        })

    return return_response(data=data)

@api.route('/get_households/', methods=['GET'])
@login_required
@roles_required('Xem thong tin so ho khau')
def get_groups():

    households = HoKhau.query.all()
    data = []
    for household in households:
        chu_ho = NhanKhau.query.filter_by(ID=household.id_chu_ho).first()
        if not chu_ho:
            return return_response(code=400, msg="Chủ hộ không tồn tại hoặc đã bị xóa.")
        members = []
        member_list = ThanhVienCuaHo.query.filter_by(id_ho_khau=household.id).all()
        for member in member_list:
            member_nk = NhanKhau.query.filter_by(ID=member.id_nhan_khau).first()
            if not member_nk:
                return return_response(code=400, msg="Nhân khẩu không tồn tại hoặc đã bị xóa.")
            members.append({
                'id_thanh_vien': member_nk.ID,
                'ten_thanh_vien': member_nk.ho_ten,
                'quan_he_voi_chu_ho': member.quan_he_voi_chu_ho
            })
        data.append({
            'id': household.id,
            'ma_ho_khau': household.ma_ho_khau,
            'id_chu_ho': household.id_chu_ho,
            'ten_chu_ho': chu_ho.ho_ten,
            'ma_khu_vuc': household.ma_khu_vuc,
            'dia_chi': household.dia_chi,
            'ngay_lap': household.ngay_lap,
            'ngay_chuyen_di': household.ngay_chuyen_di,
            'ly_do_chuyen': household.ly_do_chuyen,
            'id_nguoi_thuc_hien': household.id_nguoi_thuc_hien,
            'thanh_vien_trong_ho': members
        })
    
    return return_response(data=data)
    