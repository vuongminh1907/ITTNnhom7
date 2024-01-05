from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import db, NhanKhau, GiaDinhVanHoa, HoKhau,DanhSachDongGop, DanhSachBatBuoc
from http import HTTPStatus
from .decorators import roles_required
from flask_login import login_required

api = Blueprint('danh_gia_gia_dinh_van_hoa', __name__, url_prefix='/danh_gia')

@api.route('/them_danh_gia/', methods = ['POST'])
@login_required
@roles_required('Them danh gia gia dinh tieu bieu')   #@roles_required('Thêm đánh giá gia đình văn hóa')
def them_danh_gia():
    try:
        args = request.get_json()
        res = schema.ThemDanhGia().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    
    danh_sach_ma_ho_khau = args.get('danh_sach_ma_ho_khau')
    nam_danh_gia = args.get('nam_danh_gia')
    
    if not danh_sach_ma_ho_khau:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn gia đình để đánh giá.")

    return_message = []
    for id_ho_khau in danh_sach_ma_ho_khau:
        ho_khau = HoKhau.query.filter_by(id = id_ho_khau).first()
        if not ho_khau:
            return_message.append("Hộ khẩu không tồn tại")

    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)
    
    return_message = []
    for id_ho_khau in danh_sach_ma_ho_khau:
        ho_khau = HoKhau.query.filter_by(id = id_ho_khau).first()
        danh_sach_dong_gop = DanhSachDongGop.query.filter_by(ma_ho_khau= ho_khau.ma_ho_khau).all()
        danh_sach_bat_buoc = DanhSachBatBuoc.query.filter_by(ma_ho_khau= ho_khau.ma_ho_khau).all()
        # danh_sach_id_thanh_vien.append(ho_khau.id_chu_ho)
        # soLanThamDu = DanhSachThamDu.query.filter_by(id_nhan_khau = ho_khau.id_chu_ho).count()
        # soLanDuocMoi = MoiHop.query.filter_by(id_nhan_khau = ho_khau.id_chu_ho).count()
        
        # for thanh_vien in danh_sach_id_thanh_vien:
        #     soLanThamDu += DanhSachThamDu.query.filter_by(id_nhan_khau = thanh_vien.id_nhan_khau).count()
        #     soLanDuocMoi += MoiHop.query.filter_by(id_nhan_khau = thanh_vien.id_nhan_khau).count()
        so_tien_dong_gop = 0
        for dong_gop in danh_sach_dong_gop:
            if dong_gop.ngay_ung_ho.year == nam_danh_gia:
                so_tien_dong_gop += dong_gop.so_tien 
        
        dong_tien_dung_han = 0
        for bat_buoc in danh_sach_bat_buoc:
            if bat_buoc and bat_buoc.ngay_dong:
                if bat_buoc.ngay_dong.month == bat_buoc.thang + 1:
                    dong_tien_dung_han += 1
        danh_gia = GiaDinhVanHoa.query.filter_by(ma_ho_khau = id_ho_khau).filter_by(nam_danh_gia = nam_danh_gia).first()
        if not danh_gia:
            gd = GiaDinhVanHoa(ma_ho_khau=id_ho_khau, nam_danh_gia = nam_danh_gia, so_tien_dong_gop = so_tien_dong_gop, so_lan_dong_tien_dung_han = dong_tien_dung_han)    
            try:
                db.session.add(gd)
                db.session.commit()
            except Exception as e:
                print(str(e))
                return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
        else:
            danh_gia.so_tien_dong_gop = so_tien_dong_gop
            danh_gia.so_lan_dong_tien_dung_han = dong_tien_dung_han
            danh_gia.nam_danh_gia = nam_danh_gia
            try:
                db.session.commit()
            except Exception as e:
                print(str(e))
                return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
    return return_response(code=200, msg="Thêm đánh giá thành công!")


