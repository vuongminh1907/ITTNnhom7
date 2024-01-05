from .decorators import roles_required
from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import BatBuoc,DanhSachBatBuoc, NhanKhau, HoKhau, KhoiDienNuoc,db
import uuid
from flask_login import login_required
from http import HTTPStatus
from sqlalchemy import func, case, column, and_
from datetime import date
import pandas as pd

api = Blueprint('danh_sach_bat_buoc',__name__,url_prefix='/danh_sach_bat_buoc')

@api.route('/create_bat_buoc/',methods=['POST'])
@login_required
@roles_required('Tao thong tin bat buoc')
def create_bat_buoc():
    try:
        args = request.get_json()
        res = schema.ThemPhiBatBuoc().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    tien_dich_vu = args.get('tien_dich_vu')
    tien_dien = args.get('tien_dien')
    tien_nuoc = args.get('tien_nuoc')
    tien_moi_truong = args.get('tien_moi_truong')
    tien_quan_ly = args.get('tien_quan_ly')
    tien_bao_tri = args.get('tien_bao_tri')
    tien_giu_xe_2 = args.get('tien_giu_xe_2')
    tien_giu_xe_4 = args.get('tien_giu_xe_4')
    month = args.get('month')
    year = args.get('year')
    mo_ta = args.get('mo_ta')

    bat_buoc = BatBuoc(tien_dich_vu= tien_dich_vu,tien_dien=tien_dien,tien_nuoc=tien_nuoc,tien_moi_truong=tien_moi_truong,tien_quan_ly=tien_quan_ly,tien_bao_tri=tien_bao_tri,tien_giu_xe_2=tien_giu_xe_2,tien_giu_xe_4=tien_giu_xe_4,month=month,year=year,mo_ta=mo_ta)

    try:
        db.session.add(bat_buoc)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500,msg="Có lỗi xảy ra. Vui lòng thử lại")
    
    return return_response(code=200,msg="Thêm khoản bắt buộc thành công")

@api.route('/upload_and_statistics_file_excel/',methods=['POST'])
@login_required
@roles_required('Tao thong tin bat buoc')
def upload_file_excel():
    try:
        args = request.get_json()
        res = schema.ThemLinkExcel().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY,msg=(str(e)))

    link_excel = args.get('link_excel')
    print(link_excel)
    #link_excel = 'D:\Minh.data\ITTN\Công nghệ phần mềm\Sổ-làm-việc1.xlsx'
    if link_excel is None:
        return return_response(code=HTTPStatus.BAD_REQUEST,msg="Chưa thêm link_excel để đọc.")
    
    try:
        df = pd.read_excel(link_excel)
        print(df.head())
        for _, row in df.iterrows():
            entry = KhoiDienNuoc(
                ma_ho_khau=row['ma_ho_khau'],
                khoi_dien=row['khoi_dien'],
                khoi_nuoc=row['khoi_nuoc'],
                thang = row['thang'],
                nam = row['nam']
            )
            db.session.add(entry)
        db.session.commit()
        print("Cập nhật thành công")
    except Exception as e:
        print(str(e))
        return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra.")
    
    for _,row in df.iterrows():
        ma_ho_khau = row['ma_ho_khau']
        thang = row['thang']
        nam = row['nam']
        #ma_ho_khau = column('ma_ho_khau')
        #thang = column('thang')
        #nam = column('nam')
        entry_ = KhoiDienNuoc.query.filter_by(ma_ho_khau= ma_ho_khau, thang= thang,nam= nam).first()
        household = HoKhau.query.filter_by(ma_ho_khau= ma_ho_khau).first()
        bat_buoc = BatBuoc.query.filter_by(month= thang, year= nam).first()
        if household.dien_tich > 100:
            tong_tien_dich_vu = bat_buoc.tien_dich_vu* household.dien_tich * 1.5
            tong_tien_moi_truong = bat_buoc.tien_moi_truong * household.dien_tich * 1.5
            tong_tien_quan_ly = bat_buoc.tien_quan_ly * household.dien_tich * 1.5
            tong_tien_bao_tri = bat_buoc.tien_bao_tri * household.dien_tich * 1.5
        else:
            tong_tien_dich_vu = bat_buoc.tien_dich_vu * household.dien_tich
            tong_tien_moi_truong = bat_buoc.tien_moi_truong * household.dien_tich
            tong_tien_quan_ly = bat_buoc.tien_quan_ly * household.dien_tich
            tong_tien_bao_tri = bat_buoc.tien_bao_tri * household.dien_tich
        tien_xe_may = bat_buoc.tien_giu_xe_2 * household.xe_may
        tien_o_to = bat_buoc.tien_giu_xe_4 * household.o_to
        tong_tien_dien = entry_.khoi_dien * bat_buoc.tien_dien
        tong_tien_nuoc = entry_.khoi_nuoc * bat_buoc.tien_nuoc
        id = uuid.uuid4().hex
        entry__ = DanhSachBatBuoc(
            id=id,
            ma_ho_khau= ma_ho_khau,
            so_tien=(
                tong_tien_dich_vu +
                tong_tien_dien + 
                tong_tien_nuoc + 
                tong_tien_moi_truong + 
                tong_tien_quan_ly + 
                tong_tien_bao_tri + 
                tien_xe_may + 
                tien_o_to
            ),
            thang= thang,
            nam= nam
        )
        db.session.add(entry__)
        db.session.commit()
    return return_response(msg="Ghi dữ liệu từ file và tính toán thành công.")

    
