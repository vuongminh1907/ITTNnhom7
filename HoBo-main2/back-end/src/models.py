from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import func, text
from datetime import datetime

db = SQLAlchemy()
class NguoiDung(UserMixin, db.Model):
    __tablename__ = 'nguoi_dung'
    __table_args__ = dict(schema="quan_ly_nguoi_dung")
    id_nguoi_dung = db.Column("idNguoiDung", db.String(100), primary_key=True)
    ten_dang_nhap = db.Column("tenDangNhap", db.String(50), unique=True)
    mat_khau = db.Column("matKhau", db.String(255))
    ten_day_du =  db.Column("tenDayDu", db.String(100))
    email =  db.Column(db.String(100), unique=True, nullable=True)
    so_dien_thoai =  db.Column("soDienThoai", db.String(12), unique=True, nullable=True)
    avatar_url =  db.Column("avatarUrl", db.String(255), nullable=True)
    chuc_vu = db.Column("chucVu", db.String(255), nullable=True)
    nhom = db.relationship('QuanHeNhomNguoiDung', back_populates="thanh_vien_trong_nhom")
    list_chuc_nang = []
    la_sadmin = db.Column("laSadmin", db.Boolean)
    is_authenticated = True

    # def __init__(self):
    #     print("h")
    #     print(self.query.first())
    #     self.nhom = QuanHeNhomNguoiDung.query.first()#filter_by(id_nguoi_dung=self.id_nguoi_dung).all()
    #     print(self.nhom)

    def is_active(self):
        """True, as all users are active."""
        return True

    def get_id(self):
        """Return the email address to satisfy Flask-Login's requirements."""
        return self.id_nguoi_dung

    # def is_authenticated(self):
    #     """Return True if the user is authenticated."""
    #     return self.is_active()

    def is_anonymous(self):
        """False, as anonymous users aren't supported."""
        return False

    def load_roles(self):
        print(f"User {self.id_nguoi_dung} - la_sadmin: {self.la_sadmin}")
        if self.la_sadmin:
            roles = ChucNangNguoiDung.query.all()
            for role in roles:
                if role.ten_chuc_nang not in self.list_chuc_nang:
                    self.list_chuc_nang.append(role.ten_chuc_nang) 
        else:
            '''
            for group_rela in self.nhom:
                group = NhomNguoiDung.query.filter_by(id_nhom=group_rela.id_nhom).first()
                for role_rela in group.chuc_nang:
                    role = ChucNangNguoiDung.query.filter_by(id_chuc_nang=role_rela.id_chuc_nang).first()
                    if role.ten_chuc_nang in self.list_chuc_nang:
                        self.list_chuc_nang.append(role.ten_chuc_nang)
            '''
            self.list_chuc_nang=[]
            for group_rela in self.nhom:
                group = NhomNguoiDung.query.filter_by(id_nhom=group_rela.id_nhom).first()
                print(f"Group {group.ten_nhom} - id: {group.id_nhom}")
                for role_rela in group.chuc_nang:
                    role = ChucNangNguoiDung.query.filter_by(id_chuc_nang=role_rela.id_chuc_nang).first()
                    print(f"Role {role.ten_chuc_nang} - id: {role.id_chuc_nang}")
                    if role.ten_chuc_nang not in self.list_chuc_nang:
                        self.list_chuc_nang.append(role.ten_chuc_nang)
        

    def has_roles(self, *role_names):
        """Return which roles this user has."""
        self.load_roles()
        for role in role_names: 
            if role in self.list_chuc_nang: 
                return True 
                
        return False

class NhomNguoiDung(db.Model):
    __tablename__ = 'nhom_nguoi_dung'
    __table_args__ = dict(schema="quan_ly_nguoi_dung")
    id_nhom = db.Column("idNhom", db.String(100), primary_key=True)
    ten_nhom = db.Column("tenNhom", db.String(100), unique=True)
    mo_ta = db.Column("moTa", db.String(100), nullable=True)
    chuc_nang = db.relationship('QuanHeNhomChucNang')
    thanh_vien_trong_nhom = db.relationship('QuanHeNhomNguoiDung', back_populates="nhom")

