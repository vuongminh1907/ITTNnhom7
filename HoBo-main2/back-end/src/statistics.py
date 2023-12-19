from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import HoKhau, NhanKhau, TamTru, TamVang
from flask_login import login_required
from http import HTTPStatus
from .decorators import roles_required
from sqlalchemy import or_, and_

api = Blueprint('statistics', __name__, url_prefix='/statistics')

@api.route('/dashboard/', methods=['GET'])
@login_required
@roles_required('Xem thong tin nhan khau')
def get_dashboard():
    data = {}
    list_id_nhan_khau = []

    #count nhan_khau
    nhan_khaus = NhanKhau.query.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời'))).all()
    data['nhan_khau'] = len(nhan_khaus)

    for i in nhan_khaus:
        list_id_nhan_khau.append(i.ID)

    #count ho_khau
    ho_khaus = HoKhau.query.all()
    data['ho_khau'] = len(ho_khaus)

    #count tam_tru
    tam_trus = TamTru.query.filter(TamTru.id_nhan_khau.in_(list_id_nhan_khau)).all()
    data['tam_tru'] = len(tam_trus)

    #count tam_vang
    tam_vangs = TamVang.query.filter(TamVang.id_nhan_khau.in_(list_id_nhan_khau)).all()
    data['tam_vang'] = len(tam_vangs)

    return return_response(data=data)

