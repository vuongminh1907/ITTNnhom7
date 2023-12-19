from . import schema
from flask import Blueprint, request
from .utils import return_response
from .models import db, BienBanHop
import uuid
from http import HTTPStatus
from flask_login import login_required
from .decorators import roles_required

api = Blueprint('bien_ban_hop', __name__, url_prefix='/bien_ban_hop')

@api.route('/tao_moi_bien_ban_hop', methods = ['POST'])
@login_required
@roles_required('Tao moi thong tin cuoc hop')
def tao_bien_ban_hop_moi():
    try:
        args = request.get_json()
        res = schema.TaoMoiBienBanHop().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    
    id_cuoc_hop = args.get('id_cuoc_hop')
    ban_ve_viec = args.get('ban_ve_viec')
    thong_nhat = args.get('thong_nhat')
    thoi_gian_lap = args.get('thoi_gian_lap')

    id_bien_ban = str(uuid.uuid4().hex)
    bien_ban_moi = BienBanHop(id_bien_ban=id_bien_ban, id_cuoc_hop=id_cuoc_hop, ban_ve_viec=ban_ve_viec, thong_nhat=thong_nhat, thoi_gian_lap=thoi_gian_lap)

    try:
        db.session.add(bien_ban_moi)
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=500, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")
    return return_response(code=200, msg="Thêm biên bản họp thành công!")

@api.route('/sua_bien_ban_hop/<id>/', methods = ['PUT'])
@login_required
@roles_required('Sua thong tin cuoc hop')
def sua_bien_ban_hop(id):
    try:
        args = request.get_json()
        res = schema.ThayDoiBienBanHop().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))
    
    id_cuoc_hop = args.get('id_cuoc_hop')
    ban_ve_viec = args.get('ban_ve_viec')
    thong_nhat = args.get('thong_nhat')
    thoi_gian_lap = args.get('thoi_gian_lap')

    bien_ban_hop = BienBanHop.query.filter_by(id_bien_ban = id).first()
    if not bien_ban_hop:
        return return_response(code = HTTPStatus.BAD_REQUEST, msg="Biên bản họp không tồn tại.")

    bien_ban_hop.id_cuoc_hop = id_cuoc_hop
    bien_ban_hop.ban_ve_viec = ban_ve_viec
    bien_ban_hop.thong_nhat = thong_nhat
    bien_ban_hop.thoi_gian_lap = thoi_gian_lap

    try:
        db.session.commit()
    except Exception as e:
        print(str(e))
        return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra.")

    return return_response(msg="Cập nhật biên bản họp thành công!")

@api.route('/xoa_bien_ban_hop/', methods=['POST'])
@login_required
@roles_required('Xoa thong tin cuoc hop')
def xoa_bien_ban_hop():
    #validate input
    try:
        args = request.get_json()
        res = schema.ThongTinXoaBienBanHop().load(args)
    except Exception as e:
        return return_response(code=HTTPStatus.UNPROCESSABLE_ENTITY, msg=str(e))

    id_list = args.get('id_list')

    #check valid list
    if not id_list:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg="Chưa chọn biên bản họp để xóa.")

    return_message = []
    for id in id_list:
        bien_ban_hop = BienBanHop.query.filter_by(id_bien_ban=id).first()
        if not bien_ban_hop:
            return_message.append("Biên bản họp không tồn tại hoặc đã bị xóa.")
    
    if return_message:
        return return_response(code=HTTPStatus.BAD_REQUEST, msg=return_message)

    return_message = []
    for id in id_list:
        bien_ban_hop = BienBanHop.query.filter_by(id_bien_ban=id).first()
        try:
            db.session.delete(bien_ban_hop)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return return_response(code=HTTPStatus.INTERNAL_SERVER_ERROR, msg="Có lỗi xảy ra. Vui lòng thử lại sau.")

    return return_response(msg="Xóa biên bản họp thành công!")

@api.route('/xem_bien_ban_hop/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin cuoc hop')
def xem_bien_ban_hop(id):

    bien_ban_hop = BienBanHop.query.filter_by(id_bien_ban=id).first()
    if not bien_ban_hop:
        return return_response(code=400, msg="Biên bản họp không tồn tại hoặc đã bị xóa.")

    data = {
        'id_bien_ban' : bien_ban_hop.id_bien_ban,
        'id_cuoc_hop': bien_ban_hop.id_cuoc_hop,
        'ban_ve_viec': bien_ban_hop.ban_ve_viec,
        'thong_nhat': bien_ban_hop.thong_nhat,
        'thoi_gian_lap': bien_ban_hop.thoi_gian_lap,
    }

    return return_response(data=data, msg="Xem biên bản họp thành công!")

@api.route('/xem_bien_ban_hop_by_id_cuoc_hop/<id>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin cuoc hop')
def xem_bien_ban_hop_by_id_cuoc_hop(id):

    bien_ban_hop = BienBanHop.query.filter_by(id_cuoc_hop=id).first()
    if not bien_ban_hop:
        return return_response(code=400, msg="Biên bản họp không tồn tại hoặc đã bị xóa.")

    data = {
        'id_bien_ban' : bien_ban_hop.id_bien_ban,
        'id_cuoc_hop': bien_ban_hop.id_cuoc_hop,
        'ban_ve_viec': bien_ban_hop.ban_ve_viec,
        'thong_nhat': bien_ban_hop.thong_nhat,
        'thoi_gian_lap': bien_ban_hop.thoi_gian_lap,
    }

    return return_response(data=data, msg="Xem biên bản họp thành công!")

@api.route('/check_cuoc_hop_has_bien_ban_hop/<id_cuoc_hop>/', methods=['GET'])
@login_required
@roles_required('Xem thong tin cuoc hop')
def check_cuoc_hop_has_bien_ban_hop(id_cuoc_hop):

    bien_ban_hop = BienBanHop.query.filter_by(id_cuoc_hop=id_cuoc_hop).first()
    if not bien_ban_hop:
        check = False
    else:
        check = True
    return return_response(data={"check": check})