class QuanHeNhomNguoiDung(db.Model):
    __tablename__ = 'quan_he_nhom_nguoi_dung'
    __table_args__ = dict(schema="quan_ly_nguoi_dung")
    id_quan_he = db.Column("idQuanHeNhomNguoiDung", db.String(100), primary_key=True)
    id_nhom = db.Column("idNhom", db.String(100), 
                        db.ForeignKey('quan_ly_nguoi_dung.nhom_nguoi_dung.idNhom'), nullable=True)
    nhom = db.relationship('NhomNguoiDung', back_populates="thanh_vien_trong_nhom")
    thanh_vien_trong_nhom = db.relationship('NguoiDung', back_populates="nhom")
    id_nguoi_dung = db.Column("idNguoiDung", db.String(100), 
                        db.ForeignKey('quan_ly_nguoi_dung.nguoi_dung.idNguoiDung'), nullable=True)

class ChucNangNguoiDung(db.Model):
    __tablename__ = 'chuc_nang_nguoi_dung'
    __table_args__ = dict(schema="quan_ly_nguoi_dung")
    id_chuc_nang = db.Column("idChucNang", db.String(100), primary_key=True)
    ten_chuc_nang = db.Column("tenChucNang", db.String(100), unique=True)
    mo_ta = db.Column("moTa", db.String(100), nullable=True)
    nhom = db.relationship('QuanHeNhomChucNang')

class QuanHeNhomChucNang(db.Model):
    __tablename__ = 'quan_he_nhom_chuc_nang'
    __table_args__ = dict(schema="quan_ly_nguoi_dung")
    id_quan_he = db.Column("idQuanHeNhomChucNang", db.String(100), primary_key=True)
    id_nhom = db.Column("idNhom", db.String(100), 
                        db.ForeignKey('quan_ly_nguoi_dung.nhom_nguoi_dung.idNhom'), nullable=True)
    id_chuc_nang = db.Column("idChucNang", db.String(100), 
                        db.ForeignKey('quan_ly_nguoi_dung.chuc_nang_nguoi_dung.idChucNang'), nullable=True)

class ChungMinhThu(db.Model):
    __tablename__ = 'chung_minh_thu'
    __table_args__ = dict(schema="quan_ly_nhan_khau")
    so_cmt = db.Column("soCMT", db.String(12), primary_key=True)
    id_nhan_khau = db.Column("idNhanKhau", db.String(50), db.ForeignKey('quan_ly_nhan_khau.nhan_khau.ID'), primary_key=True)
    ngay_cap = db.Column("ngayCap", db.Date())
    noi_cap = db.Column("noiCap", db.String(100))

class HoKhau(db.Model):
    __tablename__ = 'ho_khau'
    __table_args__ = dict(schema="quan_ly_nhan_khau")
    """Theo quy định, số sổ hộ khẩu là một dãy gồm 9 chữ số tự nhiên, trong đó:

        2 số đầu tiên là mã số của tỉnh (thành phố trực thuộc Trung ương)

        Dãy số được ghi ngay ở trang bìa, hoặc trang đầu tiên bên trong sổ hộ khẩu."""
    id = db.Column("ID", db.String(100), primary_key=True)
    ma_ho_khau = db.Column("maHoKhau", db.String(9), unique=True)
    id_chu_ho = db.Column("idChuHo", db.String(100), db.ForeignKey('quan_ly_nhan_khau.nhan_khau.ID'), unique=True)
    ma_khu_vuc = db.Column("maKhuVuc", db.String(100))
    dia_chi = db.Column("diaChi", db.String(500))
    ngay_lap = db.Column("ngayLap", db.Date())
    ngay_chuyen_di = db.Column("ngayChuyenDi", db.Date(), nullable=True)
    ly_do_chuyen = db.Column("lyDoChuyen", db.String(100), nullable=True)
    id_nguoi_thuc_hien = db.Column("idNguoiThucHien", db.String(100), db.ForeignKey('quan_ly_nguoi_dung.nguoi_dung.idNguoiDung'))
    dien_tich = db.Column("dienTichNha",db.Integer,nullable=True)
    xe_may = db.Column("soXeMay",db.Integer,nullable= False)
    o_to = db.Column("soOTo",db.Integer,nullable= False)

class LichSuHoKhau(db.Model):
    __tablename__ = 'lich_su_ho_khau'
    __table_args__ = dict(schema="quan_ly_nhan_khau")
    id = db.Column("ID", db.String(100), primary_key=True)
    id_ho_khau = db.Column("idHoKhau", db.String(100), primary_key=True)
    ngay_chinh_sua = db.Column("ngayChinhSua", db.DateTime())
    thong_tin_chinh_sua = db.Column("thongTinChinhSua", db.String(100))
    id_nguoi_chinh_sua = db.Column("idNguoiChinhSua", db.String(100))


