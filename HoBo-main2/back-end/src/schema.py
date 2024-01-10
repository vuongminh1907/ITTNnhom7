from marshmallow import Schema, fields

class ThongTinDangNhap(Schema):
    ten_dang_nhap = fields.String(required=True)
    mat_khau = fields.String(required=True)
    nho_dang_nhap = fields.Boolean()

    class Meta:
        strict = True
    
class ThongTinDangKy(Schema):
    ten_dang_nhap = fields.String(required=True)
    mat_khau = fields.String(required=True)
    ten_day_du = fields.String(required=True)
    email = fields.String(missing=None)
    so_dien_thoai = fields.String(missing=None)
    avatar_url = fields.String(missing=None)
    nhom = fields.List(fields.String(), required=True)
    chuc_vu = fields.String(missing=None)

class ThongTinThayDoiNguoiDung(Schema):
    ten_day_du = fields.String(required=True)
    email = fields.String(missing=None)
    so_dien_thoai = fields.String(missing=None)
    avatar_url = fields.String(missing=None)
    nhom = fields.List(fields.String(), required=True)
    chuc_vu = fields.String(missing=None)

class ThongTinXoa(Schema):
    id_list = fields.List(fields.String(), required=True)

class ThongTinTaoNhomNguoiDung(Schema):
    ten_nhom = fields.String(required=True)
    mo_ta = fields.String(required=True)
    list_nguoi_dung = fields.List(fields.String(), required=True, allow_none=True)
    list_chuc_nang = fields.List(fields.String(), required=True, allow_none=True)

class ThongTinNhanKhau(Schema):
    ho_ten = fields.String(required=True)
    biet_danh = fields.String(missing=None)
    ngay_sinh = fields.Date(required=True)
    gioi_tinh = fields.String(required=True)
    noi_sinh = fields.String(required=True)
    nguyen_quan = fields.String(required=True)
    dan_toc = fields.String(required=True)
    ton_giao = fields.String(required=True)
    quoc_tich = fields.String(required=True)
    so_ho_chieu = fields.String(missing=None)
    noi_thuong_tru = fields.String(required=True)
    dia_chi_hien_nay = fields.String(required=True)
    trinh_do_hoc_van = fields.String(required=True)
    biet_tieng_dan_toc = fields.String(required=True)
    trinh_do_ngoai_ngu = fields.String(required=True)
    nghe_nghiep = fields.String(required=True)
    noi_lam_viec = fields.String(required=True)
    tien_an = fields.String(missing=None)
    ngay_chuyen_den = fields.Date(missing=None, allow_none=True)
    ly_do_chuyen_den = fields.String(missing=None, allow_none=True)
    ngay_chuyen_di = fields.Date(missing=None, allow_none=True)
    ly_do_chuyen_di = fields.String(missing=None, allow_none=True)
    dia_chi_moi = fields.String(missing=None, allow_none=True)
    ghi_chu = fields.String(missing=None, allow_none=True)
    so_cmt = fields.String(missing=None, allow_none=True)
    ngay_cap = fields.Date(missing=None, allow_none=True)
    noi_cap = fields.String(missing=None, allow_none=True)

class ThongTinChungMinhThu(Schema):
    id_nhan_khau = fields.String(required=True)
    so_cmt = fields.String(required=True)
    ngay_cap = fields.String(required=True)
    noi_cap = fields.String(required=True)

class ThongTinQuanHeTrongHo(Schema):
    id_nhan_khau = fields.String(required=True)
    quan_he_voi_chu_ho = fields.String(required=True)

class ThongTinHoKhau(Schema):
    ma_ho_khau = fields.String(required=True)
    id_chu_ho = fields.String(required=True)
    ma_khu_vuc = fields.String(required=True)
    dia_chi = fields.String(required=True)
    ngay_lap = fields.Date(required=True)
    ngay_chuyen_di = fields.Date(missing=None, allow_none=True)
    ly_do_chuyen = fields.String(missing=None, allow_none=True)
    list_nhan_khau = fields.List(fields.Nested(ThongTinQuanHeTrongHo), required=True, allow_none=True)
    dien_tich = fields.Integer(required= False)
    xe_may = fields.Integer(required= False)
    o_to = fields.Integer(required= False)

class ThongTinThayDoiHoKhau(Schema):
    id_chu_ho = fields.String(required=True)
    ma_khu_vuc = fields.String(required=True)
    dia_chi = fields.String(required=True)
    ngay_lap = fields.Date(required=True)
    ngay_chuyen_di = fields.Date(required=True)
    ly_do_chuyen = fields.String(required=True)

class ThongTinTachHoKhau(Schema):
    new_ma_ho_khau = fields.String(required=True)
    new_id_chu_ho = fields.String(required=True)
    new_ma_khu_vuc = fields.String(required=True)
    new_dia_chi = fields.String(required=True)
    new_ngay_lap = fields.Date(required=True)
    new_ngay_chuyen_di = fields.Date(required=True)
    new_ly_do_chuyen = fields.String(required=True)
    new_o_to = fields.Integer(required= False)
    new_xe_may = fields.Integer(required= False)
    new_dien_tich = fields.Integer(required= False)
    new_list_nhan_khau = fields.List(fields.Nested(ThongTinQuanHeTrongHo), required=True, allow_none=True)

class ThongTinKhaiTu(Schema):
    so_giay_khai_tu = fields.String(required=True)
    id_nguoi_khai = fields.String(required=True)
    id_nguoi_chet = fields.String(required=True)
    ngay_khai = fields.Date(required=True)
    ngay_chet = fields.Date(required=True)
    ly_do_chet = fields.String(missing=None)

