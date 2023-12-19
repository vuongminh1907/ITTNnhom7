from functools import wraps 
from flask_login import current_user
from .utils import return_response
from http import HTTPStatus

def roles_required(*role_names, id=None): 
    def wrapper(view_function): 
        
        @wraps(view_function) 
        def decorator(*args, **kwargs): 
            authenticated = current_user.is_authenticated
            print(current_user.nhom)
            if not authenticated: 
                return return_response(
                    code=HTTPStatus.UNAUTHORIZED,
                    msg="Người dùng cần đăng nhập để tiếp tục."
                )
              
            # User must have the required roles 
            if not current_user.has_roles(*role_names):
                if id is not None:
                    if id == current_user.id_nguoi_dung:
                        return view_function(*args, **kwargs) 
                return return_response(
                    code=HTTPStatus.FORBIDDEN,
                    msg="Người dùng không có quyền truy cập chức năng này."
                ) 
                
            return view_function(*args, **kwargs) 
        
        return decorator
    
    return wrapper
    