@api.route('/search_month_year/',methods=['POST'])
@login_required
@roles_required('Tao thong tin bat buoc')
def search_month_year():
    data = []
    try:
        args = request.get_json()
        res = schema.SearchMonthYear().load(args)
        nam = args.get('nam')
        thang = args.get('thang')
    except ValueError as e:
        return return_response(code=400, msg="Tham số đầu vào sai định dạng.")
    print(nam)
    danh_sach_bat_buocs = [] 
    if nam is not None and thang is not None:
        danh_sach_bat_buocs = DanhSachBatBuoc.query.filter_by(thang=thang, nam=nam).all()
    elif nam is not None:
        danh_sach_bat_buocs = DanhSachBatBuoc.query.filter_by(nam=nam).all()
    elif thang is not None:
        danh_sach_bat_buocs = DanhSachBatBuoc.query.filter_by(thang=thang).all()

    for danh_sach_bat_buoc in danh_sach_bat_buocs:
        household = HoKhau.query.filter_by(ma_ho_khau=danh_sach_bat_buoc.ma_ho_khau).first()
        chu_ho = NhanKhau.query.filter_by(ID=household.id_chu_ho).first()
        data.append({
            'id' : household.id,
            'ma_ho_khau': household.ma_ho_khau,
            'ten_chu_ho': chu_ho.ho_ten,
            'so_tien_con_thieu': danh_sach_bat_buoc.so_tien - danh_sach_bat_buoc.so_tien_da_dong,
            'so_tien': danh_sach_bat_buoc.so_tien,
            'thang': danh_sach_bat_buoc.thang,
            'nam': danh_sach_bat_buoc.nam
        })

    return return_response(data=data)

@api.route('/get_danh_sachs/',methods=['GET'])
@login_required
@roles_required('Tao thong tin bat buoc')
def get_danh_sachs():
    danh_sach_bat_buocs = DanhSachBatBuoc.query.all()
    #print(danh_sach_bat_buocs)
    if not danh_sach_bat_buocs:
        return return_response(code=500, msg="Chưa có dữ liệu để hiển thị.")
    else:
        data = []
        for danh_sach_bat_buoc in danh_sach_bat_buocs:
            #print(danh_sach_bat_buoc.ma_ho_khau)
            household = HoKhau.query.filter_by(ma_ho_khau= danh_sach_bat_buoc.ma_ho_khau).first()
            if not household:
                return return_response(code=HTTPStatus.BAD_REQUEST,msg="Hộ khẩu không tồn tại.")
            chu_ho = NhanKhau.query.filter_by(ID= household.id_chu_ho).first()
            data.append({
                'ma_ho_khau' : danh_sach_bat_buoc.ma_ho_khau,
                'ten_chu_ho' : chu_ho.ho_ten,
                'so_tien_con_thieu' : danh_sach_bat_buoc.so_tien - danh_sach_bat_buoc.so_tien_da_dong,
                'so_tien' : danh_sach_bat_buoc.so_tien,
                'thang' : danh_sach_bat_buoc.thang,
                'nam' : danh_sach_bat_buoc.nam
            })
    return return_response(data= data)