class thanh_vien_cua_ho(Schema):
    id_nhan_khau = fields.String(required=True)
    id_ho_khau = fields.String(required=True)
    quan_he_voi_chu_ho = fields.String(required=True)

class ThongTinTamTru(Schema):
    id_nhan_khau = fields.String(required=True)
    ma_giay_tam_tru = fields.String(required=True)
    so_dien_thoai_nguoi_dang_ky = fields.String(required=True)
    tu_ngay = fields.Date(required=True)
    den_ngay = fields.Date(required=True)
    ly_do = fields.String(required=True)
    noi_tam_tru = fields.String(required=True)

class ThongTinTamVang(Schema):
    id_nhan_khau = fields.String(required=True)
    ma_giay_tam_vang = fields.String(required=True)
    noi_tam_tru = fields.String(required=True)
    tu_ngay = fields.Date(required=True)
    den_ngay = fields.Date(required=True)
    ly_do = fields.String(required=True)

class ThongTinDoTuoi(Schema):
    start = fields.Integer(required=True)
    end = fields.Integer(required=True)

class ThongTinThoiGian(Schema):
    start = fields.Date(required=True)
    end = fields.Date(required=True)

class ThongTinThongKeNhanKhau(Schema):
    gioi_tinh = fields.String(allow_none=True)
    do_tuoi = fields.String(allow_none=True)
    tuoi = fields.Nested(ThongTinDoTuoi, allow_none=True)
    tinh_trang = fields.String(allow_none=True)
    thoi_gian = fields.Nested(ThongTinThoiGian, allow_none=True)

class TaoMoiCuocHop(Schema):
    thoi_gian = fields.DateTime(required = True)
    dia_diem = fields.String(required = True)
    noi_dung = fields.String(required = True)

class ThayDoiCuocHop(Schema):
    thoi_gian = fields.DateTime(required = False)
    dia_diem = fields.String(required = False)
    noi_dung = fields.String(required = False)

class ThongTinXoaCuocHop(Schema):
    id_list = fields.List(fields.String(), required=True)

class TaoMoiBienBanHop(Schema):
    id_cuoc_hop = fields.String(required = True)
    ban_ve_viec = fields.String(required = True)
    thong_nhat = fields.String(required = True)
    thoi_gian_lap = fields.DateTime(required = False)

class ThayDoiBienBanHop(Schema):
    id_cuoc_hop = fields.String(required = False)
    ban_ve_viec = fields.String(required = False)
    thong_nhat = fields.String(required = False)
    thoi_gian_lap = fields.DateTime(required = False)

class ThongTinXoaBienBanHop(Schema):
    id_list = fields.List(fields.String(), required=True)

class ThemLoiMoi(Schema):
    id_cuoc_hop = fields.String(required=True)
    list_id_nhan_khau = fields.List(fields.String(),required=True)

class XoaLoiMoi(Schema):
    id_cuoc_hop = fields.String(required=True)
    list_id_nhan_khau = fields.List(fields.String(),required=True)

class ThemNguoiToChuc(Schema):
    id_cuoc_hop = fields.String(required=True)
    list_id_nhan_khau = fields.List(fields.String(),required=True)

class XoaNguoiToChuc(Schema):
    id_cuoc_hop = fields.String(required=True)
    list_id_nhan_khau = fields.List(fields.String(),required=True)

class ThemNguoiThamDu(Schema):
    id_cuoc_hop = fields.String(required=True)
    list_id_nhan_khau = fields.List(fields.String(),required=True)

class XoaNguoiThamDu(Schema):
    id_cuoc_hop = fields.String(required=True)
    list_id_nhan_khau = fields.List(fields.String(),required=True)

class ThemDanhGia(Schema):
    danh_sach_ma_ho_khau = fields.List(fields.String(),required=True)
    nam_danh_gia = fields.Integer(required = True)

#######################################################################
class ThemDongGop(Schema):
    ma_dong_gop = fields.String(required=True)
    ten_dong_gop = fields.String(required=True)
    so_tien = fields.Integer(required= True)
    mo_ta = fields.String(required= True)
    han_nop = fields.Date(required = True)
    
class XoaDongGop(Schema):
    ma_list = fields.List(fields.String(), required=True)

class ThaydoiDongGop(Schema):
    ten_dong_gop = fields.String(required=True)
    so_tien = fields.Integer(required = True)
    mo_ta = fields.String(required= True)
    han_nop = fields.Date(required = True)

class DongGop(Schema):
    so_tien = fields.Integer(required=True)
    ma_dong_gop = fields.String(required=True)
    ngay_ung_ho = fields.Date(required= True)
##########################
class ThemPhiBatBuoc(Schema):
    tien_dich_vu = fields.Float(required= True)
    tien_dien = fields.Float(required= True)
    tien_nuoc = fields.Float(required= True)
    tien_moi_truong = fields.Float(required= True)
    tien_quan_ly = fields.Float(required= True)
    tien_bao_tri = fields.Float(required= True)
    tien_giu_xe_2 = fields.Float(required= True)
    tien_giu_xe_4 = fields.Float(required=True)
    month = fields.Integer(required= True)
    year = fields.Integer(required= True)
    mo_ta = fields.String(required= True)   

class ThemLinkExcel(Schema):
    link_excel = fields.String(required=True)

class NopTienBatBuoc(Schema):
    so_tien_da_dong = fields.Float(required= True)
    ngay_dong = fields.Date(required= True)
class SearchMonthYear(Schema):
    thang = fields.Integer(required= True)
    nam = fields.Integer(required= True)