@api.route('/thong_ke_nhan_khau/', methods=['POST'])
@login_required
@roles_required('Xem thong tin nhan khau')
def thong_ke_nhan_khau():
    """
        Mẫu input:
        {
            "gioi_tinh": string (nam / nu / toan_bo) (Nếu không có trường này thì auto toàn bộ) (Không có thì để null)
            "do_tuoi": string (mam_non / mau_giao / cap_1 / cap_2 / cap_3 / do_tuoi_lao_dong / nghi_huu / toan_bo) (Nếu không có trường này thì auto toàn bộ) (Không có thì để null)
            "tuoi": {
                "start": number,
                "end": number
            } (Tuổi bắt đầu và tuổi kết thúc) (Không có thì để null)
            "tinh_trang": string (toan_bo / dang_sinh_song / tam_vang / tam_tru) (Không có thì để null)
            "thoi_gian": {
                "start": date,
                "end": date
            } (Thời gian để xét tình trạng đang tạm trú / tạm vắng) (Tính theo năm) (Không có thì để null)
        }
    """
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinThongKeNhanKhau().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    gioi_tinh = args.get('gioi_tinh') if args.get('gioi_tinh') else None
    do_tuoi = args.get('do_tuoi') if args.get('do_tuoi') else None
    tuoi = args.get('tuoi') if args.get('tuoi') else None
    tinh_trang = args.get('tinh_trang') if args.get('tinh_trang') else None
    thoi_gian = args.get('thoi_gian') if args.get('thoi_gian') else None

    query = NhanKhau.query.filter(or_(NhanKhau.ghi_chu == None,
                                    and_(NhanKhau.ghi_chu != None, NhanKhau.ghi_chu != 'Đã qua đời')))
    # query = NhanKhau.query.filter(NhanKhau.ghi_chu == None)
    print(query.all())
    query_tam_tru = TamTru.query
    query_tam_vang = TamVang.query

    if thoi_gian:
        query_tam_tru = query_tam_tru.filter(or_(or_(and_(TamTru.tu_ngay <= thoi_gian['end'], TamTru.tu_ngay >= thoi_gian['start']),
                                                and_(TamTru.den_ngay <= thoi_gian['end'], TamTru.den_ngay >= thoi_gian['start'])),
                                                or_(and_(TamTru.tu_ngay <= thoi_gian['start'], TamTru.den_ngay >= thoi_gian['end']),
                                                and_(TamTru.den_ngay <= thoi_gian['end'], TamTru.tu_ngay >= thoi_gian['start']))))
        query_tam_vang = query_tam_vang.filter(or_(or_(and_(TamVang.tu_ngay <= thoi_gian['end'], TamVang.tu_ngay >= thoi_gian['start']),
                                                and_(TamVang.den_ngay <= thoi_gian['end'], TamVang.den_ngay >= thoi_gian['start'])),
                                                or_(and_(TamVang.tu_ngay <= thoi_gian['start'], TamVang.den_ngay >= thoi_gian['end']),
                                                and_(TamVang.den_ngay <= thoi_gian['end'], TamVang.tu_ngay >= thoi_gian['start']))))
    tam_trus = query_tam_tru.all()
    tam_trus_id = []
    for tam_tru in tam_trus:
        if tam_tru.id_nhan_khau not in tam_trus_id:
            tam_trus_id.append(tam_tru.id_nhan_khau)
    tam_vangs = query_tam_vang.all()
    tam_vangs_id = []
    for tam_vang in tam_vangs:
        if tam_vang.id_nhan_khau not in tam_vangs_id:
            tam_vangs_id.append(tam_vang.id_nhan_khau)
    #query giới tính
    if gioi_tinh:
        if gioi_tinh == 'toan_bo':
            pass
        elif gioi_tinh == 'nam':
            query = query.filter(NhanKhau.gioi_tinh == 'Nam')
        elif gioi_tinh == 'nu':
            query = query.filter(NhanKhau.gioi_tinh == 'Nữ')
    """
        Mầm non: 3 tháng - 3t
        Mẫu giáo: 3t - 6t
        Cấp 1: 6t - 11t
        Cấp 2: 11t - 15t
        Cấp 3: 15t - 18t
        Độ tuổi lao động: 
            Nam: 15t - 60t 9 tháng
            Nữ: 15t - 56t
    """
    if do_tuoi:
        if do_tuoi == 'mam_non':
            query = query.filter(NhanKhau.age_month >= 3, NhanKhau.age_month <= 3*12)
        elif do_tuoi == 'mau_giao':
            query = query.filter(NhanKhau.age_month >= 3*12, NhanKhau.age_month <= 6*12)
        elif do_tuoi == 'cap_1':
            query = query.filter(NhanKhau.age_month >= 6*12, NhanKhau.age_month <= 11*12)
        elif do_tuoi == 'cap_2':
            query = query.filter(NhanKhau.age_month >= 11*12, NhanKhau.age_month <= 15*12)
        elif do_tuoi == 'cap_3':
            query = query.filter(NhanKhau.age_month >= 15*12, NhanKhau.age_month <= 18*12)
        elif do_tuoi == 'do_tuoi_lao_dong':
            query = query.filter(or_(and_(NhanKhau.age_month >= 15*12, NhanKhau.age_month <= 60*12 + 9, NhanKhau.gioi_tinh == 'Nam'),
                                and_(NhanKhau.age_month >= 15*12, NhanKhau.age_month <= 56*12, NhanKhau.gioi_tinh == 'Nữ')))  
        elif do_tuoi == 'nghi_huu':
            query = query.filter(or_(and_(NhanKhau.age_month >= 60*12 + 9, NhanKhau.gioi_tinh == 'Nam'),
                                and_(NhanKhau.age_month >= 56*12, NhanKhau.gioi_tinh == 'Nữ')))  
    if tuoi:
        query = query.filter(NhanKhau.age_year >= tuoi['start'], NhanKhau.age_year <= tuoi['end'])
    if tinh_trang:
        if tinh_trang == 'tam_tru':
            query = query.filter(NhanKhau.ID.in_(tam_trus_id))
        elif tinh_trang == 'tam_vang':
            query = query.filter(NhanKhau.ID.in_(tam_vangs_id))
        elif tinh_trang == 'dang_sinh_song':
            query = query.filter(NhanKhau.ID.not_in(tam_vangs_id))
    
    household_members = query.all()
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
    return return_response(data=data)