class KhaiTu(db.Model):
    __tablename__ = 'khai_tu'
    __table_args__ = dict(schema="quan_ly_nhan_khau")
    id = db.Column("ID", db.String(100), primary_key=True)
    so_giay_khai_tu = db.Column("soGiayKhaiTu", db.String(100), unique=True)
    id_nguoi_khai = db.Column("idNguoiKhai", db.String(100))
    id_nguoi_chet = db.Column("idNguoiChet", db.String(100), unique=True)
    ngay_khai = db.Column("ngayKhai", db.Date())
    ngay_chet = db.Column("ngayChet", db.Date())
    ly_do_chet = db.Column("lyDoChet", db.String(100), nullable=True)

class NhanKhau(db.Model):
    __tablename__ = 'nhan_khau'
    __table_args__ = dict(schema="quan_ly_nhan_khau")
    ID = db.Column(db.String(100), primary_key=True, unique=True)
    ho_ten = db.Column("hoTen", db.String(100))
    biet_danh = db.Column("bietDanh",db.String(100), nullable=True)
    ngay_sinh = db.Column("ngaySinh", db.Date())
    gioi_tinh = db.Column("gioiTinh", db.String(10))
    noi_sinh = db.Column("noiSinh", db.String(100))
    nguyen_quan = db.Column("nguyenQuan", db.String(100))
    dan_toc = db.Column("danToc", db.String(100))
    ton_giao = db.Column("tonGiao", db.String(100))
    quoc_tich = db.Column("quocTich", db.String(100))
    so_ho_chieu = db.Column("soHoChieu", db.String(100))
    noi_thuong_tru = db.Column("noiThuongTru", db.String(100))
    dia_chi_hien_nay = db.Column("diaChiHienNay", db.String(500))
    trinh_do_hoc_van = db.Column("trinhDoHocVan", db.String(100))
    biet_tieng_dan_toc = db.Column("bietTiengDanToc", db.String(100))
    trinh_do_ngoai_ngu = db.Column("trinhDoNgoaiNgu", db.String(100))
    nghe_nghiep = db.Column("ngheNghiep", db.String(100))
    noi_lam_viec = db.Column("noiLamViec", db.String(500))
    tien_an = db.Column("tienAn", db.String(100), nullable=True)
    ngay_chuyen_den = db.Column("ngayChuyenDen", db.Date(), nullable=True)
    ly_do_chuyen_den = db.Column("lyDoChuyenDen", db.String(100), nullable=True)
    ngay_chuyen_di = db.Column("ngayChuyenDi", db.Date(), nullable=True)
    ly_do_chuyen_di = db.Column("lyDoChuyenDi", db.String(100), nullable=True)
    dia_chi_moi = db.Column("diaChiMoi", db.String(100), nullable=True)
    ngay_tao = db.Column("ngayTao", db.Date())
    id_nguoi_tao = db.Column("idNguoiTao", db.String(100), 
                            db.ForeignKey('quan_ly_nguoi_dung.nguoi_dung.idNguoiDung'))
    # nguoi_tao = db.relationship("NguoiDung", back_populates="tao_nhan_khau")
    ngay_xoa = db.Column("ngayXoa", db.Date(), nullable=True)
    id_nguoi_xoa = db.Column("idNguoiXoa", db.String(100), 
                            db.ForeignKey('quan_ly_nguoi_dung.nguoi_dung.idNguoiDung'), nullable=True)
    ly_do_xoa = db.Column("lyDoXoa", db.String(100), nullable=True)
    ghi_chu = db.Column("ghiChu", db.String(100), nullable=True)
    # cmt = db.relationship('ChungMinhThu', back_populates="chu_nhan")

    @hybrid_property
    def age_month(self):
        age = func.datediff(text('month'), self.ngay_sinh, datetime.today())
        return age

    @hybrid_property
    def age_year(self):
        age = datetime.today().year - func.year(self.ngay_sinh)
        return age

# class GiaDinh(db.Model):
#     __tablename__ = 'gia_dinh'
#     __table_args__ = dict(schema="quan_ly_nhan_khau")
#     id = db.Column("ID", db.String(100), primary_key=True, unique=True)
#     id_nhan_khau = db.Column("idNhanKhau", db.String(50), unique=True)
#     ho_ten = db.Column("ho_ten", db.String(100))
#     nam_sinh = db.Column("namSinh", db.Date())
#     gioi_tinh = db.Column("gioiTinh", db.String(10))
#     quan_he_voi_chu_ho = db.Column("quanHeVoiChuHo", db.String(100))
#     nghe_nghiep = db.Column("ngheNghiep", db.String(100))
#     dia_chi_hien_tai = db.Column("diaChiHienTai", db.String(100))

