from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import db, NhanKhau, MoiHop, DanhSachThamDu, GiaDinhVanHoa, HoKhau,ThanhVienCuaHo
from http import HTTPStatus
from .decorators import roles_required
from flask_login import login_required

api = Blueprint('danh_gia_gia_dinh_van_hoa', __name__, url_prefix='/danh_gia')

@api.route('/them_danh_gia/', methods = ['POST'])
@login_required
@roles_required('Them danh gia gia dinh van hoa')   #@roles_required('Thêm đánh giá gia đình văn hóa')
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
        danh_sach_id_thanh_vien = ThanhVienCuaHo.query.filter_by(id_ho_khau = id_ho_khau).all()
        ho_khau = HoKhau.query.filter_by(id = id_ho_khau).first()
        # danh_sach_id_thanh_vien.append(ho_khau.id_chu_ho)
        # soLanThamDu = DanhSachThamDu.query.filter_by(id_nhan_khau = ho_khau.id_chu_ho).count()
        # soLanDuocMoi = MoiHop.query.filter_by(id_nhan_khau = ho_khau.id_chu_ho).count()
        
        # for thanh_vien in danh_sach_id_thanh_vien:
        #     soLanThamDu += DanhSachThamDu.query.filter_by(id_nhan_khau = thanh_vien.id_nhan_khau).count()
        #     soLanDuocMoi += MoiHop.query.filter_by(id_nhan_khau = thanh_vien.id_nhan_khau).count()
        soLanThamDu = 0
        soLanDuocMoi = 0
        tham_du = DanhSachThamDu.query.filter_by(id_nhan_khau = ho_khau.id_chu_ho).all()
        for t in tham_du:
            if t.cuoc_hop.thoi_gian.year == nam_danh_gia:
                soLanThamDu += 1

        duoc_moi = MoiHop.query.filter_by(id_nhan_khau = ho_khau.id_chu_ho).all()
        for t in duoc_moi:
            if t.cuoc_hop.thoi_gian.year == nam_danh_gia:
                soLanDuocMoi += 1

        for thanh_vien in danh_sach_id_thanh_vien:
            thanh_vien_td = DanhSachThamDu.query.filter_by(id_nhan_khau = thanh_vien.id_nhan_khau).all()
            for t in thanh_vien_td:
                if t.cuoc_hop.thoi_gian.year == nam_danh_gia:
                    soLanThamDu += 1

            thanh_vien_dm = MoiHop.query.filter_by(id_nhan_khau = thanh_vien.id_nhan_khau).all()
            for t in thanh_vien_dm:
                if t.cuoc_hop.thoi_gian.year == nam_danh_gia:
                    soLanDuocMoi += 1
        danh_gia = GiaDinhVanHoa.query.filter_by(ma_ho_khau = id_ho_khau).filter_by(nam_danh_gia = nam_danh_gia).first()
        if not danh_gia:
            gd = GiaDinhVanHoa(ma_ho_khau=id_ho_khau, so_cuoc_hop_tham_du=soLanThamDu, so_cuoc_hop_duoc_moi=soLanDuocMoi, nam_danh_gia = nam_danh_gia)    
            try:
                db.session.add(gd)
                db.session.commit()
            except Exception as e:
                print(str(e))
                return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
        else:
            danh_gia.so_cuoc_hop_tham_du = soLanThamDu
            danh_gia.so_cuoc_hop_duoc_moi = soLanDuocMoi
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
@roles_required('Xem danh gia gia dinh van hoa')    #@roles_required('Xem đánh giá gia đình văn hóa')
def xem_danh_gia(id):

    ho_khau = HoKhau.query.filter_by(id=id).first()
    bang_danh_gia = GiaDinhVanHoa.query.filter_by(ma_ho_khau = id).all()
    print(len(bang_danh_gia))

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
        if theo_nam.so_cuoc_hop_duoc_moi != 0:
            if float(theo_nam.so_cuoc_hop_tham_du) / float(theo_nam.so_cuoc_hop_duoc_moi) >= 0.5:
                check = "Gia đình này đạt đủ điều kiện gia đình văn hóa"
            else:
                check = "Gia đình này chưa đạt đủ điều kiện gia đình văn hóa"
            data["list"].append({
                "id_ho_khau" : id,
                "so_lan_tham_du" : theo_nam.so_cuoc_hop_tham_du,
                "so_lan_duoc_moi" : theo_nam.so_cuoc_hop_duoc_moi,
                "nam_danh_gia" : theo_nam.nam_danh_gia,
                "gia_dinh_van_hoa" : check
            })
        else:
            check = "Không đủ thông tin để đánh giá"
            data["list"].append({
                "id_ho_khau" : id,
                "so_lan_tham_du" : theo_nam.so_cuoc_hop_tham_du,
                "so_lan_duoc_moi" : theo_nam.so_cuoc_hop_duoc_moi,
                "nam_danh_gia" : theo_nam.nam_danh_gia,
                "gia_dinh_van_hoa" : check
            })
        
        
    # print(float(bang_danh_gia.so_cuoc_hop_tham_du) / float(bang_danh_gia.so_cuoc_hop_duoc_moi))
    return return_response(data=data, msg="Xem đánh giá thành công!")



# xem đánh giá tất cả
@api.route('/xem_danh_gia_all/', methods=['GET'])
@login_required
@roles_required('Xem danh gia gia dinh van hoa')
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