# xem đánh giá
@api.route('/xem_danh_gia/<id>/', methods=['GET'])
@login_required
@roles_required('Xem danh gia gia dinh tieu bieu')    #@roles_required('Xem đánh giá gia đình văn hóa')
def xem_danh_gia(id):

    ho_khau = HoKhau.query.filter_by(id=id).first()
    bang_danh_gia = GiaDinhVanHoa.query.filter_by(ma_ho_khau = id).all()
    #print(len(bang_danh_gia))

    if not ho_khau:
        return return_response(code=400, msg="Hộ khẩu không tồn tại.")
    
    if not bang_danh_gia:
        return return_response(code=400, msg="Hộ khẩu chưa được đánh giá.")
    
    check = ""
    
    chu_ho = NhanKhau.query.filter_by(ID = ho_khau.id_chu_ho).first()
    data = {
        "info": {
            "ten_chu_ho": chu_ho.ho_ten,
            "dia_chi" : ho_khau.dia_chi,
            "ma_ho_khau" : ho_khau.ma_ho_khau
        },
        "list": []
    }
    for theo_nam in bang_danh_gia:
        so_thang = db.session.query(DanhSachBatBuoc).filter_by(ma_ho_khau=ho_khau.ma_ho_khau, nam=theo_nam.nam_danh_gia).count()
        print(so_thang)
        print(theo_nam.so_lan_dong_tien_dung_han)
        print("hihihihohi")  
        if theo_nam.so_lan_dong_tien_dung_han != 0:  
            if theo_nam.so_tien_dong_gop > 3000 and theo_nam.so_lan_dong_tien_dung_han == so_thang:
                check = "Gia đình này đạt đủ điều kiện gia đình tiêu biểu"
                data["list"].append({
                "id_ho_khau" : id,
                "so_tien_dong_gop" : theo_nam.so_tien_dong_gop,
                "so_lan_dong_tien_dung_han" : theo_nam.so_lan_dong_tien_dung_han,
                "nam_danh_gia" : theo_nam.nam_danh_gia,
                "gia_dinh_van_hoa" : check
            })
                
            else:
                check = "Gia đình này chưa đạt đủ điều kiện gia đình tiêu biểu"
                
                data["list"].append({
                "id_ho_khau" : id,
                "so_tien_dong_gop" : theo_nam.so_tien_dong_gop,
                "so_lan_dong_tien_dung_han" : theo_nam.so_lan_dong_tien_dung_han,
                "nam_danh_gia" : theo_nam.nam_danh_gia,
                "gia_dinh_van_hoa" : check
            })
        elif theo_nam.so_lan_dong_tien_dung_han == 0 and so_thang >= 2:
            check = "Gia đình này chưa đạt đủ điều kiện gia đình tiêu biểu"
            
            data["list"].append({
                "id_ho_khau" : id,
                "so_tien_dong_gop" : theo_nam.so_tien_dong_gop,
                "so_lan_dong_tien_dung_han" : theo_nam.so_lan_dong_tien_dung_han,
                "nam_danh_gia" : theo_nam.nam_danh_gia,
                "gia_dinh_van_hoa" : check
            })
        else:
            check = "Không đủ thông tin để đánh giá"
            
            data["list"].append({
                "id_ho_khau" : id,
                "so_tien_dong_gop" : theo_nam.so_tien_dong_gop,
                "so_lan_dong_tien_dung_han" : theo_nam.so_lan_dong_tien_dung_han,
                "nam_danh_gia" : theo_nam.nam_danh_gia,
                "gia_dinh_van_hoa" : check
            })
        
    # print(float(bang_danh_gia.so_cuoc_hop_tham_du) / float(bang_danh_gia.so_cuoc_hop_duoc_moi))
    return return_response(data=data, msg="Xem đánh giá thành công!")



# xem đánh giá tất cả
@api.route('/xem_danh_gia_all/', methods=['GET'])
@login_required
@roles_required('Xem danh gia gia dinh tieu bieu')
def xem_danh_gia_all():

    danh_sach_ho_khau = HoKhau.query.all()
    print(len(danh_sach_ho_khau))
    data = []
    for ho_khau in danh_sach_ho_khau:
        cac_nam = []
        chu_ho = NhanKhau.query.filter_by(ID = ho_khau.id_chu_ho).first()
        bang_danh_gia = GiaDinhVanHoa.query.filter_by(ma_ho_khau = ho_khau.id).all()
        if len(bang_danh_gia) == 0 :
            data.append({
                "id_ho_khau" : ho_khau.id,
                "ma_ho_khau" : ho_khau.ma_ho_khau,
                "ten_chu_ho" : chu_ho.ho_ten,
                "cac_nam_da_danh_gia" : cac_nam
            })
        else:
            for danh_gia in bang_danh_gia:
                cac_nam.append(danh_gia.nam_danh_gia)
            data.append({
                    "id_ho_khau" : ho_khau.id,
                    "ma_ho_khau" : ho_khau.ma_ho_khau,
                    "ten_chu_ho" : chu_ho.ho_ten,
                    "cac_nam_da_danh_gia" : cac_nam,
                    "dia_chi" : ho_khau.dia_chi
                })
        
        
    # print(float(bang_danh_gia.so_cuoc_hop_tham_du) / float(bang_danh_gia.so_cuoc_hop_duoc_moi))
    return return_response(data=data, msg="Xem đánh giá thành công!")