class TamTru(db.Model):
    __tablename__ = 'tam_tru'
    __table_args__ = dict(schema="quan_ly_nhan_khau")
    id = db.Column("ID", db.String(100), primary_key=True, unique=True)
    id_nhan_khau = db.Column("idNhanKhau", db.String(100), db.ForeignKey('quan_ly_nhan_khau.nhan_khau.ID'), unique=True)
    ma_giay_tam_tru = db.Column("maGiayTamTru", db.String(100), unique=True)
    so_dien_thoai_nguoi_dang_ky= db.Column("soDienThoaiNguoiDangKy", db.String(100))
    tu_ngay = db.Column("tuNgay", db.Date())
    den_ngay = db.Column("denNgay", db.Date())
    ly_do = db.Column("lyDo", db.String(100))
    noi_tam_tru = db.Column("noiTamTru", db.String(100))

class TamVang(db.Model):
    __tablename__ = 'tam_vang'
    __table_args__ = dict(schema="quan_ly_nhan_khau")
    id = db.Column("ID", db.String(100), primary_key=True)
    id_nhan_khau = db.Column("idNhanKhau", db.String(100))
    ma_giay_tam_vang = db.Column("maGiayTamVang", db.String(100), unique=True)
    noi_tam_tru = db.Column("noiTamTru", db.String(100))
    tu_ngay = db.Column("tuNgay", db.Date())
    den_ngay = db.Column("denNgay", db.Date())
    ly_do = db.Column("lyDo", db.String(100))

# class TieuSu(db.Model):
#     __tablename__ = 'tieu_su'
#     __table_args__ = dict(schema="quan_ly_nhan_khau")
#     id = db.Column("ID", db.String(100), primary_key=True, unique=True)
#     id_nhan_khau = db.Column("idNhanKhau", db.String(100), unique=True)
#     tu_ngay = db.Column("tuNgay", db.Date(), nullable=True)
#     den_ngay = db.Column("denNgay", db.Date(), nullable=True)
#     dia_chi = db.Column("diaChi", db.String(500))
#     nghe_nghiep = db.Column("ngheNghiep", db.String(100))
#     noi_lam_viec = db.Column("noiLamViec", db.String(100))

class ThanhVienCuaHo(db.Model):
    __tablename__ = 'thanh_vien_cua_ho'
    __table_args__ = dict(schema="quan_ly_nhan_khau")
    id_nhan_khau = db.Column("idNhanKhau", db.String(100), primary_key=True, unique=True)
    id_ho_khau = db.Column("idHoKhau", db.String(100))
    quan_he_voi_chu_ho = db.Column("quanHeVoiChuHo", db.String(100))


    
# quan he nhieu-nhieu giua CuocHop va NhanKhau: 1 cuoc hop co nhieu nguoi to chuc, 1 nguoi to chuc nhieu cuoc hop
class NguoiToChuc(db.Model):
    __tablename__ = 'nguoi_to_chuc'
    __table_args__ = dict(schema = "quan_ly_lich_hop")
    id_cuoc_hop = db.Column("idCuocHop", db.String(100), primary_key = True)
    id_nhan_khau = db.Column("idNhanKhau", db.String(100), primary_key = True)

# quan he nhieu-nhieu giua CuocHop va NhanKhau: 1 cuoc hop moi duoc nhieu nguoi, 1 nguoi co the duoc moi nhieu cuoc hop
class MoiHop(db.Model):
    __tablename__ = 'moi_hop'
    __table_args__ = dict(schema = "quan_ly_lich_hop")
    id_cuoc_hop = db.Column("idCuocHop", db.String(100),db.ForeignKey('quan_ly_lich_hop.cuoc_hop.ID'), primary_key = True)
    id_nhan_khau = db.Column("idNhanKhau", db.String(100), primary_key = True)
    ngay_moi_hop = db.Column("ngayMoiHop", db.Date())

#quan he nhieu-nhieu
class DanhSachThamDu(db.Model):
    __tablename__ = 'danh_sach_tham_du'
    __table_args__ = dict(schema = "quan_ly_lich_hop")
    id_cuoc_hop = db.Column("idCuocHop", db.String(100),db.ForeignKey('quan_ly_lich_hop.cuoc_hop.ID'), primary_key = True)
    id_nhan_khau = db.Column("idNhanKhau", db.String(100), db.ForeignKey('quan_ly_nhan_khau.nhan_khau.ID'), primary_key = True )