@api.route('/get_danh_sach/<ma_ho_khau>/<thang>/<nam>/',methods=['GET'])
@login_required
@roles_required('Tao thong tin bat buoc')
def get_household(ma_ho_khau,thang,nam):
    print(ma_ho_khau)
    print(thang)
    print(nam)
    print("hihihihihihiihi")
    bat_buoc = BatBuoc.query.filter_by(month= thang, year= nam).first()
    household = HoKhau.query.filter_by(ma_ho_khau = ma_ho_khau).first()
    chu_ho = NhanKhau.query.filter_by(ID= household.id_chu_ho).first()
    entry_ = KhoiDienNuoc.query.filter_by(ma_ho_khau= ma_ho_khau, thang= thang,nam= nam).first()
    data = []
    if household.dien_tich > 100:
        tong_tien_dich_vu = bat_buoc.tien_dich_vu* household.dien_tich * 1.5
        tong_tien_moi_truong = bat_buoc.tien_moi_truong * household.dien_tich * 1.5
        tong_tien_quan_ly = bat_buoc.tien_quan_ly * household.dien_tich * 1.5
        tong_tien_bao_tri = bat_buoc.tien_bao_tri * household.dien_tich * 1.5
    else:
        tong_tien_dich_vu = bat_buoc.tien_dich_vu * household.dien_tich
        tong_tien_moi_truong = bat_buoc.tien_moi_truong * household.dien_tich
        tong_tien_quan_ly = bat_buoc.tien_quan_ly * household.dien_tich
        tong_tien_bao_tri = bat_buoc.tien_bao_tri * household.dien_tich
    tien_xe_may = bat_buoc.tien_giu_xe_2 * household.xe_may
    tien_o_to = bat_buoc.tien_giu_xe_4 * household.o_to
    tong_tien_dien = entry_.khoi_dien * bat_buoc.tien_dien
    tong_tien_nuoc = entry_.khoi_nuoc * bat_buoc.tien_nuoc
    data.append({
        'ma_ho_khau' : ma_ho_khau,
        'ten_chu_ho' : chu_ho.ho_ten,
        'thang' : thang,
        'nam' : nam,
        'tien_dich_vu' : tong_tien_dich_vu,
        'tien_moi_truong' : tong_tien_moi_truong,
        'tien_quan_ly' : tong_tien_quan_ly,
        'tien_bao_tri' : tong_tien_bao_tri,
        'tien_xe_may' : tien_xe_may,
        'tien_o_to' : tien_o_to,
        'tien_dien' : tong_tien_dien,
        'tien_nuoc' : tong_tien_nuoc
    })

    return return_response(data=data)
@api.route('/update_bat_buoc/<ma_ho_khau>/<thang>/<nam>/',methods=['PUT'])
@login_required
@roles_required('Tao thong tin bat buoc')
def update_bat_buoc(ma_ho_khau,thang,nam):
    try:
        args = request.get_json()
        res = schema.NopTienBatBuoc().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    so_tien_da_dong = args.get('so_tien_da_dong')
    so_tien_da_dong = float(so_tien_da_dong)
    ngay_dong = args.get('ngay_dong')
    danh_sach_bat_buoc = DanhSachBatBuoc.query.filter_by(ma_ho_khau= ma_ho_khau,thang= thang,nam= nam).first()
    household = HoKhau.query.filter_by(ma_ho_khau = danh_sach_bat_buoc.ma_ho_khau).first()
    if not household:
        return return_response(code=500, msg="Hộ khẩu không tồn tại hoặc đã bị xóa.")
    danh_sach_bat_buoc.so_tien_da_dong += so_tien_da_dong
    danh_sach_bat_buoc.ngay_dong = ngay_dong
    try:
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500,msg="Có lỗi xảy ra. Vui lòng thử lại")
    
    return return_response(code=200,msg="Cập nhật thành công")