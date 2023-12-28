from .decorators import roles_required
from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import DongGop,DanhSachDongGop, NhanKhau, HoKhau, db
import uuid
from flask_login import login_required
from http import HTTPStatus
from sqlalchemy import func
from datetime import date

api = Blueprint('danh_sach_dong_gop',__name__,url_prefix='/danh_sach_dong_gop')

@api.route('/get_households/', methods=['GET'])
@login_required
@roles_required('Xem ho khau dong gop')
def get_groups():

    households = HoKhau.query.all()
    data = []
    tong_so_tien = (
        db.session.query(
        DanhSachDongGop.ma_ho_khau,
        func.sum(DanhSachDongGop.so_tien).label('tong_so_tien')
        ).group_by(DanhSachDongGop.ma_ho_khau).all()
    )

    # Tạo từ điển ánh xạ mã hộ khẩu với tổng tiền
    tong_so_tien_dict = {ma_ho_khau: tong_so_tien for ma_ho_khau, tong_so_tien in tong_so_tien}
    for household in households:
        chu_ho = NhanKhau.query.filter_by(ID=household.id_chu_ho).first()
        if not chu_ho:
            return return_response(code=400, msg="Chủ hộ không tồn tại hoặc đã bị xóa.")
        so_tien = tong_so_tien_dict.get(household.ma_ho_khau)
        data.append({
            'id': household.id,
            'ma_ho_khau': household.ma_ho_khau,
            'id_chu_ho': household.id_chu_ho,
            'ten_chu_ho': chu_ho.ho_ten,
            'so_tien': so_tien
        })
    
    return return_response(data=data)
#xem chi tiết từng khoản đóng góp là gì
@api.route('/get_fee_household/<id>/',methods = ['GET'])
@login_required
@roles_required('Xem dong gop ho khau')
def get_fee_household(id):
    household = HoKhau.query.filter_by(id=id).first()

    if not household:
        return return_response(code=500, msg="Hộ khẩu không tồn tại hoặc đã bị xóa.")
    
    dong_gops = household.danh_sach_dong_gop
    fees = []
    default_fee_types = DongGop.query.all()
    for default_fee_type in default_fee_types:
        fee_data = {
            'ma_dong_gop': default_fee_type.ma_dong_gop,
            'ten_dong_gop': default_fee_type.ten_dong_gop,
            'so_tien': 0,  # Số tiền mặc định là 0
            'ngay_ung_ho': None  # Bạn có thể điền vào ngày nếu có sẵn
        }

    # Nếu có ít nhất một khoản đóng góp trong danh sách đã đóng, cập nhật số tiền tương ứng
        for dong_gop_ in dong_gops:
            if dong_gop_.ma_dong_gop == default_fee_type.ma_dong_gop:
                fee_data['so_tien'] = dong_gop_.so_tien
                fee_data['ngay_ung_ho'] = dong_gop_.ngay_ung_ho

        fees.append(fee_data)

    print(fees)
    chu_ho = NhanKhau.query.filter_by(ID= household.id_chu_ho).first()
    data = {
        'ma_ho_khau' : household.ma_ho_khau,
        'ten_chu_ho' : chu_ho.ho_ten,
        'list_dong_gop' : fees
    }
    return return_response(data=data)
@api.route('/update_fee_household/<id>/',methods = ['PUT'])
@login_required
@roles_required('Cap nhat dong gop ho khau')
def update_fee_household(id):
    try:
        args = request.get_json()
        res = schema.DongGop().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY,msg=str(e))
    
    so_tien = args.get('so_tien')
    ma_dong_gop = args.get('ma_dong_gop')
    #ngay_ung_ho = args.get('ngay_ung_ho')
    household = HoKhau.query.filter_by(id=id).first()
    if not household:
        return return_response(code=500, msg="Hộ khẩu không tồn tại hoặc đã bị xóa.")
    dong_gop = DanhSachDongGop.query.filter_by(ma_dong_gop=ma_dong_gop, ma_ho_khau=household.ma_ho_khau).first()

    id_dong_gop = str(uuid.uuid4().hex)
    if dong_gop:
        dong_gop.so_tien += so_tien
    else:
        ngay_ung_ho = date.today()
        new_dong_gop = DanhSachDongGop(id_dong_gop=id_dong_gop,ma_dong_gop=ma_dong_gop,ma_ho_khau=household.ma_ho_khau,ngay_ung_ho=ngay_ung_ho, so_tien=so_tien)
        db.session.add(new_dong_gop)
    
    try:
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500,msg="Có lỗi xảy ra. Vui lòng thử lại")
            
    return return_response(code=200,msg="Cập nhật thành công")


@api.route('/delete_fee_household/<id>/', methods=['POST'])
@login_required
@roles_required('Xem thong tin ho khau dong gop') 
def get_household(id):
    try:
        args = request.get_json()
        res = schema.XoaDongGop().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY,msg=str(e))
    
    household = HoKhau.query.filter_by(id=id).first()
    if not household:
        return return_response(code=400, msg="Hộ khẩu không tồn tại hoặc đã bị xóa.")
    
    list_ma_dong_gop = args.get('ma_list')

    for ma_dong_gop in list_ma_dong_gop:
        if not ma_dong_gop:
            return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn đóng góp để xóa.")

    for ma in list_ma_dong_gop:
        dong_gop = DanhSachDongGop.query.filter_by(ma_dong_gop=ma, ma_ho_khau= household.ma_ho_khau).first()
        try:
            db.session.delete(dong_gop)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
        
    return return_response(msg="Xóa đóng góp thành công!")