#quan he 1-1 voi cuoc hop
class BienBanHop(db.Model):
    __tablename__ = 'bien_ban_hop'
    __table_args__ = dict(schema = "quan_ly_lich_hop")
    id_bien_ban = db.Column("idBienBan", db.String(100), primary_key = True)
    id_cuoc_hop = db.Column("idCuocHop", db.String(100), db.ForeignKey('quan_ly_lich_hop.cuoc_hop.ID'))
    ban_ve_viec = db.Column("banVeViec", db.Text())
    thong_nhat = db.Column("thongNhat", db.Text())
    thoi_gian_lap = db.Column("thoiGianLap", db.DateTime()) 


class CuocHop(db.Model):
    __tablename__ = 'cuoc_hop'
    __table_args__ = dict(schema = "quan_ly_lich_hop")
    ID = db.Column("ID", db.String(100), primary_key=True)
    thoi_gian = db.Column("thoiGian", db.DateTime())
    dia_diem = db.Column("diaDiem", db.String(50))
    noi_dung = db.Column("noiDung", db.Text())
    bien_ban = db.relationship("BienBanHop", backref = 'cuoc_hop', lazy = 'subquery')
    nguoi_tham_du = db.relationship("DanhSachThamDu", backref = 'cuoc_hop')
    nguoi_duoc_moi = db.relationship("MoiHop", backref = 'cuoc_hop')

    def __init__(self, ID, thoi_gian, dia_diem, noi_dung):
        self.ID = ID
        self.thoi_gian = thoi_gian
        self.dia_diem = dia_diem
        self.noi_dung = noi_dung

# model lưu số lần tham dự, số lần được mời của 1 hộ gia đình
#--> đánh giá dựa trên tỷ lệ phần trăm số lần td trên số lần mời
class GiaDinhVanHoa(db.Model):
    __tablename__ = 'danh_gia_gia_dinh_van_hoa'
    __table_args__ = dict(schema = "quan_ly_lich_hop")
    ma_ho_khau = db.Column("maHoKhau", db.String(100), primary_key = True)
    #so_cuoc_hop_tham_du = db.Column("soCuocHopThamDu", db.Integer())
    #so_cuoc_hop_duoc_moi = db.Column("soCuocHopDuocMoi", db.Integer())
    nam_danh_gia = db.Column("namDanhGia", db.Integer(), primary_key = True)
    so_tien_dong_gop = db.Column("soTienDongGop",db.Float())
    so_lan_dong_tien_dung_han = db.Column("soLanDongDungHan",db.Float())


######################################################################################
class DongGop(db.Model):
    __tablename__ = 'dong_gop'
    __table_args__ = dict(schema = "quan_ly_thu_phi")
    id = db.Column("idDongGop", db.String(100), primary_key = True)
    ma_dong_gop = db.Column("maDongGop",db.String(100),unique= True)
    ten_dong_gop = db.Column("tenDongGop",db.String(100))
    so_tien = db.Column("soTien",db.Integer())
    mo_ta = db.Column("moTa",db.String(100))
    han_nop = db.Column("hanNop",db.Date())
    #------------------------------------
    #cac_ho_khau = db.relationship("DanhSachDongGop",backref = 'dong_gop')
    #ho_khau_nop_phi = db.relationship("DanhSachHoKhauDaNop",secondary = 'danh_sach_ho_khau_da_nop', backref = 'khoan_phi')

    def __init__(self,id,ma_dong_gop,ten_dong_gop,so_tien,mo_ta,han_nop):
        self.id = id
        self.ma_dong_gop = ma_dong_gop
        self.ten_dong_gop = ten_dong_gop
        self.so_tien = so_tien
        self.mo_ta = mo_ta
        self.han_nop = han_nop

    @hybrid_property
    def remain_time(self):
        today_datetime = datetime.today().date()  # Chuyển đổi thành đối tượng datetime.date
        remain = (self.han_nop - today_datetime).days
        return remain
    @hybrid_property
    def han_month(self):
        thang = self.han_nop.month
        return thang
