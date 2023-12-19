from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import db, CuocHop, NhanKhau
import uuid
from http import HTTPStatus
from .decorators import roles_required
from flask_login import login_required

api = Blueprint('cuoc_hop', __name__, url_prefix='/cuoc_hop')

@api.route('/tao_moi_cuoc_hop', methods = ['POST'])
@login_required
@roles_required('Tao moi thong tin cuoc hop')   #@roles_required('Tạo mới thông tin cuộc họp')
def tao_cuoc_hop_moi():
    try:
        args = request.get_json()
        res = schema.TaoMoiCuocHop().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    
    thoi_gian = args.get('thoi_gian')
    dia_diem = args.get('dia_diem')
    noi_dung = args.get('noi_dung')

    ID = str(uuid.uuid4().hex)
    new_cuoc_hop = CuocHop(ID, thoi_gian, dia_diem, noi_dung)

    try:
        db.session.add(new_cuoc_hop)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra.")
    return return_response(code=200, msg="Thêm cuộc họp thành công!", data={'id': ID})

@api.route('/sua_cuoc_hop/<id>/', methods = ['PUT'])
@login_required
@roles_required('Sua thong tin cuoc hop')   #@roles_required('Sửa thông tin cuộc họp')
def sua_cuoc_hop(id):
    try:
        args = request.get_json()
        res = schema.ThayDoiCuocHop().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    
    thoi_gian = args.get('thoi_gian')
    dia_diem = args.get('dia_diem')
    noi_dung = args.get('noi_dung')

    cuoc_hop = CuocHop.query.filter_by(ID = id).first()
    if not cuoc_hop:
        return return_response(code = HTTPStatus.BAD_REQUEST, msg="Cuộc họp không tồn tại.")

    cuoc_hop.thoi_gian = thoi_gian
    cuoc_hop.dia_diem = dia_diem
    cuoc_hop.noi_dung = noi_dung

    try:
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra.")

    return return_response(msg="Cập nhật cuộc họp thành công!")

@api.route('/xoa_cuoc_hop/', methods=['POST'])
@login_required
@roles_required('Xoa thong tin cuoc hop')   #@roles_required('Xóa thông tin cuộc họp')
def xoa_cuoc_hop():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinXoaCuocHop().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_list = args.get('id_list')

    #check valid list
    if not id_list:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn cuộc họp để xóa.")

    return_message = []
    for id in id_list:
        cuoc_hop = CuocHop.query.filter_by(ID=id).first()
        if not cuoc_hop:
            return_message.append("Cuộc họp không tồn tại hoặc đã bị xóa.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id in id_list:
        cuoc_hop = CuocHop.query.filter_by(ID=id).first()
        try:
            db.session.delete(cuoc_hop)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra.")

    return return_response(msg="Xóa cuộc họp thành công!")

@api.route('/xem_cuoc_hop/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin cuoc hop')
def xem_cuoc_hop(id):

    cuoc_hop = CuocHop.query.filter_by(ID=id).first()
    if not cuoc_hop:
        return return_response(code=400, msg="Cuộc họp không tồn tại hoặc đã bị xóa.")

    data = {
        'id_cuoc_hop': cuoc_hop.ID,
        'thoi_gian': cuoc_hop.thoi_gian,
        'dia_diem': cuoc_hop.dia_diem,
        'noi_dung': cuoc_hop.noi_dung,
    }

    return return_response(data=data, msg="Xem cuộc họp thành công!")

@api.route('/xem_cuoc_hops/', methods=['GET'])
@login_required
@roles_required('Xem thong tin cuoc hop')
def xem_cuoc_hops():

    cuoc_hops = CuocHop.query.all()
    data = []
    for cuoc_hop in cuoc_hops:
        data.append({
            'id_cuoc_hop': cuoc_hop.ID,
            'thoi_gian': cuoc_hop.thoi_gian,
            'dia_diem': cuoc_hop.dia_diem,
            'noi_dung': cuoc_hop.noi_dung,
        })
    
    return return_response(data=data)
# xem danh sach tham du cua 1 cuoc hop
@api.route('/xem_dstd_cuoc_hop/<id>', methods=['GET'])
@login_required
@roles_required('Xem thong tin cuoc hop')
def xem_dstd_cuoc_hop(id):

    cuoc_hop = CuocHop.query.filter_by(ID=id).first()
    danh_sach_id_tham_du = cuoc_hop.nguoi_tham_du
    if not cuoc_hop:
        return return_response(code=400, msg="Cuộc họp không tồn tại hoặc đã bị xóa.")
    
    if not danh_sach_id_tham_du:
        return return_response(code=400, msg="Cuộc họp không có người tham dự.")
    danh_sach_tham_du = []
    for id in danh_sach_id_tham_du:
        print(id.id_nhan_khau)
        danh_sach_tham_du.append(NhanKhau.query.filter_by(ID=id.id_nhan_khau).first())
    
    data = []
    for nhan_khau in danh_sach_tham_du:
        # print(nhan_khau.ho_ten)
        data.append({
            "ho_ten" : nhan_khau.ho_ten
        })

    return return_response(data=data, msg="Xem danh sách cuộc họp thành công!")