#####################################################################
class DanhSachDongGop(db.Model):
    __tablename__= 'danh_sach_dong_gop'
    __table_args__= dict(schema='quan_ly_thu_phi')
    id_dong_gop = db.Column("idDongGop",db.String(100),primary_key= True)
    ma_dong_gop = db.Column("maDongGop",db.String(100),db.ForeignKey('quan_ly_thu_phi.dong_gop.maDongGop'))
    ma_ho_khau = db.Column("maHoKhau",db.String(100),db.ForeignKey('quan_ly_nhan_khau.ho_khau.maHoKhau'))
    ngay_ung_ho = db.Column("ngayUngHo",db.Date())
    so_tien = db.Column("tienUngHo",db.Integer())
    ho_khau = db.relationship('HoKhau', backref='danh_sach_dong_gop')
    khoan_dong_gop = db.relationship('DongGop', backref='danh_sach_dong_gop')
    
    def __init__(self,id_dong_gop,ma_dong_gop,ma_ho_khau,ngay_ung_ho,so_tien):
        self.id_dong_gop = id_dong_gop
        self.ma_dong_gop = ma_dong_gop
        self.ma_ho_khau = ma_ho_khau
        self.ngay_ung_ho = ngay_ung_ho
        self.so_tien = so_tien

####################################
class BatBuoc(db.Model):
    __tablename__ = 'bat_buoc'
    __table_args__ = dict(schema = "quan_ly_thu_phi")
    #ma_bat_buoc = db.Column("maBatBuoc",db.String(100),unique= True, primary_key = True)
    tien_dich_vu = db.Column("tenDichVu",db.Float())
    tien_dien = db.Column("tienDien",db.Float())
    tien_nuoc = db.Column("tienNuoc",db.Float())
    tien_moi_truong = db.Column("tenMoiTruong", db.Float())
    tien_quan_ly = db.Column("tenQuanLy",db.Float())
    tien_bao_tri = db.Column("tienBaoTri",db.Float())
    tien_giu_xe_2 = db.Column("tienGiuXe2",db.Float())
    tien_giu_xe_4 = db.Column("tienGiuXe4",db.Float())
    month = db.Column("thang",db.Integer(), primary_key= True)
    year = db.Column("nam",db.Integer(),primary_key= True)
    mo_ta = db.Column("moTa",db.String(100))
    
    def __init__(self,tien_dich_vu,tien_dien,tien_nuoc,tien_moi_truong,tien_quan_ly,tien_bao_tri,tien_giu_xe_2,tien_giu_xe_4,month,year,mo_ta):
        self.tien_dich_vu = tien_dich_vu
        self.tien_dien = tien_dien
        self.tien_nuoc = tien_nuoc
        self.tien_moi_truong = tien_moi_truong
        self.tien_quan_ly = tien_quan_ly
        self.tien_bao_tri = tien_bao_tri
        self.tien_giu_xe_2 = tien_giu_xe_2
        self.tien_giu_xe_4 = tien_giu_xe_4
        self.month = month
        self.year = year
        self.mo_ta = mo_ta
    #ho_khau = db.relationship()

class DanhSachBatBuoc(db.Model):
    __tablename__ = 'danh_sach_bat_buoc'
    __table_args__ = dict(schema= 'quan_ly_thu_phi')
    id = db.Column("idBatBuoc",db.String(100),primary_key= True)
    ma_ho_khau = db.Column("maHoKhau", db.String(9),db.ForeignKey("quan_ly_nhan_khau.ho_khau.maHoKhau"))
    ngay_dong = db.Column("ngayDong",db.Date())
    so_tien_da_dong = db.Column("daDong",db.Float(),nullable= True, default=0.0)
    so_tien = db.Column("soTien",db.Float())
    ho_khau = db.relationship('HoKhau',backref= 'danh_sach_bat_buoc')
    thang = db.Column("thang",db.Integer(),db.ForeignKey("quan_ly_thu_phi.bat_buoc.thang"))
    nam = db.Column("nam",db.Integer(),db.ForeignKey("quan_ly_thu_phi.bat_buoc.nam"))

    def __init__(self,id,ma_ho_khau,so_tien,thang,nam):
        self.id = id
        self.ma_ho_khau = ma_ho_khau
        self.so_tien = so_tien
        self.thang = thang
        self.nam = nam

class KhoiDienNuoc(db.Model):
    __tablename__ = 'khoi_dien_nuoc'
    __table_args__ = dict(schema= 'quan_ly_thu_phi')
    ma_ho_khau = db.Column("maHoKhau",db.String(9),primary_key= True)
    thang = db.Column("thang",db.Integer(),primary_key= True)
    nam = db.Column("nam",db.Integer(),primary_key= True)
    khoi_dien = db.Column("khoiDien", db.Float())
    khoi_nuoc = db.Column("khoiNuoc",db.Float())